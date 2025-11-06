import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // TODO: Get from authenticated user's orders
    // For now, return mock data from server
    const pedidos = [
      {
        id: '1',
        numero: '#001234',
        data: '2024-01-15',
        status: 'ENTREGUE',
        total: 349.80,
        itens: 3
      },
      {
        id: '2',
        numero: '#001235',
        data: '2024-01-10',
        status: 'EM_TRANSITO',
        total: 189.90,
        itens: 1
      },
      {
        id: '3',
        numero: '#001236',
        data: '2024-01-05',
        status: 'PROCESSANDO',
        total: 279.70,
        itens: 2
      }
    ]

    return NextResponse.json({ pedidos })
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    )
  }
}
