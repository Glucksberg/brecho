export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { getServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user session
    const session = await getServerSession()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Get user's cliente record
    const cliente = await prisma.cliente.findFirst({
      where: {
        email: session.user.email
      }
    })

    if (!cliente) {
      // User has no cliente record yet - return empty orders
      return NextResponse.json({ pedidos: [] })
    }

    // Fetch real orders from database
    const vendas = await prisma.venda.findMany({
      where: {
        clienteId: cliente.id,
        origem: 'ONLINE'
      },
      orderBy: {
        dataVenda: 'desc'
      },
      include: {
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                preco: true,
                imagemPrincipal: true
              }
            }
          }
        }
      }
    })

    // Format orders for response
    const pedidos = vendas.map(venda => ({
      id: venda.id,
      numero: `#${venda.id.substring(0, 6).toUpperCase()}`,
      data: venda.dataVenda.toISOString().split('T')[0],
      status: venda.status,
      total: venda.total,
      itens: venda.itens.length,
      items: venda.itens.map(item => ({
        id: item.id,
        produto: item.produto,
        quantidade: item.quantidade,
        preco: item.precoUnitario
      }))
    }))

    return NextResponse.json({ pedidos })
  } catch (error: any) {
    logger.error('Error fetching orders', { error: error?.message })
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    )
  }
}
