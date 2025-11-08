export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/api-helpers'
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths, subDays } from 'date-fns'

/**
 * GET /api/dashboard/stats
 * Retorna estatísticas do dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brechoId = searchParams.get('brechoId')

    if (!brechoId) {
      return successResponse({ error: 'brechoId é obrigatório' }, 400)
    }

    const hoje = new Date()
    const inicioHoje = startOfDay(hoje)
    const fimHoje = endOfDay(hoje)
    const inicioMes = startOfMonth(hoje)
    const fimMes = endOfMonth(hoje)
    const inicioMesAnterior = startOfMonth(subMonths(hoje, 1))
    const fimMesAnterior = endOfMonth(subMonths(hoje, 1))

    // Dia anterior para calcular crescimento diário
    const diaAnterior = subDays(hoje, 1)
    const inicioDiaAnterior = startOfDay(diaAnterior)
    const fimDiaAnterior = endOfDay(diaAnterior)

    // Vendas de hoje
    const vendasHoje = await prisma.venda.aggregate({
      where: {
        brechoId,
        status: 'PAGO',
        dataVenda: {
          gte: inicioHoje,
          lte: fimHoje
        }
      },
      _sum: { total: true },
      _count: true
    })

    // Vendas do dia anterior
    const vendasDiaAnterior = await prisma.venda.aggregate({
      where: {
        brechoId,
        status: 'PAGO',
        dataVenda: {
          gte: inicioDiaAnterior,
          lte: fimDiaAnterior
        }
      },
      _sum: { total: true }
    })

    // Vendas do mês
    const vendasMes = await prisma.venda.aggregate({
      where: {
        brechoId,
        status: 'PAGO',
        dataVenda: {
          gte: inicioMes,
          lte: fimMes
        }
      },
      _sum: { total: true },
      _count: true
    })

    // Vendas do mês anterior (para calcular crescimento)
    const vendasMesAnterior = await prisma.venda.aggregate({
      where: {
        brechoId,
        status: 'PAGO',
        dataVenda: {
          gte: inicioMesAnterior,
          lte: fimMesAnterior
        }
      },
      _sum: { total: true }
    })

    // Produtos ativos
    const produtosAtivos = await prisma.produto.count({
      where: {
        brechoId,
        ativo: true
      }
    })

    // Produtos vendidos no mês
    const produtosVendidosMes = await prisma.itemVenda.aggregate({
      where: {
        venda: {
          brechoId,
          status: 'PAGO',
          dataVenda: {
            gte: inicioMes,
            lte: fimMes
          }
        }
      },
      _sum: { quantidade: true }
    })

    // Caixa aberto
    const caixaAberto = await prisma.caixa.findFirst({
      where: {
        brechoId,
        status: 'ABERTO'
      }
    })

    // Calcula crescimento
    const calcularCrescimento = (atual: number, anterior: number) => {
      if (anterior === 0) return 0
      return ((atual - anterior) / anterior) * 100
    }

    const totalVendasHoje = (vendasHoje._sum.total as number) || 0
    const totalVendasDiaAnterior = (vendasDiaAnterior._sum.total as number) || 0
    const crescimentoDiario = calcularCrescimento(totalVendasHoje, totalVendasDiaAnterior)

    const totalVendasMes = (vendasMes._sum.total as number) || 0
    const totalVendasMesAnterior = (vendasMesAnterior._sum.total as number) || 0
    const crescimentoMensal = calcularCrescimento(totalVendasMes, totalVendasMesAnterior)

    // Ticket médio
    const ticketMedio = vendasMes._count > 0
      ? totalVendasMes / vendasMes._count
      : 0

    const stats = {
      vendasHoje: {
        total: totalVendasHoje,
        quantidade: vendasHoje._count,
        crescimento: Math.round(crescimentoDiario * 100) / 100
      },
      vendasMes: {
        total: totalVendasMes,
        quantidade: vendasMes._count,
        crescimento: Math.round(crescimentoMensal * 100) / 100
      },
      produtosAtivos,
      produtosVendidosMes: produtosVendidosMes._sum.quantidade || 0,
      ticketMedio: Math.round(ticketMedio * 100) / 100,
      caixaAberto: !!caixaAberto,
      saldoCaixa: caixaAberto?.saldoInicial || 0
    }

    return successResponse(stats)
  } catch (error) {
    return handleApiError(error)
  }
}
