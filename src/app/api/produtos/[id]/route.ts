import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseBody
} from '@/lib/api-helpers'

/**
 * GET /api/produtos/[id]
 * Obtém um produto específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: params.id },
      include: {
        fornecedora: true,
        brecho: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })

    if (!produto) {
      return errorResponse('Produto não encontrado', 404)
    }

    return successResponse(produto)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/produtos/[id]
 * Atualiza um produto
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await parseBody<any>(request)

    const produto = await prisma.produto.update({
      where: { id: params.id },
      data: {
        ...body,
        dataAtualizacao: new Date()
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

    return successResponse(produto)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/produtos/[id]
 * Deleta um produto (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete - apenas marca como REMOVIDO
    const produto = await prisma.produto.update({
      where: { id: params.id },
      data: {
        status: 'REMOVIDO',
        dataAtualizacao: new Date()
      }
    })

    return successResponse({ message: 'Produto removido com sucesso', id: produto.id })
  } catch (error) {
    return handleApiError(error)
  }
}
