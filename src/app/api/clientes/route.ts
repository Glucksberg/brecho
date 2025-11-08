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

interface CreateClienteDTO {
  nome: string
  email?: string
  telefone: string
  cpf?: string
  dataNascimento?: Date
  endereco?: {
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
  brechoId: string
}

/**
 * GET /api/clientes
 * Lista todos os clientes
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, perPage, skip, take } = parsePaginationParams(searchParams)

    const search = searchParams.get('search') || undefined
    const brechoId = searchParams.get('brechoId')

    const where: Prisma.ClienteWhereInput = {}

    if (brechoId) where.brechoId = brechoId

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { telefone: { contains: search } },
        { cpf: { contains: search } }
      ]
    }

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              vendas: true,
              trocas: true
            }
          }
        }
      }),
      prisma.cliente.count({ where })
    ])

    // Enrich with total spent
    const clientesEnriquecidos = await Promise.all(
      clientes.map(async (cliente) => {
        const totalGasto = await prisma.venda.aggregate({
          where: {
            clienteId: cliente.id,
            status: 'PAGO'
          },
          _sum: { total: true }
        })

        return {
          ...cliente,
          totalGasto: (totalGasto._sum.total as number) || 0,
          totalCompras: cliente._count.vendas
        }
      })
    )

    const response = buildPaginationResponse(clientesEnriquecidos, total, page, perPage)
    return successResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/clientes
 * Cria um novo cliente
 */
export async function POST(request: NextRequest) {
  try {
    const body = await parseBody<CreateClienteDTO>(request)

    const validation = validateRequiredFields(body, ['nome', 'telefone', 'brechoId'])

    if (validation) {
      return errorResponse(validation, 400)
    }

    // Check if cliente already exists (by email or CPF)
    if (body.email || body.cpf) {
      const existente = await prisma.cliente.findFirst({
        where: {
          brechoId: body.brechoId,
          OR: [
            ...(body.email ? [{ email: body.email }] : []),
            ...(body.cpf ? [{ cpf: body.cpf }] : [])
          ]
        }
      })

      if (existente) {
        return errorResponse('Cliente já cadastrado com este email ou CPF', 409)
      }
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        cpf: body.cpf,
        dataNascimento: body.dataNascimento,
        endereco: body.endereco || {},
        brechoId: body.brechoId
      }
    })

    return successResponse(cliente, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
