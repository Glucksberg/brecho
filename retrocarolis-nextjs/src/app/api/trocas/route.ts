import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
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

    const where: any = {}

    if (brechoId) where.brechoId = brechoId
    if (status) where.status = status
    if (tipo) where.tipo = tipo

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
          },
          novaVenda: {
            select: { id: true, valorTotal: true }
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
      (Date.now() - venda.dataCriacao.getTime()) / (1000 * 60 * 60 * 24)
    )

    // ONLINE: sempre pode devolver dentro de 7 dias (CDC)
    if (venda.origem === 'ONLINE' && diasDesdeVenda > 7) {
      return errorResponse('Prazo de 7 dias para devolução online expirado (CDC)', 400)
    }

    // PRESENCIAL SEM DEFEITO: não permite devolução em dinheiro
    if (
      venda.origem === 'PRESENCIAL' &&
      body.motivo === 'TAMANHO_INADEQUADO' &&
      body.tipo === 'DEVOLUCAO'
    ) {
      return errorResponse(
        'Trocas presenciais sem defeito não permitem devolução em dinheiro',
        400
      )
    }

    const troca = await prisma.troca.create({
      data: {
        brechoId: body.brechoId,
        vendaId: body.vendaId,
        clienteId: body.clienteId || venda.clienteId,
        tipo: body.tipo,
        motivo: body.motivo,
        observacoes: body.observacoes,
        status: 'PENDENTE',
        produtosTroca: body.produtosTroca || []
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
