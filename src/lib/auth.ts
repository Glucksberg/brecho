import { NextAuthOptions, getServerSession as nextAuthGetServerSession } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'
import { logger } from './logger'
import type { SessionUser } from '@/types'
import { UserRole } from '@prisma/client'

function slugify(input: string): string {
  return (input || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

/**
 * Login via Portal de Licenças (CloudFarm)
 * Documentação recebida (2025-11-08)
 * - Endpoint: POST https://licensas.cloudfarm.ai/login-retrocarolis.php
 * - Body: { username, password, device_info? }
 * - Sucesso: { status: 'success', user_info, license_info, session { token, session_id, expires_at } }
 * - Erros: status 'error' | 'denied' | 'expired'
 */
async function loginWithLicensePortal(username: string, password: string) {
  const url =
    process.env.LICENSE_PORTAL_LOGIN_URL ||
    'https://licensas.cloudfarm.ai/login-retrocarolis.php'

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // device_info é opcional; portal gera se ausente
      body: JSON.stringify({
        username,
        password,
        device_info: {
          device_type: 'web'
        }
      }),
      cache: 'no-store'
    })

    // Pode retornar 200 com status lógico no JSON
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, data }
  } catch (error: any) {
    logger.error('License portal login request failed', {
      error: error?.message
    })
    return { ok: false, data: null, error }
  }
}

/**
 * NextAuth Configuration
 * Sistema de autenticação para Retrô Carólis
 *
 * CSRF Protection:
 * NextAuth fornece proteção CSRF automática para todas as rotas de autenticação.
 * O secret NEXTAUTH_SECRET é usado para gerar e validar tokens CSRF.
 *
 * ⚠️ IMPORTANTE: Para APIs customizadas (vendas, produtos, etc.), você deve
 * adicionar validação de sessão manualmente usando getServerSession().
 * Ver: CSRF_PROTECTION.md para mais informações.
 */

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('[AUTH] Starting authorization', { username: credentials?.username, hasPassword: !!credentials?.password })
          if (!credentials?.username || !credentials?.password) {
            console.log('[AUTH] Missing credentials')
            throw new Error('Usuário e senha são obrigatórios')
          }

          // 1) Tentar autenticar via Portal de Licenças
          console.log('[AUTH] Attempting license portal auth', { username: credentials.username })
          const portal = await loginWithLicensePortal(credentials.username, credentials.password)

          if (portal.ok && portal.data) {
            const status = portal.data?.status
            if (status === 'success') {
              // Sucesso no portal - usuário MASTER autorizado pelo portal
              const displayName = portal.data?.user_info?.display_name || credentials.username
              const email = portal.data?.user_info?.email || undefined
              const portalToken = portal.data?.session?.token as string | undefined
              const portalSessionId = portal.data?.session?.session_id as string | undefined
              const username = credentials.username

              console.log('[AUTH] License portal success', { username: credentials.username })
              logger.info('License portal auth success', { username: credentials.username })

              // Auto-provisioning: garantir User local e Brecho associados na primeira vez
              let provisionedBrechoId: string | undefined
              try {
                const existingUser = await prisma.user.findUnique({
                  where: { username },
                  include: { brecho: true }
                })

                if (existingUser?.brechoId) {
                  provisionedBrechoId = existingUser.brechoId
                } else {
                  // Criar brechó mínimo e vincular usuário DONO
                  const baseName = displayName || username
                  let baseSlug = slugify(baseName) || slugify(username)
                  if (!baseSlug) baseSlug = `brecho-${Date.now()}`
                  let slug = baseSlug
                  let i = 1
                  // garantir slug único
                  // eslint-disable-next-line no-constant-condition
                  while (true) {
                    const found = await prisma.brecho.findUnique({ where: { slug } })
                    if (!found) break
                    slug = `${baseSlug}-${i++}`
                  }

                  const result = await prisma.$transaction(async (tx) => {
                    const brecho = await tx.brecho.create({
                      data: {
                        nome: baseName,
                        slug,
                        ativo: true,
                        email: email
                      }
                    })

                    // e-mail único para usuário local
                    let userEmail = email || `${username}@${slug}.local`
                    let candidate = userEmail
                    let n = 1
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                      const foundUser = await tx.user.findUnique({ where: { email: candidate } })
                      if (!foundUser) break
                      const [local, ...domainParts] = userEmail.split('@')
                      const domain = domainParts.join('@') || 'local.local'
                      candidate = `${local}+${n++}@${domain}`
                    }
                    userEmail = candidate

                    await tx.user.upsert({
                      where: { username },
                      update: {
                        name: baseName,
                        email: userEmail,
                        role: UserRole.DONO,
                        brechoId: brecho.id,
                        ativo: true
                      },
                      create: {
                        name: baseName,
                        username,
                        email: userEmail,
                        role: UserRole.DONO,
                        brechoId: brecho.id,
                        ativo: true,
                        comissao: 0,
                        metaMensal: 0,
                        permissoes: []
                      }
                    })

                    return { brechoId: brecho.id }
                  })

                  provisionedBrechoId = result.brechoId
                }
              } catch (provErr: any) {
                logger.error('Auto-provisioning failed', { error: provErr?.message })
              }

              return {
                id: `portal:${credentials.username}`,
                name: displayName,
                username: credentials.username,
                email,
                role: UserRole.DONO, // Mapeando MASTER -> DONO local
                brechoId: provisionedBrechoId, // se provisionado, já vai habilitar dashboard
                fornecedoraId: undefined,
                avatar: undefined,
                permissoes: [],
                // campos extras transportados via jwt callback
                portalToken,
                portalSessionId
              } as any
            }

            // Tratar respostas conhecidas
            if (status === 'denied') {
              throw new Error('Acesso negado: disponível apenas para usuários MASTER')
            }
            if (status === 'expired') {
              throw new Error('Licença expirada. Contate o suporte para renovar.')
            }
            if (status === 'error') {
              const message = portal.data?.message || 'Erro de autenticação'
              throw new Error(message)
            }

            // Status inesperado
            throw new Error('Falha na autenticação pelo portal de licenças')
          }

          // 2) Sem fallback: portal obrigatório para validar assinatura ativa
          throw new Error('Serviço de licenças indisponível. Tente novamente.')
        } catch (error: any) {
          console.error('[AUTH] Authentication error', {
            error: error?.message,
            username: credentials?.username
          })
          logger.error('Authentication error', {
            error: error?.message,
            username: credentials?.username
          })
          throw error
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },

  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.brechoId = user.brechoId
        token.fornecedoraId = user.fornecedoraId
        token.avatar = user.avatar
        token.permissoes = user.permissoes || []
        // @ts-ignore
        if ((user as any).username) {
          // @ts-ignore
          token.username = (user as any).username
        }
        // Transportar dados do portal de licenças quando presentes
        // @ts-ignore
        if ((user as any).portalToken) {
          // @ts-ignore
          token.portalToken = (user as any).portalToken
        }
        // @ts-ignore
        if ((user as any).portalSessionId) {
          // @ts-ignore
          token.portalSessionId = (user as any).portalSessionId
        }
      }

      // Update session (when using update() from useSession)
      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        const sessionUser: SessionUser = {
          id: token.id as string,
          nome: token.name as string,
          email: token.email as string,
          tipo: token.role as UserRole,
          brechoId: token.brechoId as string,
          fornecedoraId: token.fornecedoraId as string | undefined,
          avatar: token.avatar as string | undefined,
          permissoes: (token.permissoes as string[]) || []
        }

        session.user = sessionUser
        // Expor também dados do portal de licenças na sessão
        // @ts-ignore
        session.licensePortal = {
          // @ts-ignore
          token: token.portalToken as string | undefined,
          // @ts-ignore
          sessionId: token.portalSessionId as string | undefined
        }
      }

      return session
    }
  },

  debug: process.env.NODE_ENV === 'development',
}

/**
 * Helper para obter sessão do servidor (Server Components)
 */
export async function getServerSession() {
  return await nextAuthGetServerSession(authOptions)
}

/**
 * Helper para verificar se usuário está autenticado
 */
export async function requireAuth() {
  const session = await getServerSession()

  if (!session || !session.user) {
    throw new Error('Não autenticado')
  }

  return session
}

/**
 * Helper para verificar se usuário tem acesso admin
 */
export async function requireAdminAuth() {
  const session = await requireAuth()

  if (session.user.tipo !== UserRole.ADMIN && session.user.tipo !== UserRole.DONO) {
    throw new Error('Acesso negado: requer permissões de administrador')
  }

  return session
}

/**
 * Helper para verificar se usuário pertence ao brechó
 */
export async function requireBrechoAccess(brechoId: string) {
  const session = await requireAuth()

  // Admin pode acessar qualquer brechó
  if (session.user.tipo === UserRole.ADMIN) {
    return session
  }

  // Outros usuários só podem acessar seu próprio brechó
  if (session.user.brechoId !== brechoId) {
    throw new Error('Acesso negado: você não tem permissão para acessar este brechó')
  }

  return session
}

export default authOptions
