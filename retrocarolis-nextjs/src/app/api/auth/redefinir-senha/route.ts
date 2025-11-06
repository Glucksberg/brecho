import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const redefinirSenhaSchema = z.object({
  token: z.string(),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, senha } = redefinirSenhaSchema.parse(body)

    // Find user with valid token
    const usuario = await prisma.usuario.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token not expired
        }
      }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      )
    }

    // Hash new password
    const senhaHash = await hash(senha, 12)

    // Update password and clear reset token
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        senha: senhaHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json({
      message: 'Senha redefinida com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao redefinir senha:', error)

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
