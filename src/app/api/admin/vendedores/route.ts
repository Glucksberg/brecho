import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { getServerSession, requireAdminAuth } from '@/lib/auth'
import { hash } from 'bcryptjs'
import { z } from 'zod'

/**
 * GET /api/admin/vendedores
 * Lista todos os vendedores do brechó
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAdminAuth()

    const vendedores = await prisma.user.findMany({
      where: {
        brechoId: session.user.brechoId,
        role: 'VENDEDOR',
        ativo: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        telefone: true,
        comissao: true,
        metaMensal: true,
        createdAt: true,
        clientesAssociados: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ vendedores })
  } catch (error: any) {
    logger.error('Error fetching vendedores', { error: error?.message })
    return NextResponse.json(
      { error: error?.message || 'Erro ao buscar vendedores' },
      { status: error?.message === 'Acesso negado: requer permissões de administrador' ? 403 : 500 }
    )
  }
}

/**
 * POST /api/admin/vendedores
 * Cria um novo vendedor (apenas DONO/ADMIN)
 */
const createVendedorSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  telefone: z.string().optional(),
  cpf: z.string().optional(),
  comissao: z.number().min(0).max(100).default(5),
  metaMensal: z.number().min(0).default(0)
})

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminAuth()

    const body = await request.json()
    const data = createVendedorSchema.parse(body)

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      )
    }

    // Hash da senha
    const hashedPassword = await hash(data.password, 12)

    // Criar vendedor
    const vendedor = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        telefone: data.telefone,
        cpf: data.cpf,
        role: 'VENDEDOR',
        brechoId: session.user.brechoId,
        comissao: data.comissao,
        metaMensal: data.metaMensal,
        ativo: true,
        permissoes: []
      },
      select: {
        id: true,
        name: true,
        email: true,
        telefone: true,
        comissao: true,
        metaMensal: true,
        createdAt: true
      }
    })

    logger.info('Vendedor created by DONO', {
      donoId: session.user.id,
      vendedorId: vendedor.id,
      email: vendedor.email
    })

    return NextResponse.json({
      success: true,
      message: 'Vendedor criado com sucesso',
      vendedor
    }, { status: 201 })

  } catch (error: any) {
    logger.error('Error creating vendedor', { error: error?.message })

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error?.message || 'Erro ao criar vendedor' },
      { status: error?.message === 'Acesso negado: requer permissões de administrador' ? 403 : 500 }
    )
  }
}
