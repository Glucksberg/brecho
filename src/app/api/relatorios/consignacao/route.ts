export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-helpers'
import { startOfDay, endOfDay } from 'date-fns'

/**
 * GET /api/relatorios/consignacao
 * Relatório de consignação por fornecedora
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brechoId = searchParams.get('brechoId')
    const fornecedoraId = searchParams.get('fornecedoraId')
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

    // Se fornecedoraId específica, gera relatório individual
    if (fornecedoraId) {
      const fornecedora = await prisma.fornecedora.findUnique({
        where: { id: fornecedoraId }
      })

      if (!fornecedora) {
        return errorResponse('Fornecedora não encontrada', 404)
      }

      // Produtos ativos
      const produtosAtivos = await prisma.produto.count({
        where: {
          fornecedoraId,
          ativo: true
        }
      })

      // Produtos vendidos no período
      const produtosVendidos = await prisma.produto.count({
        where: {
          fornecedoraId,
          vendido: true,
          dataVenda: {
            gte: inicio,
            lte: fim
          }
        }
      })

      // Créditos gerados, liberados, utilizados no período
      const creditos = await prisma.credito.findMany({
        where: {
          fornecedoraId,
          createdAt: {
            gte: inicio,
            lte: fim
          }
        }
      })

      const creditosGerados = creditos.reduce((sum, c) => sum + c.valorCredito, 0)
      const creditosLiberados = creditos
        .filter(c => c.status === 'LIBERADO')
        .reduce((sum, c) => sum + c.valorCredito, 0)
      const creditosUtilizados = creditos
        .filter(c => c.status === 'UTILIZADO')
        .reduce((sum, c) => sum + c.valorCredito, 0)

      // Crédito disponível (todos os liberados que não foram usados)
      const creditoDisponivelQuery = await prisma.credito.aggregate({
        where: {
          fornecedoraId,
          status: 'LIBERADO'
        },
        _sum: { valorCredito: true }
      })

      // Crédito pendente (todos os pendentes)
      const creditoPendenteQuery = await prisma.credito.aggregate({
        where: {
          fornecedoraId,
          status: 'PENDENTE'
        },
        _sum: { valorCredito: true }
      })

      // Total vendido no período
      const totalVendidoQuery = await prisma.credito.aggregate({
        where: {
          fornecedoraId,
          createdAt: {
            gte: inicio,
            lte: fim
          }
        },
        _sum: { valorVenda: true }
      })

      const relatorio = {
        fornecedoraId,
        fornecedoraNome: fornecedora.nome,
        periodo: { inicio, fim },
        produtosAtivos,
        produtosVendidos,
        totalVendido: totalVendidoQuery._sum.valorVenda || 0,
        creditosGerados,
        creditosLiberados,
        creditosUtilizados,
        creditoPendente: creditoPendenteQuery._sum.valorCredito || 0,
        creditoDisponivel: creditoDisponivelQuery._sum.valorCredito || 0,
        percentualRepasse: fornecedora.percentualRepasse
      }

      return successResponse(relatorio)
    }

    // Se não tem fornecedoraId, retorna resumo de todas
    const fornecedoras = await prisma.fornecedora.findMany({
      where: { brechoId, ativo: true }
    })

    const relatorios = await Promise.all(
      fornecedoras.map(async (fornecedora) => {
        const produtosAtivos = await prisma.produto.count({
          where: { fornecedoraId: fornecedora.id, ativo: true }
        })

        const produtosVendidos = await prisma.produto.count({
          where: {
            fornecedoraId: fornecedora.id,
            vendido: true,
            dataVenda: { gte: inicio, lte: fim }
          }
        })

        const totalVendido = await prisma.credito.aggregate({
          where: {
            fornecedoraId: fornecedora.id,
            createdAt: { gte: inicio, lte: fim }
          },
          _sum: { valorVenda: true }
        })

        const creditoDisponivel = await prisma.credito.aggregate({
          where: { fornecedoraId: fornecedora.id, status: 'LIBERADO' },
          _sum: { valorCredito: true }
        })

        return {
          fornecedoraId: fornecedora.id,
          fornecedoraNome: fornecedora.nome,
          produtosAtivos,
          produtosVendidos,
          totalVendido: totalVendido._sum.valorVenda || 0,
          creditoDisponivel: creditoDisponivel._sum.valorCredito || 0,
          percentualRepasse: fornecedora.percentualRepasse
        }
      })
    )

    return successResponse({
      periodo: { inicio, fim },
      fornecedoras: relatorios
    })
  } catch (error) {
    return handleApiError(error)
  }
}
