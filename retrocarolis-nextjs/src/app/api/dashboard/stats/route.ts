import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/api-helpers'
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths } from 'date-fns'

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

    // Vendas de hoje
    const vendasHoje = await prisma.venda.aggregate({
      where: {
        brechoId,
        status: 'FINALIZADA',
        dataCriacao: {
          gte: inicioHoje,
          lte: fimHoje
        }
      },
      _sum: { valorTotal: true },
      _count: true
    })

    // Vendas do mês
    const vendasMes = await prisma.venda.aggregate({
      where: {
        brechoId,
        status: 'FINALIZADA',
        dataCriacao: {
          gte: inicioMes,
          lte: fimMes
        }
      },
      _sum: { valorTotal: true },
      _count: true
    })

    // Vendas do mês anterior (para calcular crescimento)
    const vendasMesAnterior = await prisma.venda.aggregate({
      where: {
        brechoId,
        status: 'FINALIZADA',
        dataCriacao: {
          gte: inicioMesAnterior,
          lte: fimMesAnterior
        }
      },
      _sum: { valorTotal: true }
    })

    // Produtos ativos
    const produtosAtivos = await prisma.produto.count({
      where: {
        brechoId,
        status: 'ATIVO'
      }
    })

    // Produtos vendidos no mês
    const produtosVendidosMes = await prisma.itemVenda.aggregate({
      where: {
        venda: {
          brechoId,
          status: 'FINALIZADA',
          dataCriacao: {
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

    const totalVendasMes = vendasMes._sum.valorTotal || 0
    const totalVendasMesAnterior = vendasMesAnterior._sum.valorTotal || 0
    const crescimento = calcularCrescimento(totalVendasMes, totalVendasMesAnterior)

    // Ticket médio
    const ticketMedio = vendasMes._count > 0
      ? totalVendasMes / vendasMes._count
      : 0

    const stats = {
      vendasHoje: {
        total: vendasHoje._sum.valorTotal || 0,
        quantidade: vendasHoje._count,
        crescimento: 0 // TODO: Calcular crescimento vs dia anterior
      },
      vendasMes: {
        total: totalVendasMes,
        quantidade: vendasMes._count,
        crescimento: Math.round(crescimento * 100) / 100
      },
      produtosAtivos,
      produtosVendidosMes: produtosVendidosMes._sum.quantidade || 0,
      ticketMedio: Math.round(ticketMedio * 100) / 100,
      caixaAberto: !!caixaAberto,
      saldoCaixa: caixaAberto?.saldoAtual || 0
    }

    return successResponse(stats)
  } catch (error) {
    return handleApiError(error)
  }
}
