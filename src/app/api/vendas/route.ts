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
import type { CreateVendaDTO } from '@/types'

/**
 * GET /api/vendas
 * Lista todas as vendas
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, perPage, skip, take } = parsePaginationParams(searchParams)

    const brechoId = searchParams.get('brechoId')
    const status = searchParams.get('status')
    const origem = searchParams.get('origem')
    const tipoPagamento = searchParams.get('tipoPagamento')
    const clienteId = searchParams.get('clienteId')
    const vendedorId = searchParams.get('vendedorId')

    const where: Prisma.VendaWhereInput = {}

    if (brechoId) where.brechoId = brechoId
    if (status) where.status = status as any // Status comes from URL params
    if (origem) where.origem = origem as any // Origem comes from URL params
    if (tipoPagamento) where.metodoPagamento = tipoPagamento
    if (clienteId) where.clienteId = clienteId
    if (vendedorId) where.vendedorId = vendedorId

    // Date filters
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')

    if (dataInicio || dataFim) {
      where.dataCriacao = {}
      if (dataInicio) where.dataCriacao.gte = new Date(dataInicio)
      if (dataFim) where.dataCriacao.lte = new Date(dataFim)
    }

    const [vendas, total] = await Promise.all([
      prisma.venda.findMany({
        where,
        skip,
        take,
        orderBy: { dataCriacao: 'desc' },
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          },
          vendedor: {
            select: {
              id: true,
              nome: true
            }
          },
          itens: {
            include: {
              produto: {
                select: {
                  id: true,
                  nome: true,
                  categoria: true
                }
              }
            }
          },
          _count: {
            select: { itens: true }
          }
        }
      }),
      prisma.venda.count({ where })
    ])

    const response = buildPaginationResponse(vendas, total, page, perPage)
    return successResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/vendas
 * Cria uma nova venda
 */
export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<CreateVendaDTO>(request)

    const validation = validateRequiredFields(body, [
      'origem',
      'tipoPagamento',
      'itens',
      'brechoId'
    ])

    if (validation) {
      return errorResponse(validation, 400)
    }

    if (!body.itens || body.itens.length === 0) {
      return errorResponse('A venda deve ter pelo menos um item', 400)
    }

    // Calculate totals
    let valorProdutos = 0
    for (const item of body.itens) {
      valorProdutos += item.precoUnitario * item.quantidade - (item.desconto || 0)
    }

    const desconto = body.desconto || 0
    const valorCreditoUtilizado = body.valorCreditoUtilizado || 0
    const valorTotal = valorProdutos - desconto - valorCreditoUtilizado

    // Create venda with transaction
    const venda = await prisma.$transaction(async (tx) => {
      // Create venda
      const novaVenda = await tx.venda.create({
        data: {
          brechoId: body.brechoId,
          clienteId: body.clienteId,
          vendedorId: body.vendedorId,
          origem: body.origem,
          tipoPagamento: body.tipoPagamento,
          valorProdutos,
          desconto,
          valorTotal,
          status: 'FINALIZADA',
          creditoUtilizadoId: body.creditoUtilizadoId,
          valorCreditoUtilizado,
          caixaId: body.caixaId
        }
      })

      // Create itens
      for (const item of body.itens) {
        await tx.itemVenda.create({
          data: {
            vendaId: novaVenda.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            desconto: item.desconto || 0,
            total: item.precoUnitario * item.quantidade - (item.desconto || 0)
          }
        })

        // Update produto status
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            status: 'VENDIDO',
            dataVenda: new Date()
          }
        })

        // If consignado, create credito
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
          include: { fornecedora: true }
        })

        if (produto && produto.tipo === 'CONSIGNADO' && produto.fornecedoraId) {
          const valorVenda = item.precoUnitario * item.quantidade - (item.desconto || 0)
          const percentualRepasse = produto.fornecedora?.percentualRepasse || 60
          const valorCredito = (valorVenda * percentualRepasse) / 100

          // Calculate release date (30 days from now)
          const dataLiberacao = new Date()
          dataLiberacao.setDate(dataLiberacao.getDate() + 30)

          await tx.credito.create({
            data: {
              fornecedoraId: produto.fornecedoraId,
              vendaId: novaVenda.id,
              itemVendaId: item.produtoId,
              valorVenda,
              percentualRepasse,
              valorCredito,
              status: 'PENDENTE',
              dataLiberacao,
              tipo: 'VENDA'
            }
          })
        }
      }

      // Update caixa if exists
      if (body.caixaId && body.tipoPagamento === 'DINHEIRO') {
        await tx.caixa.update({
          where: { id: body.caixaId },
          data: {
            saldoAtual: { increment: valorTotal },
            vendasDinheiro: { increment: valorTotal }
          }
        })
      }

      // Mark credito as used if provided
      if (body.creditoUtilizadoId) {
        await tx.credito.update({
          where: { id: body.creditoUtilizadoId },
          data: {
            status: 'UTILIZADO',
            utilizadoEmVendaId: novaVenda.id,
            dataUtilizacao: new Date()
          }
        })
      }

      return novaVenda
    })

    // Fetch complete venda
    const vendaCompleta = await prisma.venda.findUnique({
      where: { id: venda.id },
      include: {
        cliente: true,
        vendedor: true,
        itens: {
          include: {
            produto: true
          }
        }
      }
    })

    return successResponse(vendaCompleta, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
