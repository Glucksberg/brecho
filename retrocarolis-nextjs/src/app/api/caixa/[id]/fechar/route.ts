import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseBody,
  validateRequiredFields
} from '@/lib/api-helpers'
import type { FecharCaixaDTO } from '@/types'

/**
 * POST /api/caixa/[id]/fechar
 * Fecha o caixa
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await parseBody<FecharCaixaDTO>(request)

    const validation = validateRequiredFields(body, [
      'saldoFinal',
      'usuarioFechamentoId'
    ])

    if (validation) {
      return errorResponse(validation, 400)
    }

    const caixa = await prisma.caixa.findUnique({
      where: { id: params.id },
      include: {
        vendas: {
          where: { status: 'FINALIZADA' },
          select: {
            valorTotal: true,
            tipoPagamento: true
          }
        },
        despesas: {
          select: {
            valor: true
          }
        }
      }
    })

    if (!caixa) {
      return errorResponse('Caixa não encontrado', 404)
    }

    if (caixa.status === 'FECHADO') {
      return errorResponse('Caixa já está fechado', 400)
    }

    // Calculate totals by payment type
    const vendasDinheiro = caixa.vendas
      .filter(v => v.tipoPagamento === 'DINHEIRO')
      .reduce((sum, v) => sum + v.valorTotal, 0)

    const vendasCartaoDebito = caixa.vendas
      .filter(v => v.tipoPagamento === 'CARTAO_DEBITO')
      .reduce((sum, v) => sum + v.valorTotal, 0)

    const vendasCartaoCredito = caixa.vendas
      .filter(v => v.tipoPagamento === 'CARTAO_CREDITO')
      .reduce((sum, v) => sum + v.valorTotal, 0)

    const vendasPix = caixa.vendas
      .filter(v => v.tipoPagamento === 'PIX')
      .reduce((sum, v) => sum + v.valorTotal, 0)

    const totalDespesas = caixa.despesas.reduce((sum, d) => sum + d.valor, 0)

    const totalSangrias = body.totalSangrias || 0
    const totalReforcos = body.totalReforcos || 0

    // Calculate expected balance
    const saldoEsperado =
      caixa.saldoInicial +
      vendasDinheiro -
      totalDespesas -
      totalSangrias +
      totalReforcos

    const diferenca = body.saldoFinal - saldoEsperado

    // Update caixa
    const caixaFechado = await prisma.caixa.update({
      where: { id: params.id },
      data: {
        status: 'FECHADO',
        dataFechamento: new Date(),
        usuarioFechamentoId: body.usuarioFechamentoId,
        saldoFinal: body.saldoFinal,
        saldoEsperado,
        diferenca,
        vendasDinheiro,
        vendasCartaoDebito,
        vendasCartaoCredito,
        vendasPix,
        totalDespesas,
        totalSangrias,
        totalReforcos,
        observacoesFechamento: body.observacoesFechamento
      },
      include: {
        usuarioAbertura: {
          select: { id: true, nome: true }
        },
        usuarioFechamento: {
          select: { id: true, nome: true }
        }
      }
    })

    return successResponse(caixaFechado)
  } catch (error) {
    return handleApiError(error)
  }
}
