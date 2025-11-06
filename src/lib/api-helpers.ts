/**
 * API Helpers
 * Utility functions for API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse, ApiError } from '@/types'

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data
    },
    { status }
  )
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  status: number = 400,
  error?: ApiError
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(error && { details: error })
    },
    { status }
  )
}

/**
 * Parse request body
 */
export async function parseBody<T>(request: NextRequest): Promise<T> {
  try {
    return await request.json()
  } catch (error) {
    throw new Error('Invalid JSON body')
  }
}

/**
 * Get query params from URL
 */
export function getQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  return Object.fromEntries(searchParams.entries())
}

/**
 * Parse pagination params
 */
export function parsePaginationParams(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('perPage') || '20')

  return {
    page: Math.max(1, page),
    perPage: Math.min(100, Math.max(1, perPage)),
    skip: (Math.max(1, page) - 1) * Math.min(100, Math.max(1, perPage)),
    take: Math.min(100, Math.max(1, perPage))
  }
}

/**
 * Build pagination response
 */
export function buildPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  perPage: number
) {
  const totalPages = Math.ceil(total / perPage)

  return {
    data,
    pagination: {
      page,
      perPage,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error)

  if (error instanceof Error) {
    // Prisma errors
    if ('code' in error) {
      const prismaError = error as any

      switch (prismaError.code) {
        case 'P2002':
          return errorResponse('Registro duplicado', 409)
        case 'P2025':
          return errorResponse('Registro não encontrado', 404)
        case 'P2003':
          return errorResponse('Violação de restrição de chave estrangeira', 400)
        default:
          return errorResponse('Erro no banco de dados', 500)
      }
    }

    // Validation errors
    if (error.message.includes('Invalid')) {
      return errorResponse(error.message, 400)
    }

    // Permission errors
    if (error.message.includes('Permissão') || error.message.includes('Acesso')) {
      return errorResponse(error.message, 403)
    }

    return errorResponse(error.message, 500)
  }

  return errorResponse('Erro interno do servidor', 500)
}

/**
 * Validate required fields
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): string | null {
  for (const field of requiredFields) {
    if (!data[field]) {
      return `Campo obrigatório ausente: ${field}`
    }
  }
  return null
}
