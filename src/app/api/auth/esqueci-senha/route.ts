import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes, createHash } from 'crypto'
import { z } from 'zod'

const esqueciSenhaSchema = z.object({
  email: z.string().email('Email inválido')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = esqueciSenhaSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'Se o email existe, um link de recuperação foi enviado'
      })
    }

    // Generate reset token (valid for 1 hour)
    // Generate a random token that will be sent via email
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Hash the token before storing in database (SHA-256)
    // This way if DB is compromised, attacker can't use tokens to reset passwords
    const hashedToken = createHash('sha256').update(resetToken).digest('hex')

    // Save HASHED token to database (NOT the original)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry
      }
    })

    // Send password reset email
    // IMPORTANT: Send the ORIGINAL token (not hashed) via email
    const { sendPasswordResetEmail } = await import('@/lib/email')

    await sendPasswordResetEmail({
      email: user.email,
      name: user.name || 'Usuário',
      resetToken
    })

    return NextResponse.json({
      message: 'Se o email existe, um link de recuperação foi enviado'
    })
  } catch (error: any) {
    console.error('Erro ao processar esqueci senha:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}
