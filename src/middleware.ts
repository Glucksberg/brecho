import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware para Next.js
 * Executa antes de cada requisição
 *
 * Funções:
 * - Autenticação (verificar se usuário está logado)
 * - Autorização (verificar permissões de acesso)
 * - Multi-tenant (identificar brechó pelo domínio)
 * - Redirect de rotas
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes que não requerem autenticação
  const publicRoutes = ['/login', '/loja', '/api/auth']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // TODO: Implementar verificação de autenticação
  // const token = request.cookies.get('next-auth.session-token')
  // if (!token) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  // TODO: Implementar verificação de permissões
  // const user = await getUser(token)
  // if (!canAccessRoute(user, pathname)) {
  //   return NextResponse.redirect(new URL('/unauthorized', request.url))
  // }

  // TODO: Implementar multi-tenant por domínio
  // const hostname = request.headers.get('host')
  // const brecho = await getBrechoByDomain(hostname)
  // if (!brecho) {
  //   return NextResponse.redirect(new URL('/not-found', request.url))
  // }

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
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
