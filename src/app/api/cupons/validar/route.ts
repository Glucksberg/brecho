import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-helpers'

interface Cupom {
  codigo: string
  tipo: 'PERCENTUAL' | 'FIXO'
  valor: number // Percentage (0-100) or fixed value
  minimoCompra?: number
  ativo: boolean
  descricao: string
}

// TODO: Move to database when Cupom model is created
const CUPONS: Cupom[] = [
  {
    codigo: 'PRIMEIRACOMPRA',
    tipo: 'PERCENTUAL',
    valor: 15,
    minimoCompra: 100,
    ativo: true,
    descricao: '15% de desconto na primeira compra (mínimo R$ 100)'
  },
  {
    codigo: 'DESCONTO10',
    tipo: 'PERCENTUAL',
    valor: 10,
    ativo: true,
    descricao: '10% de desconto em qualquer compra'
  },
  {
    codigo: 'FRETE20',
    tipo: 'FIXO',
    valor: 20,
    minimoCompra: 50,
    ativo: true,
    descricao: 'R$ 20 de desconto (mínimo R$ 50)'
  },
  {
    codigo: 'BEM-VINDO',
    tipo: 'PERCENTUAL',
    valor: 5,
    ativo: true,
    descricao: '5% de desconto de boas-vindas'
  }
]

/**
 * POST /api/cupons/validar
 * Valida um cupom de desconto
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { codigo, subtotal } = body

    if (!codigo || typeof codigo !== 'string') {
      return errorResponse('Código do cupom é obrigatório', 400)
    }

    if (!subtotal || typeof subtotal !== 'number') {
      return errorResponse('Subtotal é obrigatório', 400)
    }

    // Find coupon (case insensitive)
    const cupom = CUPONS.find(
      c => c.codigo.toUpperCase() === codigo.toUpperCase() && c.ativo
    )

    if (!cupom) {
      return errorResponse('Cupom inválido ou expirado', 404)
    }

    // Check minimum purchase requirement
    if (cupom.minimoCompra && subtotal < cupom.minimoCompra) {
      return errorResponse(
        `Valor mínimo de compra não atingido. Este cupom requer R$ ${cupom.minimoCompra.toFixed(2)}`,
        400
      )
    }

    // Calculate discount
    let desconto = 0
    if (cupom.tipo === 'PERCENTUAL') {
      desconto = (subtotal * cupom.valor) / 100
    } else {
      desconto = cupom.valor
    }

    // Ensure discount doesn't exceed subtotal
    desconto = Math.min(desconto, subtotal)

    return successResponse({
      valido: true,
      cupom: {
        codigo: cupom.codigo,
        descricao: cupom.descricao,
        tipo: cupom.tipo,
        valor: cupom.valor
      },
      desconto: Math.round(desconto * 100) / 100
    })
  } catch (error: any) {
    return errorResponse('Erro ao validar cupom', 500)
  }
}
