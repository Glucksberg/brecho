import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // TODO: Get from authenticated user session
    // For now, return mock data from server
    const usuario = {
      nome: 'Maria Silva',
      email: 'maria@example.com',
      telefone: '(11) 98765-4321',
      cpf: '123.456.789-00',
      endereco: {
        rua: 'Rua das Flores',
        numero: '123',
        complemento: 'Apto 45',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567'
      }
    }

    return NextResponse.json({ usuario })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar perfil' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Update user profile with Prisma
    // For now, just return success

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso',
      usuario: body
    })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar perfil' },
      { status: 500 }
    )
  }
}
