import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { getServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user session
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Fetch user data from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        telefone: true,
        cpf: true,
        endereco: true,
        image: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ usuario: user })
  } catch (error: any) {
    logger.error('Error fetching user profile', { error: error?.message })
    return NextResponse.json(
      { error: 'Erro ao buscar perfil' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get authenticated user session
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Update user profile with Prisma
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name,
        telefone: body.telefone,
        cpf: body.cpf,
        endereco: body.endereco,
        // Note: email cannot be changed for security reasons
      },
      select: {
        id: true,
        name: true,
        email: true,
        telefone: true,
        cpf: true,
        endereco: true,
        image: true
      }
    })

    logger.info('User profile updated', { userId: session.user.id })

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso',
      usuario: updatedUser
    })
  } catch (error: any) {
    logger.error('Error updating user profile', { error: error?.message })
    return NextResponse.json(
      { error: 'Erro ao atualizar perfil' },
      { status: 500 }
    )
  }
}
