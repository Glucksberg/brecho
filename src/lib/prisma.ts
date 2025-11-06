import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client Singleton
 *
 * Prevents multiple instances of Prisma Client in development
 * due to hot-reloading in Next.js
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
