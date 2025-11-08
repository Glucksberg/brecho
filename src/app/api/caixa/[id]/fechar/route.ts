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
      where: { id: params.id }
    })

    if (!caixa) {
      return errorResponse('Caixa não encontrado', 404)
    }

    if (caixa.status === 'FECHADO') {
      return errorResponse('Caixa já está fechado', 400)
    }

    // Buscar vendas no período do caixa (dataAbertura -> agora)
    const vendas = await prisma.venda.findMany({
      where: {
        brechoId: caixa.brechoId,
        status: 'PAGO',
        dataVenda: {
          gte: caixa.dataAbertura,
          lte: new Date()
        }
      },
      select: {
        total: true,
        formaPagamento: true
      }
    })

    // Calculate totals by payment type
    const vendasDinheiro = vendas
      .filter(v => v.formaPagamento === 'DINHEIRO')
      .reduce((sum, v) => sum + v.total, 0)

    const vendasPix = vendas
      .filter(v => v.formaPagamento === 'PIX')
      .reduce((sum, v) => sum + v.total, 0)

    const vendasTransferencia = vendas
      .filter(v => v.formaPagamento === 'TRANSFERENCIA')
      .reduce((sum, v) => sum + v.total, 0)

    const vendasCartao = vendas
      .filter(v => ['CARTAO', 'CARTAO_DEBITO', 'CARTAO_CREDITO'].includes(v.formaPagamento as any))
      .reduce((sum, v) => sum + v.total, 0)

    // Despesas do período
    const despesas = await prisma.despesa.findMany({
      where: {
        brechoId: caixa.brechoId,
        status: 'PAGO',
        dataPagamento: {
          gte: caixa.dataAbertura,
          lte: new Date()
        }
      },
      select: { valor: true }
    })
    const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0)

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
        saldoInformado: body.saldoFinal,
        saldoEsperado,
        diferenca,
        vendasDinheiro,
        vendasCartao,
        vendasPix,
        vendasTransferencia,
        totalDespesas,
        totalSangrias,
        totalReforcos,
        observacoes: body.observacoesFechamento
      },
      include: {
        operador: { select: { id: true, name: true, email: true } }
      }
    })

    return successResponse(caixaFechado)
  } catch (error) {
    return handleApiError(error)
  }
}
