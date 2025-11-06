import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // TODO: Get from authenticated user's brecho
    // For now, return mock data from server
    const despesas = [
      {
        id: '1',
        tipo: 'FIXA',
        categoria: 'ALUGUEL',
        descricao: 'Aluguel da loja',
        valor: 2500.00,
        dataVencimento: '2024-01-10',
        dataPagamento: '2024-01-08',
        status: 'PAGO'
      },
      {
        id: '2',
        tipo: 'FIXA',
        categoria: 'SALARIOS',
        descricao: 'Salário Funcionários',
        valor: 4500.00,
        dataVencimento: '2024-01-05',
        dataPagamento: '2024-01-05',
        status: 'PAGO'
      },
      {
        id: '3',
        tipo: 'VARIAVEL',
        categoria: 'MARKETING',
        descricao: 'Anúncios Instagram',
        valor: 350.00,
        dataVencimento: '2024-01-15',
        dataPagamento: null,
        status: 'PENDENTE'
      },
      {
        id: '4',
        tipo: 'FIXA',
        categoria: 'INTERNET',
        descricao: 'Internet Fibra 200MB',
        valor: 120.00,
        dataVencimento: '2024-01-20',
        dataPagamento: null,
        status: 'PENDENTE'
      },
      {
        id: '5',
        tipo: 'VARIAVEL',
        categoria: 'MANUTENCAO',
        descricao: 'Reparo Ar Condicionado',
        valor: 280.00,
        dataVencimento: '2024-01-12',
        dataPagamento: null,
        status: 'ATRASADO'
      }
    ]

    return NextResponse.json({ despesas })
  } catch (error) {
    console.error('Erro ao buscar despesas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar despesas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Implement despesa creation with Prisma
    // For now, just return success

    return NextResponse.json({
      message: 'Despesa criada com sucesso',
      despesa: { id: Date.now().toString(), ...body }
    })
  } catch (error) {
    console.error('Erro ao criar despesa:', error)
    return NextResponse.json(
      { error: 'Erro ao criar despesa' },
      { status: 500 }
    )
  }
}
