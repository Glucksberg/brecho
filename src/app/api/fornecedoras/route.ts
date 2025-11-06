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
import type { CreateFornecedoraDTO } from '@/types'

/**
 * GET /api/fornecedoras
 * Lista todas as fornecedoras
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, perPage, skip, take } = parsePaginationParams(searchParams)

    const search = searchParams.get('search') || undefined
    const ativo = searchParams.get('ativo')

    const where: Prisma.FornecedoraWhereInput = {}

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search } }
      ]
    }

    if (ativo !== null) {
      where.ativo = ativo === 'true'
    }

    const [fornecedoras, total] = await Promise.all([
      prisma.fornecedora.findMany({
        where,
        skip,
        take,
        orderBy: { dataCriacao: 'desc' },
        include: {
          _count: {
            select: {
              produtos: { where: { status: 'ATIVO' } },
              creditos: true
            }
          }
        }
      }),
      prisma.fornecedora.count({ where })
    ])

    // Enrich with calculated fields
    const enrichedFornecedoras = fornecedoras.map(f => ({
      ...f,
      totalProdutosAtivos: f._count.produtos,
      totalCreditos: f._count.creditos
    }))

    const response = buildPaginationResponse(enrichedFornecedoras, total, page, perPage)

    return successResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/fornecedoras
 * Cria uma nova fornecedora
 */
export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<CreateFornecedoraDTO>(request)

    const validation = validateRequiredFields(body, [
      'nome',
      'telefone',
      'percentualRepasse',
      'brechoId'
    ])

    if (validation) {
      return errorResponse(validation, 400)
    }

    // Validate percentualRepasse
    if (body.percentualRepasse < 0 || body.percentualRepasse > 100) {
      return errorResponse('Percentual de repasse deve estar entre 0 e 100', 400)
    }

    const fornecedora = await prisma.fornecedora.create({
      data: {
        nome: body.nome,
        cpf: body.cpf,
        telefone: body.telefone,
        email: body.email,
        percentualRepasse: body.percentualRepasse,
        brechoId: body.brechoId,
        endereco: body.endereco || {}
      }
    })

    return successResponse(fornecedora, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
