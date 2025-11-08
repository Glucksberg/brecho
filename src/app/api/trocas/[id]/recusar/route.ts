import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseBody
} from '@/lib/api-helpers'

/**
 * POST /api/trocas/[id]/recusar
 * Recusa uma troca/devolução
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await parseBody<{
      observacoesRecusa: string
    }>(request)

    if (!body.observacoesRecusa) {
      return errorResponse('Observações da recusa são obrigatórias', 400)
    }

    const troca = await prisma.troca.update({
      where: { id: params.id },
      data: {
        status: 'RECUSADO',
        observacoes: body.observacoesRecusa
      }
    })

    return successResponse(troca)
  } catch (error) {
    return handleApiError(error)
  }
}
