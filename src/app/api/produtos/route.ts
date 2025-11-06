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
import type { CreateProdutoDTO } from '@/types'

/**
 * GET /api/produtos
 * Lista todos os produtos com paginação e filtros
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, perPage, skip, take } = parsePaginationParams(searchParams)

    // Filtros
    const search = searchParams.get('search') || undefined
    const categoria = searchParams.get('categoria') || undefined
    const tipo = searchParams.get('tipo') || undefined
    const status = searchParams.get('status') || undefined
    const fornecedoraId = searchParams.get('fornecedoraId') || undefined

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
        { codigoBarras: { contains: search } },
        { sku: { contains: search } }
      ]
    }

    if (categoria) where.categoria = categoria
    if (tipo) where.tipo = tipo
    if (status) where.status = status
    if (fornecedoraId) where.fornecedoraId = fornecedoraId

    // Get produtos
    const [produtos, total] = await Promise.all([
      prisma.produto.findMany({
        where,
        skip,
        take,
        orderBy: { dataCriacao: 'desc' },
        include: {
          fornecedora: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      }),
      prisma.produto.count({ where })
    ])

    const response = buildPaginationResponse(produtos, total, page, perPage)

    return successResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/produtos
 * Cria um novo produto
 */
export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<CreateProdutoDTO>(request)

    // Validate required fields
    const validation = validateRequiredFields(body, [
      'nome',
      'preco',
      'categoria',
      'condicao',
      'tipo',
      'brechoId'
    ])

    if (validation) {
      return errorResponse(validation, 400)
    }

    // If consignado, fornecedoraId is required
    if (body.tipo === 'CONSIGNADO' && !body.fornecedoraId) {
      return errorResponse('fornecedoraId é obrigatório para produtos consignados', 400)
    }

    // Create produto
    const produto = await prisma.produto.create({
      data: {
        nome: body.nome,
        descricao: body.descricao,
        preco: body.preco,
        categoria: body.categoria,
        subcategoria: body.subcategoria,
        marca: body.marca,
        tamanho: body.tamanho,
        cor: body.cor,
        condicao: body.condicao,
        tipo: body.tipo,
        fornecedoraId: body.fornecedoraId,
        brechoId: body.brechoId,
        imagens: body.imagens || [],
        peso: body.peso,
        altura: body.altura,
        largura: body.largura,
        profundidade: body.profundidade
      },
      include: {
        fornecedora: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })

    return successResponse(produto, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
