import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseBody,
  validateRequiredFields
} from '@/lib/api-helpers'
import type { CreateCaixaDTO, FecharCaixaDTO } from '@/types'

/**
 * GET /api/caixa
 * Obtém caixa aberto ou lista caixas
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brechoId = searchParams.get('brechoId')
    const status = searchParams.get('status')

    if (!brechoId) {
      return errorResponse('brechoId é obrigatório', 400)
    }

    // Se status='ABERTO', retorna o caixa aberto
    if (status === 'ABERTO') {
      const caixaAberto = await prisma.caixa.findFirst({
        where: {
          brechoId,
          status: 'ABERTO'
        },
        include: {
          usuarioAbertura: {
            select: { id: true, nome: true }
          },
          vendas: {
            where: { status: 'FINALIZADA' },
            select: {
              id: true,
              valorTotal: true,
              tipoPagamento: true
            }
          },
          despesas: {
            select: {
              id: true,
              descricao: true,
              valor: true
            }
          }
        }
      })

      if (!caixaAberto) {
        return successResponse(null)
      }

      return successResponse(caixaAberto)
    }

    // Lista todos os caixas (fechados e abertos)
    const caixas = await prisma.caixa.findMany({
      where: { brechoId },
      orderBy: { dataAbertura: 'desc' },
      take: 50,
      include: {
        usuarioAbertura: {
          select: { id: true, nome: true }
        },
        usuarioFechamento: {
          select: { id: true, nome: true }
        },
        _count: {
          select: {
            vendas: true,
            despesas: true
          }
        }
      }
    })

    return successResponse(caixas)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/caixa
 * Abre um novo caixa
 */
export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<CreateCaixaDTO>(request)

    const validation = validateRequiredFields(body, [
      'saldoInicial',
      'usuarioAberturaId',
      'brechoId'
    ])

    if (validation) {
      return errorResponse(validation, 400)
    }

    // Check if there's already an open caixa
    const caixaAberto = await prisma.caixa.findFirst({
      where: {
        brechoId: body.brechoId,
        status: 'ABERTO'
      }
    })

    if (caixaAberto) {
      return errorResponse('Já existe um caixa aberto. Feche-o antes de abrir um novo.', 400)
    }

    const caixa = await prisma.caixa.create({
      data: {
        brechoId: body.brechoId,
        usuarioAberturaId: body.usuarioAberturaId,
        saldoInicial: body.saldoInicial,
        saldoAtual: body.saldoInicial,
        status: 'ABERTO',
        observacoes: body.observacoes
      },
      include: {
        usuarioAbertura: {
          select: { id: true, nome: true }
        }
      }
    })

    return successResponse(caixa, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
