import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * NextAuth Route Handler
 * Handles all authentication requests: signin, signout, callback, session, etc.
 *
 * Routes handled:
 * - GET  /api/auth/signin
 * - POST /api/auth/signin/credentials
 * - GET  /api/auth/signout
 * - POST /api/auth/signout
 * - GET  /api/auth/callback/:provider
 * - POST /api/auth/callback/:provider
 * - GET  /api/auth/session
 * - GET  /api/auth/csrf
 * - GET  /api/auth/providers
 */

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
