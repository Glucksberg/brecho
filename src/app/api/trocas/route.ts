import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseBody,
  parsePaginationParams,
  buildPaginationResponse,
  validateRequiredFields
} from '@/lib/api-helpers'
import type { CreateTrocaDTO } from '@/types'

/**
 * GET /api/trocas
 * Lista todas as trocas/devoluções
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, perPage, skip, take } = parsePaginationParams(searchParams)

    const brechoId = searchParams.get('brechoId')
    const status = searchParams.get('status')
    const tipo = searchParams.get('tipo')

    const where: Prisma.TrocaWhereInput = {}

    if (brechoId) where.brechoId = brechoId
    if (status) where.status = status as any // Status comes from URL params
    if (tipo) where.tipo = tipo as any // Tipo comes from URL params

    const [trocas, total] = await Promise.all([
      prisma.troca.findMany({
        where,
        skip,
        take,
        orderBy: { dataSolicitacao: 'desc' },
        include: {
          venda: {
            include: {
              cliente: {
                select: { id: true, nome: true, email: true }
              },
              itens: {
                include: {
                  produto: {
                    select: { id: true, nome: true, preco: true }
                  }
                }
              }
            }
          },
          cliente: {
            select: { id: true, nome: true, email: true }
          }
        }
      }),
      prisma.troca.count({ where })
    ])

    const response = buildPaginationResponse(trocas, total, page, perPage)
    return successResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/trocas
 * Cria uma nova solicitação de troca/devolução
 */
export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<CreateTrocaDTO>(request)

    const validation = validateRequiredFields(body, [
      'vendaId',
      'tipo',
      'motivo',
      'brechoId'
    ])

    if (validation) {
      return errorResponse(validation, 400)
    }

    // Get venda details
    const venda = await prisma.venda.findUnique({
      where: { id: body.vendaId },
      include: {
        cliente: true,
        itens: {
          include: { produto: true }
        }
      }
    })

    if (!venda) {
      return errorResponse('Venda não encontrada', 404)
    }

    // Validate business rules based on origem
    const diasDesdeVenda = Math.floor(
      (Date.now() - venda.dataVenda.getTime()) / (1000 * 60 * 60 * 24)
    )

    // ONLINE: sempre pode devolver dentro de 7 dias (CDC)
    if (venda.origem === 'ONLINE' && diasDesdeVenda > 7) {
      return errorResponse('Prazo de 7 dias para devolução online expirado (CDC)', 400)
    }

    // PRESENCIAL: regra de negócio pode restringir devolução
    if (venda.origem === 'PRESENCIAL' && body.tipo === 'DEVOLUCAO') {
      return errorResponse(
        'Devolução para compras presenciais não permitida por política interna',
        400
      )
    }

    const troca = await prisma.troca.create({
      data: {
        brechoId: body.brechoId,
        vendaId: body.vendaId,
        clienteId: body.clienteId || venda.clienteId,
        origem: venda.origem,
        produtoOriginalId: venda.itens[0]?.produtoId || venda.itens[0]?.produto.id,
        valorProdutoOriginal: venda.itens[0]?.subtotal || 0,
        tipo: body.tipo,
        motivo: body.motivo,
        observacoes: body.observacoes,
        status: 'SOLICITADO'
      },
      include: {
        venda: {
          include: {
            cliente: true,
            itens: {
              include: { produto: true }
            }
          }
        }
      }
    })

    return successResponse(troca, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
