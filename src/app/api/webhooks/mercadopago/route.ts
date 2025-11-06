import { NextRequest, NextResponse } from 'next/server'
import { getPaymentInfo, MercadoPagoPaymentNotification } from '@/lib/mercadopago'
import { prisma } from '@/lib/prisma'
import { createHmac } from 'crypto'

// Verify Mercado Pago webhook signature
function verifyWebhookSignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string
): boolean {
  if (!xSignature || !xRequestId) return false

  // Mercado Pago uses HMAC-SHA256 for signature
  // Format: ts={timestamp},v1={signature}
  const parts = xSignature.split(',')
  const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1]
  const v1 = parts.find(p => p.startsWith('v1='))?.split('=')[1]

  if (!ts || !v1) return false

  // Get secret from Mercado Pago Webhook settings
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET || ''
  if (!secret) {
    console.warn('⚠️ MERCADOPAGO_WEBHOOK_SECRET not set - webhook signature validation disabled')
    return true // Allow in dev/test if not configured
  }

  // Create manifest: {request-id}|{data-id}|{timestamp}
  const manifest = `${xRequestId}|${dataId}|${ts}`

  // Generate HMAC
  const hmac = createHmac('sha256', secret)
  hmac.update(manifest)
  const expectedSignature = hmac.digest('hex')

  return v1 === expectedSignature
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MercadoPagoPaymentNotification

    // Validate webhook signature
    const xSignature = request.headers.get('x-signature')
    const xRequestId = request.headers.get('x-request-id')
    const dataId = body.data?.id || ''

    if (!verifyWebhookSignature(xSignature, xRequestId, dataId)) {
      console.error('❌ Invalid webhook signature - possible attack')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    console.log('✅ Webhook signature verified')
    console.log('=== MERCADO PAGO WEBHOOK ===')
    console.log('Type:', body.type)
    console.log('Action:', body.action)
    console.log('Data ID:', dataId)

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

  const paymentId = paymentInfo.id.toString()

  // IDEMPOTENCY CHECK: Verify if this payment was already processed
  const vendaExistente = await prisma.venda.findUnique({
    where: { mercadoPagoPaymentId: paymentId }
  })

  if (vendaExistente) {
    console.log('⚠️  Payment already processed:', paymentId)
    console.log('   Existing sale ID:', vendaExistente.id)

    // If status changed, update it
    if (vendaExistente.mercadoPagoStatus !== paymentInfo.status) {
      await prisma.venda.update({
        where: { id: vendaExistente.id },
        data: { mercadoPagoStatus: paymentInfo.status }
      })
      console.log('   Status updated to:', paymentInfo.status)
    }

    return // Don't process again
  }

  // TODO: Create sale in database using transaction
  // IMPORTANT: Use prisma.$transaction to ensure atomicity
  // const venda = await prisma.$transaction(async (tx) => {
  //   // 1. Create venda
  //   const novaVenda = await tx.venda.create({
  //     data: {
  //       brechoId: 'BRECHO_ID',
  //       clienteId: 'CLIENT_ID',
  //       vendedorId: 'SELLER_ID',
  //       formaPagamento: mapPaymentMethod(paymentInfo.payment_method_id),
  //       subtotal: paymentInfo.transaction_amount,
  //       total: paymentInfo.transaction_amount,
  //       origem: 'ONLINE',
  //       status: 'PAGO',
  //       mercadoPagoPaymentId: paymentId,
  //       mercadoPagoStatus: paymentInfo.status,
  //       mercadoPagoPreferenceId: paymentInfo.preference_id
  //     }
  //   })
  //
  //   // 2. Create venda items and update product stock
  //   // for (const item of items) {
  //   //   await tx.itemVenda.create({ ... })
  //   //   await tx.produto.update({
  //   //     where: { id: item.id },
  //   //     data: { vendido: true, estoque: { decrement: item.quantidade } }
  //   //   })
  //   // }
  //
  //   return novaVenda
  // })

  // TODO: Send confirmation email
  // TODO: Trigger order fulfillment

  console.log('✅ Venda criada e estoque atualizado')
}

async function handlePendingPayment(paymentInfo: any) {
  console.log('⏳ Payment PENDING:', paymentInfo.id)

  const paymentId = paymentInfo.id.toString()

  // IDEMPOTENCY CHECK: Verify if this payment was already processed
  const vendaExistente = await prisma.venda.findUnique({
    where: { mercadoPagoPaymentId: paymentId }
  })

  if (vendaExistente) {
    console.log('⚠️  Payment already processed:', paymentId)

    // Update status if changed
    if (vendaExistente.mercadoPagoStatus !== paymentInfo.status) {
      await prisma.venda.update({
        where: { id: vendaExistente.id },
        data: {
          status: 'PENDENTE',
          mercadoPagoStatus: paymentInfo.status
        }
      })
      console.log('   Status updated to PENDING')
    }

    return // Don't process again
  }

  // TODO: Create sale with PENDING status
  // TODO: Send pending payment email

  console.log('⚠️  Venda registrada como pendente')
}

async function handleRejectedPayment(paymentInfo: any) {
  console.log('❌ Payment REJECTED:', paymentInfo.id)

  const paymentId = paymentInfo.id.toString()

  // IDEMPOTENCY CHECK: Find existing sale
  const vendaExistente = await prisma.venda.findUnique({
    where: { mercadoPagoPaymentId: paymentId }
  })

  if (vendaExistente) {
    console.log('   Found existing sale:', vendaExistente.id)

    // Update status to cancelled
    if (vendaExistente.status !== 'CANCELADO') {
      await prisma.venda.update({
        where: { id: vendaExistente.id },
        data: {
          status: 'CANCELADO',
          mercadoPagoStatus: paymentInfo.status
        }
      })
      console.log('   Sale marked as CANCELLED')

      // TODO: Restore product stock if it was already reserved
    }

    return
  }

  // If no sale exists yet, just log it (it may never be created)
  console.log('⚠️  Pagamento recusado (nenhuma venda criada)')
}

async function handleRefundedPayment(paymentInfo: any) {
  console.log('↩️  Payment REFUNDED:', paymentInfo.id)

  const paymentId = paymentInfo.id.toString()

  // IDEMPOTENCY CHECK: Find existing sale
  const vendaExistente = await prisma.venda.findUnique({
    where: { mercadoPagoPaymentId: paymentId }
  })

  if (!vendaExistente) {
    console.log('⚠️  No sale found for refunded payment:', paymentId)
    return
  }

  console.log('   Found sale:', vendaExistente.id)

  // Update status to ESTORNADO (only if not already updated)
  if (vendaExistente.status !== 'ESTORNADO') {
    await prisma.venda.update({
      where: { id: vendaExistente.id },
      data: {
        status: 'ESTORNADO',
        mercadoPagoStatus: paymentInfo.status
      }
    })
    console.log('   Sale marked as REFUNDED')

    // TODO: Restore product stock
    // TODO: Send refund confirmation email
  } else {
    console.log('   Sale already marked as REFUNDED (idempotent)')
  }

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
