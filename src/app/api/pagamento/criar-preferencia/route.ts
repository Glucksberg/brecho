import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutPreference, isConfigured, MercadoPagoItem } from '@/lib/mercadopago'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const itemSchema = z.object({
  id: z.string(), // produto ID
  nome: z.string(),
  preco: z.number().positive(),
  quantidade: z.number().int().positive(),
  imagemPrincipal: z.string().optional()
})

const criarPreferenciaSchema = z.object({
  brechoId: z.string(),
  clienteId: z.string().optional(),
  items: z.array(itemSchema).min(1, 'Carrinho vazio'),
  payer: z.object({
    nome: z.string().optional(),
    sobrenome: z.string().optional(),
    email: z.string().email(),
    telefone: z.string().optional(),
    cpf: z.string().optional()
  }).optional(),
  shipment: z.object({
    custo: z.number().optional(),
    endereco: z.object({
      cep: z.string(),
      rua: z.string(),
      numero: z.string(),
      complemento: z.string().optional(),
      bairro: z.string().optional(),
      cidade: z.string(),
      estado: z.string()
    }).optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    // Check if Mercado Pago is configured
    if (!isConfigured()) {
      return NextResponse.json(
        {
          error: 'Mercado Pago não configurado',
          message: 'Configure MERCADOPAGO_ACCESS_TOKEN e NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY no .env'
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const validated = criarPreferenciaSchema.parse(body)

    // Convert cart items to Mercado Pago format
    const mpItems: MercadoPagoItem[] = validated.items.map(item => ({
      id: item.id,
      title: item.nome,
      description: item.nome,
      picture_url: item.imagemPrincipal,
      category_id: 'fashion', // Categoria de moda
      quantity: item.quantidade,
      currency_id: 'BRL',
      unit_price: item.preco
    }))

    // Calculate totals
    const totalItems = mpItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
    const shippingCost = validated.shipment?.custo || (totalItems >= 200 ? 0 : 15.00)
    const valorTotal = totalItems + shippingCost

    // Add shipping as item if > 0
    if (shippingCost > 0) {
      mpItems.push({
        id: 'SHIPPING',
        title: 'Frete',
        description: 'Custo de envio',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: shippingCost
      })
    }

    // Create pending venda in database
    const venda = await prisma.$transaction(async (tx) => {
      // Create venda with PENDENTE_PAGAMENTO status
      const novaVenda = await tx.venda.create({
        data: {
          brechoId: validated.brechoId,
          clienteId: validated.clienteId,
          origem: 'ONLINE',
          status: 'PENDENTE_PAGAMENTO',
          valorTotal,
          valorFrete: shippingCost,
          metodoPagamento: 'MERCADO_PAGO',
          dataVenda: new Date(),
          enderecoEntrega: validated.shipment?.endereco || {},
          // Don't set mercadoPagoPaymentId yet - will be set by webhook
        }
      })

      // Create venda items
      for (const item of validated.items) {
        await tx.itemVenda.create({
          data: {
            vendaId: novaVenda.id,
            produtoId: item.id,
            quantidade: item.quantidade,
            precoUnitario: item.preco,
            subtotal: item.preco * item.quantidade
          }
        })
      }

      return novaVenda
    })

    // Create preference with venda reference
    const preference = await createCheckoutPreference({
      items: mpItems,
      external_reference: venda.id, // Use venda ID as external reference
      payer: validated.payer ? {
        name: validated.payer.nome,
        surname: validated.payer.sobrenome,
        email: validated.payer.email,
        phone: validated.payer.telefone ? {
          number: validated.payer.telefone
        } : undefined,
        identification: validated.payer.cpf ? {
          type: 'CPF',
          number: validated.payer.cpf.replace(/\D/g, '')
        } : undefined,
        address: validated.shipment?.endereco ? {
          zip_code: validated.shipment.endereco.cep.replace(/\D/g, ''),
          street_name: validated.shipment.endereco.rua,
          street_number: validated.shipment.endereco.numero,
          city: validated.shipment.endereco.cidade,
          state: validated.shipment.endereco.estado
        } : undefined
      } : undefined,
      shipments: validated.shipment?.endereco ? {
        cost: shippingCost,
        mode: 'custom',
        receiver_address: {
          zip_code: validated.shipment.endereco.cep.replace(/\D/g, ''),
          street_name: validated.shipment.endereco.rua,
          street_number: validated.shipment.endereco.numero,
          apartment: validated.shipment.endereco.complemento,
          city_name: validated.shipment.endereco.cidade,
          state_name: validated.shipment.endereco.estado,
          country_name: 'Brasil'
        }
      } : undefined,
      payment_methods: {
        installments: 3 // Máximo de 3 parcelas sem juros
      },
      metadata: {
        venda_id: venda.id, // Store venda ID in metadata as well
        timestamp: new Date().toISOString(),
        items_count: validated.items.length,
        shipping_cost: shippingCost
      }
    })

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      vendaId: venda.id // Return venda ID for tracking
    })
  } catch (error: any) {
    logger.error('Error creating Mercado Pago preference', {
      error: error.message,
      stack: error.stack
    })

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Erro ao criar checkout',
        message: error.message || 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
