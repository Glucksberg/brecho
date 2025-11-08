export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/api-helpers'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * GET /api/dashboard/vendas-recentes
 * Retorna as vendas mais recentes
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brechoId = searchParams.get('brechoId')
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!brechoId) {
      return successResponse({ error: 'brechoId é obrigatório' }, 400)
    }

    // Fetch recent finalized sales
    const vendas = await prisma.venda.findMany({
      where: {
        brechoId,
        status: 'PAGO'
      },
      orderBy: {
        dataVenda: 'desc'
      },
      take: limit,
      include: {
        cliente: {
          select: {
            nome: true
          }
        },
        itens: {
          select: {
            id: true
          }
        }
      }
    })

    // Format sales for display
    const vendasFormatadas = vendas.map(venda => ({
      id: venda.id,
      cliente: venda.cliente.nome,
      valor: venda.total,
      produtos: venda.itens.length,
      tempo: formatDistanceToNow(venda.dataVenda, {
        addSuffix: true,
        locale: ptBR
      })
    }))

    return successResponse({ vendas: vendasFormatadas })
  } catch (error) {
    return handleApiError(error)
  }
}
