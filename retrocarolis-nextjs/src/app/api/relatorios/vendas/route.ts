import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-helpers'
import { startOfDay, endOfDay } from 'date-fns'

/**
 * GET /api/relatorios/vendas
 * Relatório de vendas com período
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brechoId = searchParams.get('brechoId')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')

    if (!brechoId) {
      return errorResponse('brechoId é obrigatório', 400)
    }

    if (!dataInicio || !dataFim) {
      return errorResponse('dataInicio e dataFim são obrigatórios', 400)
    }

    const inicio = startOfDay(new Date(dataInicio))
    const fim = endOfDay(new Date(dataFim))

    // Vendas no período
    const vendas = await prisma.venda.findMany({
      where: {
        brechoId,
        status: 'FINALIZADA',
        dataCriacao: {
          gte: inicio,
          lte: fim
        }
      },
      include: {
        vendedor: {
          select: { id: true, nome: true }
        },
        itens: {
          include: {
            produto: {
              select: { id: true, nome: true, categoria: true }
            }
          }
        }
      }
    })

    // Cálculos
    const totalVendas = vendas.reduce((sum, v) => sum + v.valorTotal, 0)
    const quantidadeVendas = vendas.length
    const ticketMedio = quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0

    // Vendas por dia
    const vendasPorDia = vendas.reduce((acc, venda) => {
      const dia = venda.dataCriacao.toISOString().split('T')[0]
      if (!acc[dia]) {
        acc[dia] = { data: new Date(dia), total: 0, quantidade: 0 }
      }
      acc[dia].total += venda.valorTotal
      acc[dia].quantidade += 1
      return acc
    }, {} as Record<string, any>)

    // Vendas por forma de pagamento
    const vendasPorFormaPagamento = vendas.reduce((acc, venda) => {
      const tipo = venda.tipoPagamento
      if (!acc[tipo]) {
        acc[tipo] = { tipo, total: 0, quantidade: 0, percentual: 0 }
      }
      acc[tipo].total += venda.valorTotal
      acc[tipo].quantidade += 1
      return acc
    }, {} as Record<string, any>)

    Object.values(vendasPorFormaPagamento).forEach((item: any) => {
      item.percentual = (item.total / totalVendas) * 100
    })

    // Vendas por vendedor
    const vendasPorVendedor = vendas.reduce((acc, venda) => {
      if (!venda.vendedor) return acc

      const vendedorId = venda.vendedor.id
      if (!acc[vendedorId]) {
        acc[vendedorId] = {
          vendedorId,
          vendedorNome: venda.vendedor.nome,
          total: 0,
          quantidade: 0,
          comissao: 0
        }
      }
      acc[vendedorId].total += venda.valorTotal
      acc[vendedorId].quantidade += 1
      // TODO: Calculate commission based on vendedor.comissao
      return acc
    }, {} as Record<string, any>)

    // Produtos mais vendidos
    const produtosVendidos = vendas.flatMap(v => v.itens)
    const produtosMaisVendidos = produtosVendidos.reduce((acc, item) => {
      const produtoId = item.produtoId
      if (!acc[produtoId]) {
        acc[produtoId] = {
          produtoId,
          produtoNome: item.produto.nome,
          quantidade: 0,
          total: 0
        }
      }
      acc[produtoId].quantidade += item.quantidade
      acc[produtoId].total += item.total
      return acc
    }, {} as Record<string, any>)

    const relatorio = {
      periodo: { inicio, fim },
      totalVendas,
      quantidadeVendas,
      ticketMedio: Math.round(ticketMedio * 100) / 100,
      vendasPorDia: Object.values(vendasPorDia),
      vendasPorFormaPagamento: Object.values(vendasPorFormaPagamento),
      vendasPorVendedor: Object.values(vendasPorVendedor),
      produtosMaisVendidos: Object.values(produtosMaisVendidos)
        .sort((a: any, b: any) => b.quantidade - a.quantidade)
        .slice(0, 10)
    }

    return successResponse(relatorio)
  } catch (error) {
    return handleApiError(error)
  }
}
