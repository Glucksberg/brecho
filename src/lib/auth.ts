import { NextAuthOptions, getServerSession as nextAuthGetServerSession } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'
import { logger } from './logger'
import type { SessionUser } from '@/types'
import { UserRole } from '@prisma/client'

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
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        // Busca usuário no banco
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            brecho: true,
            fornecedora: true
          }
        })

        if (!user) {
          throw new Error('Credenciais inválidas')
        }

        if (!user.ativo) {
          throw new Error('Usuário inativo. Entre em contato com o administrador.')
        }

        // Verify password
        if (!user.password) {
          logger.error('User has no password set', { userId: user.id, email: user.email })
          throw new Error('Credenciais inválidas')
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          logger.warn('Invalid password attempt', { email: user.email })
          throw new Error('Credenciais inválidas')
        }

        logger.info('User authenticated successfully', { userId: user.id, email: user.email })

        // Return authenticated user
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          brechoId: user.brechoId,
          fornecedoraId: user.fornecedoraId,
          avatar: user.image,
          permissoes: user.permissoes
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
