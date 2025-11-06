import { NextRequest, NextResponse } from 'next/server'
import { getPaymentInfo, MercadoPagoPaymentNotification } from '@/lib/mercadopago'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MercadoPagoPaymentNotification

    console.log('=== MERCADO PAGO WEBHOOK ===')
    console.log('Type:', body.type)
    console.log('Action:', body.action)
    console.log('Data:', JSON.stringify(body.data, null, 2))

    // We only handle payment notifications
    if (body.type !== 'payment') {
      return NextResponse.json({ received: true })
    }

    // Get payment details
    const paymentId = body.data.id
    const paymentInfo = await getPaymentInfo(paymentId)

    console.log('Payment Info:', JSON.stringify(paymentInfo, null, 2))

    // TODO: Process payment based on status
    switch (paymentInfo.status) {
      case 'approved':
        await handleApprovedPayment(paymentInfo)
        break

      case 'pending':
      case 'in_process':
        await handlePendingPayment(paymentInfo)
        break

      case 'rejected':
      case 'cancelled':
        await handleRejectedPayment(paymentInfo)
        break

      case 'refunded':
      case 'charged_back':
        await handleRefundedPayment(paymentInfo)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Erro ao processar webhook Mercado Pago:', error)

    // Always return 200 to prevent retries
    return NextResponse.json(
      { error: 'Internal error', message: error.message },
      { status: 200 }
    )
  }
}

// Handlers for different payment statuses

async function handleApprovedPayment(paymentInfo: any) {
  console.log('💚 Payment APPROVED:', paymentInfo.id)

  // TODO: Create sale in database
  // const venda = await prisma.venda.create({
  //   data: {
  //     brechoId: 'BRECHO_ID',
  //     clienteId: 'CLIENT_ID',
  //     vendedorId: 'SELLER_ID',
  //     tipoPagamento: mapPaymentMethod(paymentInfo.payment_method_id),
  //     valorTotal: paymentInfo.transaction_amount,
  //     origem: 'ONLINE',
  //     status: 'CONFIRMADA',
  //     mercadoPagoPaymentId: paymentInfo.id.toString(),
  //     mercadoPagoStatus: paymentInfo.status
  //   }
  // })

  // TODO: Update product stock
  // TODO: Send confirmation email
  // TODO: Trigger order fulfillment

  console.log('✅ Venda criada e estoque atualizado')
}

async function handlePendingPayment(paymentInfo: any) {
  console.log('⏳ Payment PENDING:', paymentInfo.id)

  // TODO: Create sale with PENDING status
  // TODO: Send pending payment email

  console.log('⚠️  Venda registrada como pendente')
}

async function handleRejectedPayment(paymentInfo: any) {
  console.log('❌ Payment REJECTED:', paymentInfo.id)

  // TODO: Mark sale as cancelled if exists
  // TODO: Send rejection email

  console.log('⚠️  Pagamento recusado')
}

async function handleRefundedPayment(paymentInfo: any) {
  console.log('↩️  Payment REFUNDED:', paymentInfo.id)

  // TODO: Find sale by payment ID
  // TODO: Update sale status to DEVOLVIDA
  // TODO: Restore product stock
  // TODO: Send refund confirmation email

  console.log('↩️  Venda estornada e estoque restaurado')
}

// Helper to map Mercado Pago payment methods to our enum
function mapPaymentMethod(paymentMethodId: string): string {
  const methodMap: Record<string, string> = {
    'credit_card': 'CARTAO_CREDITO',
    'debit_card': 'CARTAO_DEBITO',
    'pix': 'PIX',
    'bolbradesco': 'BOLETO',
    'account_money': 'DINHEIRO'
  }

  return methodMap[paymentMethodId] || 'OUTROS'
}
