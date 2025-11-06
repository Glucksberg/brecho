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

interface CreateDespesaDTO {
  descricao: string
  categoria: 'OPERACIONAL' | 'MARKETING' | 'PESSOAL' | 'PRODUTO' | 'OUTROS'
  subcategoria?: string
  valor: number
  dataVencimento?: Date
  status?: 'PENDENTE' | 'PAGO' | 'VENCIDO' | 'CANCELADO'
  formaPagamento?: string
  fornecedor?: string
  numeroDocumento?: string
  recorrente?: boolean
  frequenciaRecorrencia?: string
  proximoVencimento?: Date
  centroCusto?: string
  observacoes?: string
  brechoId: string
}

/**
 * GET /api/despesas
 * Lista todas as despesas com paginação
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, perPage, skip, take } = parsePaginationParams(searchParams)

    const brechoId = searchParams.get('brechoId')
    const status = searchParams.get('status')
    const categoria = searchParams.get('categoria')
    const search = searchParams.get('search') || undefined

    type WhereClause = {
      brechoId?: string
      status?: string
      categoria?: string
      OR?: Array<{
        descricao?: { contains: string; mode: 'insensitive' }
        fornecedor?: { contains: string; mode: 'insensitive' }
      }>
    }

    const where: WhereClause = {}

    if (brechoId) where.brechoId = brechoId
    if (status) where.status = status as any
    if (categoria) where.categoria = categoria as any

    if (search) {
      where.OR = [
        { descricao: { contains: search, mode: 'insensitive' } },
        { fornecedor: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Date filters
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')

    const dateFilter: any = {}
    if (dataInicio) dateFilter.gte = new Date(dataInicio)
    if (dataFim) dateFilter.lte = new Date(dataFim)

    const whereWithDate = {
      ...where,
      ...(dataInicio || dataFim ? { dataVencimento: dateFilter } : {})
    }

    const [despesas, total] = await Promise.all([
      prisma.despesa.findMany({
        where: whereWithDate,
        skip,
        take,
        orderBy: { dataVencimento: 'desc' },
        include: {
          brecho: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      }),
      prisma.despesa.count({ where: whereWithDate })
    ])

    const response = buildPaginationResponse(despesas, total, page, perPage)
    return successResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/despesas
 * Cria uma nova despesa
 */
export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<CreateDespesaDTO>(request)

    const validation = validateRequiredFields(body, [
      'descricao',
      'categoria',
      'valor',
      'brechoId'
    ])

    if (validation) {
      return errorResponse(validation, 400)
    }

    // Validate valor
    if (body.valor <= 0) {
      return errorResponse('Valor deve ser maior que zero', 400)
    }

    const despesa = await prisma.despesa.create({
      data: {
        descricao: body.descricao,
        categoria: body.categoria,
        subcategoria: body.subcategoria,
        valor: body.valor,
        dataVencimento: body.dataVencimento,
        status: body.status || 'PENDENTE',
        formaPagamento: body.formaPagamento as any,
        fornecedor: body.fornecedor,
        numeroDocumento: body.numeroDocumento,
        recorrente: body.recorrente || false,
        frequenciaRecorrencia: body.frequenciaRecorrencia,
        proximoVencimento: body.proximoVencimento,
        centroCusto: body.centroCusto,
        observacoes: body.observacoes,
        anexos: [],
        brechoId: body.brechoId
      },
      include: {
        brecho: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })

    return successResponse(despesa, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
