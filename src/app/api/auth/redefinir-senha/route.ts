import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { createHash } from 'crypto'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const redefinirSenhaSchema = z.object({
  token: z.string(),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, senha } = redefinirSenhaSchema.parse(body)

    // Hash the incoming token to compare with stored hash
    // Tokens are stored as SHA-256 hashes for security
    const hashedToken = createHash('sha256').update(token).digest('hex')

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken, // Compare with hashed token
        resetTokenExpiry: {
          gt: new Date() // Token not expired
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      )
    }

    // Hash new password
    const passwordHash = await hash(senha, 12)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json({
      message: 'Senha redefinida com sucesso'
    })
  } catch (error: any) {
    logger.error('Error resetting password', {
      error: error.message,
      name: error.name
    })

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao redefinir senha' },
      { status: 500 }
    )
  }
}
