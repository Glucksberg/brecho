import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const verificarEstoqueSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      quantidade: z.number().int().positive()
    })
  ).min(1, 'Nenhum item para verificar')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    const validation = verificarEstoqueSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { items } = validation.data

    // Check stock for all products
    const produtosIndisponiveis: Array<{
      id: string
      nome: string
      problema: string
      estoqueDisponivel?: number
    }> = []

    for (const item of items) {
      const produto = await prisma.produto.findUnique({
        where: { id: item.id },
        select: {
          id: true,
          nome: true,
          estoque: true,
          vendido: true,
          ativo: true
        }
      })

      // Product not found
      if (!produto) {
        produtosIndisponiveis.push({
          id: item.id,
          nome: 'Produto não encontrado',
          problema: 'PRODUTO_NAO_ENCONTRADO'
        })
        continue
      }

      // Product inactive
      if (!produto.ativo) {
        produtosIndisponiveis.push({
          id: produto.id,
          nome: produto.nome,
          problema: 'PRODUTO_INATIVO'
        })
        continue
      }

      // Product sold
      if (produto.vendido) {
        produtosIndisponiveis.push({
          id: produto.id,
          nome: produto.nome,
          problema: 'PRODUTO_VENDIDO'
        })
        continue
      }

      // Insufficient stock
      if (produto.estoque < item.quantidade) {
        produtosIndisponiveis.push({
          id: produto.id,
          nome: produto.nome,
          problema: 'ESTOQUE_INSUFICIENTE',
          estoqueDisponivel: produto.estoque
        })
        continue
      }
    }

    // If any product is unavailable, return error
    if (produtosIndisponiveis.length > 0) {
      return NextResponse.json(
        {
          disponivel: false,
          produtosIndisponiveis
        },
        { status: 200 } // 200 because this is expected behavior
      )
    }

    // All products available
    return NextResponse.json({
      disponivel: true,
      mensagem: 'Todos os produtos estão disponíveis'
    })
  } catch (error: any) {
    logger.error('Error verifying stock', { error: error?.message })
    return NextResponse.json(
      { error: 'Erro ao verificar disponibilidade dos produtos' },
      { status: 500 }
    )
  }
}
