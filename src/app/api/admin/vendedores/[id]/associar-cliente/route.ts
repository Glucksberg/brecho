import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/auth'
import { z } from 'zod'

/**
 * POST /api/admin/vendedores/[id]/associar-cliente
 * Associa uma conta CLIENTE a uma conta VENDEDOR
 * Permite que o cliente use privilégios de vendedor (descontos, etc)
 */

const associarClienteSchema = z.object({
  clienteEmail: z.string().email('Email inválido')
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await requireAdminAuth()) as any
    const body = await request.json()
    const data = associarClienteSchema.parse(body)

    const vendedorId = params.id

    // Verificar se vendedor existe e pertence ao mesmo brechó
    const vendedor = await prisma.user.findFirst({
      where: {
        id: vendedorId,
        role: 'VENDEDOR',
        brechoId: session.user!.brechoId
      }
    })

    if (!vendedor) {
      return NextResponse.json(
        { error: 'Vendedor não encontrado' },
        { status: 404 }
      )
    }

    // Buscar cliente pelo email
    const cliente = await prisma.user.findUnique({
      where: { email: data.clienteEmail }
    })

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se é CLIENTE
    if (cliente.role !== 'CLIENTE') {
      return NextResponse.json(
        { error: 'Apenas contas CLIENTE podem ser associadas a vendedores' },
        { status: 400 }
      )
    }

    // Verificar se cliente já está associado a outro vendedor
    if (cliente.vendedorId && cliente.vendedorId !== vendedorId) {
      return NextResponse.json(
        { error: 'Cliente já está associado a outro vendedor' },
        { status: 409 }
      )
    }

    // Associar cliente ao vendedor
    const clienteAtualizado = await prisma.user.update({
      where: { id: cliente.id },
      data: {
        vendedorId: vendedorId
      },
      select: {
        id: true,
        name: true,
        email: true,
        vendedorAssociado: {
          select: {
            id: true,
            name: true,
            email: true,
            comissao: true
          }
        }
      }
    })

    logger.info('Cliente associated with vendedor', {
      donoId: (session as any).user.id,
      vendedorId,
      clienteId: cliente.id,
      clienteEmail: cliente.email
    })

    return NextResponse.json({
      success: true,
      message: 'Cliente associado ao vendedor com sucesso',
      cliente: clienteAtualizado
    })

  } catch (error: any) {
    logger.error('Error associating cliente to vendedor', { error: error?.message })

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error?.message || 'Erro ao associar cliente' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/vendedores/[id]/associar-cliente
 * Remove associação entre cliente e vendedor
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdminAuth()
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId')

    if (!clienteId) {
      return NextResponse.json(
        { error: 'clienteId é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se cliente está associado a este vendedor
    const cliente = await prisma.user.findFirst({
      where: {
        id: clienteId,
        vendedorId: params.id
      }
    })

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente não está associado a este vendedor' },
        { status: 404 }
      )
    }

    // Remover associação
    await prisma.user.update({
      where: { id: clienteId },
      data: {
        vendedorId: null
      }
    })

    logger.info('Cliente dissociated from vendedor', {
      donoId: (session as any).user.id,
      vendedorId: params.id,
      clienteId
    })

    return NextResponse.json({
      success: true,
      message: 'Associação removida com sucesso'
    })

  } catch (error: any) {
    logger.error('Error removing cliente-vendedor association', { error: error?.message })

    return NextResponse.json(
      { error: error?.message || 'Erro ao remover associação' },
      { status: 500 }
    )
  }
}
