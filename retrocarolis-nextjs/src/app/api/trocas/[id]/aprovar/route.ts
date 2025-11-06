import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseBody
} from '@/lib/api-helpers'

/**
 * POST /api/trocas/[id]/aprovar
 * Aprova uma troca/devolução
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await parseBody<{
      observacoesAprovacao?: string
      novaVendaId?: string
    }>(request)

    const troca = await prisma.$transaction(async (tx) => {
      const trocaAtual = await tx.troca.findUnique({
        where: { id: params.id },
        include: {
          venda: {
            include: {
              itens: {
                include: { produto: true }
              }
            }
          }
        }
      })

      if (!trocaAtual) {
        throw new Error('Troca não encontrada')
      }

      if (trocaAtual.status !== 'PENDENTE') {
        throw new Error('Troca já foi processada')
      }

      // Update troca status
      const trocaAtualizada = await tx.troca.update({
        where: { id: params.id },
        data: {
          status: 'APROVADA',
          dataAprovacao: new Date(),
          observacoesAprovacao: body.observacoesAprovacao,
          novaVendaId: body.novaVendaId
        }
      })

      // If DEVOLUCAO, revert products to ATIVO and cancel venda
      if (trocaAtual.tipo === 'DEVOLUCAO') {
        for (const item of trocaAtual.venda.itens) {
          await tx.produto.update({
            where: { id: item.produtoId },
            data: {
              status: 'ATIVO',
              dataVenda: null
            }
          })
        }

        // Mark original venda as devolvida
        await tx.venda.update({
          where: { id: trocaAtual.vendaId },
          data: {
            status: 'DEVOLVIDA'
          }
        })
      }

      // If TROCA with novaVendaId, link it
      if (trocaAtual.tipo === 'TROCA' && body.novaVendaId) {
        await tx.troca.update({
          where: { id: params.id },
          data: { novaVendaId: body.novaVendaId }
        })
      }

      return trocaAtualizada
    })

    return successResponse(troca)
  } catch (error) {
    return handleApiError(error)
  }
}
