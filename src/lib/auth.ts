import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'
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

        // Verifica senha (assumindo que você tem uma coluna 'senha' no User)
        // TODO: Adicionar coluna 'senha' no schema.prisma se ainda não existir
        // const isPasswordValid = await compare(credentials.password, user.senha)

        // Por enquanto, vamos usar uma verificação simples (REMOVER EM PRODUÇÃO)
        // const isPasswordValid = credentials.password === 'senha123'

        // if (!isPasswordValid) {
        //   throw new Error('Credenciais inválidas')
        // }

        // Retorna usuário autenticado
        return {
          id: user.id,
          name: user.nome,
          email: user.email,
          tipo: user.tipo,
          brechoId: user.brechoId,
          fornecedoraId: user.fornecedoraId,
          avatar: user.avatar,
          permissoes: user.permissoes as string[]
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
        token.tipo = user.tipo
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
          tipo: token.tipo as UserRole,
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
  // TODO: Implementar quando tiver getServerSession do next-auth
  // return await getServerSession(authOptions)
  return null
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
