import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { validarCPF, validarTelefone } from '@/lib/validators'

// Schema simplificado para auto-registro de CLIENTE
const cadastroSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  telefone: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validated = cadastroSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hash(validated.password, 12)

    // Get first Brecho (multi-tenant support)
    const brecho = await prisma.brecho.findFirst()

    if (!brecho) {
      return NextResponse.json(
        { error: 'Sistema não configurado. Aguarde configuração do brechó.' },
        { status: 503 }
      )
    }

    // Create CLIENTE user (auto-registro)
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: passwordHash,
        telefone: validated.telefone,
        role: 'CLIENTE',
        brechoId: null, // Cliente não está vinculado a um brechó específico inicialmente
        ativo: true,
        comissao: 0,
        metaMensal: 0,
        permissoes: []
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    logger.info('New CLIENTE registered', {
      userId: user.id,
      email: user.email
    })

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso',
      user
    }, { status: 201 })
  } catch (error: any) {
    logger.error('Error creating user', {
      error: error.message,
      name: error.name,
      isZodError: error.name === 'ZodError'
    })

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}
