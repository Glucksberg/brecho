import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'
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
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // TODO: Send email with reset link
    // In production, use a service like SendGrid, AWS SES, or Resend
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/redefinir-senha?token=${resetToken}`

    console.log('=== PASSWORD RESET LINK ===')
    console.log(`User: ${user.email}`)
    console.log(`Link: ${resetLink}`)
    console.log('===========================')

    // For now, just log the link (in production, send email)
    // Example email content:
    // Subject: Redefinir Senha - Retrô Carólis
    // Body: Clique no link para redefinir sua senha: {resetLink}
    //       O link expira em 1 hora.

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
