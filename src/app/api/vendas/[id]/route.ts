import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession, requireAuth, requireBrechoAccess } from '@/lib/auth'
import {
  successResponse,
  errorResponse,
  handleApiError
} from '@/lib/api-helpers'

/**
 * GET /api/vendas/[id]
 * Obtém uma venda específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication
    await requireAuth()

    const venda = await prisma.venda.findUnique({
      where: { id: params.id },
      include: {
        cliente: true,
        vendedor: true,
        itens: {
          include: {
            produto: {
              include: {
                fornecedora: true
              }
            }
          }
        },
        trocas: true
      }
    })

    if (!venda) {
      return errorResponse('Venda não encontrada', 404)
    }

    // Check if user has access to this brecho
    await requireBrechoAccess(venda.brechoId)

    return successResponse(venda)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/vendas/[id]/cancelar
 * Cancela uma venda
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication and admin permissions
    await requireAuth()

    const venda = await prisma.$transaction(async (tx) => {
      const vendaAtual = await tx.venda.findUnique({
        where: { id: params.id },
        include: { itens: true }
      })

      if (!vendaAtual) {
        throw new Error('Venda não encontrada')
      }

      if (vendaAtual.status === 'CANCELADO') {
        throw new Error('Venda já está cancelada')
      }

      // Update venda status
      const vendaAtualizada = await tx.venda.update({
        where: { id: params.id },
        data: {
          status: 'CANCELADO'
        }
      })

      // Revert produtos status
      for (const item of vendaAtual.itens) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            ativo: true,
            vendido: false,
            dataVenda: null
          }
        })
      }

      return vendaAtualizada
    })

    return successResponse(venda)
  } catch (error) {
    return handleApiError(error)
  }
}
