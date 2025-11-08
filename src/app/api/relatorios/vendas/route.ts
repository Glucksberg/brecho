export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-helpers'
import { startOfDay, endOfDay } from 'date-fns'

interface VendaDia {
  data: Date
  total: number
  quantidade: number
}

interface VendaFormaPagamento {
  tipo: string
  total: number
  quantidade: number
  percentual: number
}

interface VendaVendedor {
  vendedorId: string
  vendedorNome: string
  total: number
  quantidade: number
  comissao: number
}

interface ProdutoVendido {
  produtoId: string
  produtoNome: string
  quantidade: number
  total: number
}

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
        status: 'PAGO',
        dataVenda: {
          gte: inicio,
          lte: fim
        }
      },
      include: {
        vendedor: {
          select: { id: true, name: true, comissao: true }
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
    const totalVendas = vendas.reduce((sum, v) => sum + v.total, 0)
    const quantidadeVendas = vendas.length
    const ticketMedio = quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0

    // Vendas por dia
    const vendasPorDia = vendas.reduce((acc, venda) => {
      const dia = venda.dataVenda.toISOString().split('T')[0]
      if (!acc[dia]) {
        acc[dia] = { data: new Date(dia), total: 0, quantidade: 0 }
      }
      acc[dia].total += venda.total
      acc[dia].quantidade += 1
      return acc
    }, {} as Record<string, VendaDia>)

    // Vendas por forma de pagamento
    const vendasPorFormaPagamento = vendas.reduce((acc, venda) => {
      const tipo = (venda.formaPagamento as string) || 'OUTROS'
      if (!acc[tipo]) {
        acc[tipo] = { tipo, total: 0, quantidade: 0, percentual: 0 }
      }
      acc[tipo].total += venda.total
      acc[tipo].quantidade += 1
      return acc
    }, {} as Record<string, VendaFormaPagamento>)

    Object.values(vendasPorFormaPagamento).forEach((item) => {
      item.percentual = (item.total / totalVendas) * 100
    })

    // Vendas por vendedor
    const vendasPorVendedor = vendas.reduce((acc, venda) => {
      if (!venda.vendedor) return acc

      const vendedorId = venda.vendedor.id
      if (!acc[vendedorId]) {
        acc[vendedorId] = {
          vendedorId,
          vendedorNome: venda.vendedor.name || 'Sem nome',
          total: 0,
          quantidade: 0,
          comissao: 0
        }
      }
      acc[vendedorId].total += venda.total
      acc[vendedorId].quantidade += 1
      // Calculate commission based on vendedor.comissao percentage
      const comissaoVenda = venda.total * (venda.vendedor.comissao / 100)
      acc[vendedorId].comissao += comissaoVenda
      return acc
    }, {} as Record<string, VendaVendedor>)

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
      acc[produtoId].total += item.subtotal
      return acc
    }, {} as Record<string, ProdutoVendido>)

    const relatorio = {
      periodo: { inicio, fim },
      totalVendas,
      quantidadeVendas,
      ticketMedio: Math.round(ticketMedio * 100) / 100,
      vendasPorDia: Object.values(vendasPorDia),
      vendasPorFormaPagamento: Object.values(vendasPorFormaPagamento),
      vendasPorVendedor: Object.values(vendasPorVendedor),
      produtosMaisVendidos: Object.values(produtosMaisVendidos)
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 10)
    }

    return successResponse(relatorio)
  } catch (error) {
    return handleApiError(error)
  }
}
