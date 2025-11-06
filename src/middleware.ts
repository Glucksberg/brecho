import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Middleware de autenticação e autorização
 *
 * Protege rotas que requerem autenticação:
 * - /admin/* - Apenas admin e dono
 * - /dashboard/* - Usuários autenticados
 * - /api/* (exceto auth) - APIs requerem autenticação
 */

// Rotas públicas que não requerem autenticação
const publicPaths = [
  '/',
  '/login',
  '/cadastro',
  '/loja',
  '/produto',
  '/carrinho',
  '/checkout',
  '/esqueci-senha',
  '/redefinir-senha',
]

// Rotas de API públicas
const publicApiPaths = [
  '/api/auth',
  '/api/webhooks',
  '/api/produtos',
  '/api/categorias',
  '/api/pagamento/criar-preferencia',
]

// Rotas que requerem admin
const adminPaths = [
  '/admin',
  '/relatorios',
  '/configuracoes',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Allow public API paths
  if (publicApiPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Get token from request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Not authenticated - redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check admin access
  if (adminPaths.some(path => pathname.startsWith(path))) {
    const userRole = token.role as string

    if (userRole !== 'ADMIN' && userRole !== 'DONO') {
      // Unauthorized - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Authenticated and authorized
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
