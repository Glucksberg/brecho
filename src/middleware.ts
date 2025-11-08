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

// Rotas que requerem ser fornecedora
const fornecedoraPaths = [
  '/portal-fornecedora',
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

  // If authenticated but without brechoId, force onboarding except for allowed paths
  const onboardingAllowed = [
    '/onboarding',
    '/api/onboarding',
  ]
  const hasBrecho = !!(token as any).brechoId
  const isOnboardingPath = onboardingAllowed.some(path => pathname.startsWith(path))
  if (!hasBrecho && !isOnboardingPath) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // Check admin access
  if (adminPaths.some(path => pathname.startsWith(path))) {
    const userRole = token.role as string

    if (userRole !== 'ADMIN' && userRole !== 'DONO') {
      // Unauthorized - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Check portal de fornecedora access
  // CLIENTE com fornecedoraId pode acessar
  if (fornecedoraPaths.some(path => pathname.startsWith(path))) {
    const fornecedoraId = token.fornecedoraId as string | undefined

    if (!fornecedoraId) {
      // Not a fornecedora - redirect to loja
      return NextResponse.redirect(new URL('/loja', request.url))
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
