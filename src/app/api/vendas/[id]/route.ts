import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
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
        creditoUtilizado: true,
        caixa: true,
        trocas: true
      }
    })

    if (!venda) {
      return errorResponse('Venda não encontrada', 404)
    }

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
    // TODO: Add authorization check

    const venda = await prisma.$transaction(async (tx) => {
      const vendaAtual = await tx.venda.findUnique({
        where: { id: params.id },
        include: { itens: true }
      })

      if (!vendaAtual) {
        throw new Error('Venda não encontrada')
      }

      if (vendaAtual.status === 'CANCELADA') {
        throw new Error('Venda já está cancelada')
      }

      // Update venda status
      const vendaAtualizada = await tx.venda.update({
        where: { id: params.id },
        data: {
          status: 'CANCELADA',
          dataAtualizacao: new Date()
        }
      })

      // Revert produtos status
      for (const item of vendaAtual.itens) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            status: 'ATIVO',
            dataVenda: null
          }
        })
      }

      // Cancel creditos
      await tx.credito.updateMany({
        where: { vendaId: params.id },
        data: { status: 'CANCELADO' }
      })

      // Revert caixa if needed
      if (vendaAtual.caixaId && vendaAtual.tipoPagamento === 'DINHEIRO') {
        await tx.caixa.update({
          where: { id: vendaAtual.caixaId },
          data: {
            saldoAtual: { decrement: vendaAtual.valorTotal },
            vendasDinheiro: { decrement: vendaAtual.valorTotal }
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
