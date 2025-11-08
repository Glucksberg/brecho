export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/api-helpers'

/**
 * GET /api/dashboard/estoque-baixo
 * Retorna produtos com estoque baixo (estoque <= 2 e não vendidos)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brechoId = searchParams.get('brechoId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!brechoId) {
      return successResponse({ error: 'brechoId é obrigatório' }, 400)
    }

    // Fetch products with low stock
    const produtos = await prisma.produto.findMany({
      where: {
        brechoId,
        ativo: true,
        vendido: false,
        estoque: {
          lte: 2,
          gt: 0
        }
      },
      orderBy: {
        estoque: 'asc'
      },
      take: limit,
      select: {
        id: true,
        nome: true,
        estoque: true,
        categoria: true
      }
    })

    return successResponse({ produtos })
  } catch (error) {
    return handleApiError(error)
  }
}
