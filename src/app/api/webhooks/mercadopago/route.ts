import { NextRequest, NextResponse } from 'next/server'
import { getPaymentInfo, MercadoPagoPaymentNotification } from '@/lib/mercadopago'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
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
    logger.warn('MERCADOPAGO_WEBHOOK_SECRET not set - webhook signature validation disabled')
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
      logger.error('Invalid webhook signature - possible attack', { xSignature, xRequestId, dataId })
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    logger.info('Webhook signature verified')
    logger.info('Mercado Pago webhook received', {
      type: body.type,
      action: body.action,
      dataId
    })

    // We only handle payment notifications
    if (body.type !== 'payment') {
      return NextResponse.json({ received: true })
    }

    // Get payment details
    const paymentId = body.data.id
    const paymentInfo = await getPaymentInfo(paymentId)

    logger.debug('Payment info retrieved', { paymentId, status: paymentInfo.status })

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
    logger.error('Error processing Mercado Pago webhook', { error: error.message, stack: error.stack })

    // Always return 200 to prevent retries
    return NextResponse.json(
      { error: 'Internal error', message: error.message },
      { status: 200 }
    )
  }
}

// Handlers for different payment statuses

async function handleApprovedPayment(paymentInfo: any) {
  logger.info('Payment APPROVED', { paymentId: paymentInfo.id })

  const paymentId = paymentInfo.id.toString()
  const vendaId = paymentInfo.external_reference

  if (!vendaId) {
    logger.error('No external_reference (venda ID) found in payment', { paymentId })
    return
  }

  // IDEMPOTENCY CHECK: Verify if this payment was already processed
  const vendaExistente = await prisma.venda.findUnique({
    where: { mercadoPagoPaymentId: paymentId }
  })

  if (vendaExistente) {
    logger.warn('Payment already processed', { paymentId, vendaId: vendaExistente.id })

    // If status changed, update it
    if (vendaExistente.status !== 'FINALIZADA') {
      await prisma.venda.update({
        where: { id: vendaExistente.id },
        data: {
          status: 'FINALIZADA',
          mercadoPagoStatus: paymentInfo.status,
          dataAtualizacao: new Date()
        }
      })
      logger.info('Status updated to FINALIZADA', { vendaId: vendaExistente.id })
    }

    return // Don't process again
  }

  logger.info('Processing approved payment', { paymentId, vendaId })

  // Process payment and finalize sale
  await prisma.$transaction(async (tx) => {
    // 1. Get pending venda with items
    const venda = await tx.venda.findUnique({
      where: { id: vendaId },
      include: {
        items: {
          include: {
            produto: {
              include: {
                fornecedora: true
              }
            }
          }
        },
        cliente: true,
        brecho: true
      }
    })

    if (!venda) {
      throw new Error(`Venda not found: ${vendaId}`)
    }

    if (venda.status !== 'PENDENTE_PAGAMENTO') {
      logger.warn('Venda already processed', { vendaId, status: venda.status })
      return
    }

    logger.debug('Processing sale items', { vendaId, itemCount: venda.items.length })

    // 2. Update venda to FINALIZADA
    await tx.venda.update({
      where: { id: vendaId },
      data: {
        mercadoPagoPaymentId: paymentId,
        mercadoPagoStatus: paymentInfo.status,
        status: 'FINALIZADA',
        dataVenda: new Date(paymentInfo.date_approved || paymentInfo.date_created),
        dataAtualizacao: new Date()
      }
    })

    // 3. Update product stock and create créditos
    for (const item of venda.items) {
      const produto = item.produto

      // Update product stock
      await tx.produto.update({
        where: { id: produto.id },
        data: {
          vendido: true,
          estoque: Math.max(0, produto.estoque - item.quantidade)
        }
      })

      logger.debug('Product marked as sold', { produtoId: produto.id, produtoNome: produto.nome })

      // Create crédito for consignment products
      if (produto.tipo === 'CONSIGNADO' && produto.fornecedoraId && produto.fornecedora) {
        const valorCredito = item.subtotal * (produto.fornecedora.percentualRepasse / 100)

        await tx.credito.create({
          data: {
            fornecedoraId: produto.fornecedoraId,
            vendaId: venda.id,
            valor: valorCredito,
            tipo: 'CREDITO',
            descricao: `Venda do produto ${produto.nome}`,
            dataCredito: new Date()
          }
        })

        logger.debug('Credit created for supplier', {
          fornecedoraNome: produto.fornecedora.nome,
          valorCredito
        })
      }
    }

    // 4. Send confirmation email
    try {
      const { sendOrderConfirmationEmail } = await import('@/lib/email')

      const customerEmail = venda.cliente?.email || paymentInfo.payer?.email
      if (customerEmail) {
        await sendOrderConfirmationEmail({
          email: customerEmail,
          customerName: venda.cliente?.nome || paymentInfo.payer?.first_name || 'Cliente',
          orderNumber: venda.id,
          orderDate: venda.dataVenda,
          items: venda.items.map(item => ({
            name: item.produto.nome,
            quantity: item.quantidade,
            price: item.precoUnitario,
            image: item.produto.imagemPrincipal || undefined
          })),
          subtotal: venda.valorTotal - (venda.valorFrete || 0),
          shipping: venda.valorFrete || 0,
          total: venda.valorTotal,
          shippingAddress: venda.enderecoEntrega as any
        })

        logger.info('Confirmation email sent', { customerEmail, vendaId })
      }
    } catch (emailError) {
      logger.error('Error sending confirmation email', { error: emailError })
      // Don't fail the transaction if email fails
    }
  })

  logger.info('Sale finalized and stock updated successfully', { vendaId, paymentId })
}

async function handlePendingPayment(paymentInfo: any) {
  logger.info('Payment PENDING', { paymentId: paymentInfo.id })

  const paymentId = paymentInfo.id.toString()
  const vendaId = paymentInfo.external_reference

  if (!vendaId) {
    logger.error('No external_reference (venda ID) found in payment', { paymentId })
    return
  }

  // IDEMPOTENCY CHECK: Verify if this payment was already processed
  const vendaExistente = await prisma.venda.findUnique({
    where: { mercadoPagoPaymentId: paymentId }
  })

  if (vendaExistente) {
    logger.warn('Payment already processed', { paymentId, vendaId: vendaExistente.id })

    // Update status if changed
    if (vendaExistente.mercadoPagoStatus !== paymentInfo.status) {
      await prisma.venda.update({
        where: { id: vendaExistente.id },
        data: {
          mercadoPagoStatus: paymentInfo.status,
          dataAtualizacao: new Date()
        }
      })
      logger.debug('Status updated', { vendaId: vendaExistente.id })
    }

    return // Don't process again
  }

  // Update venda with payment ID (but keep status as PENDENTE_PAGAMENTO)
  await prisma.venda.update({
    where: { id: vendaId },
    data: {
      mercadoPagoPaymentId: paymentId,
      mercadoPagoStatus: paymentInfo.status,
      dataAtualizacao: new Date()
    }
  })

  logger.warn('Sale awaiting payment confirmation', { vendaId, paymentId })
}

async function handleRejectedPayment(paymentInfo: any) {
  logger.warn('Payment REJECTED', { paymentId: paymentInfo.id })

  const paymentId = paymentInfo.id.toString()
  const vendaId = paymentInfo.external_reference

  // IDEMPOTENCY CHECK: Find existing sale
  const vendaExistente = await prisma.venda.findUnique({
    where: { mercadoPagoPaymentId: paymentId }
  })

  if (vendaExistente) {
    logger.info('Found existing sale', { vendaId: vendaExistente.id })

    // Update status to cancelled
    if (vendaExistente.status !== 'CANCELADO') {
      await prisma.venda.update({
        where: { id: vendaExistente.id },
        data: {
          status: 'CANCELADO',
          mercadoPagoStatus: paymentInfo.status,
          dataAtualizacao: new Date()
        }
      })
      logger.info('Sale marked as CANCELLED', { vendaId: vendaExistente.id })
    }

    return
  }

  // If we have venda ID, mark it as cancelled
  if (vendaId) {
    await prisma.venda.update({
      where: { id: vendaId },
      data: {
        mercadoPagoPaymentId: paymentId,
        mercadoPagoStatus: paymentInfo.status,
        status: 'CANCELADO',
        dataAtualizacao: new Date()
      }
    })
    logger.info('Pending sale marked as CANCELLED', { vendaId })
  } else {
    logger.warn('Payment rejected (no venda reference)', { paymentId })
  }
}

async function handleRefundedPayment(paymentInfo: any) {
  logger.info('Payment REFUNDED', { paymentId: paymentInfo.id })

  const paymentId = paymentInfo.id.toString()

  // IDEMPOTENCY CHECK: Find existing sale
  const vendaExistente = await prisma.venda.findUnique({
    where: { mercadoPagoPaymentId: paymentId },
    include: {
      items: {
        include: {
          produto: true
        }
      }
    }
  })

  if (!vendaExistente) {
    logger.warn('No sale found for refunded payment', { paymentId })
    return
  }

  logger.info('Found sale for refund', { vendaId: vendaExistente.id })

  // Update status to ESTORNADO and restore stock (only if not already updated)
  if (vendaExistente.status !== 'ESTORNADO') {
    await prisma.$transaction(async (tx) => {
      // Update venda status
      await tx.venda.update({
        where: { id: vendaExistente.id },
        data: {
          status: 'ESTORNADO',
          mercadoPagoStatus: paymentInfo.status,
          dataAtualizacao: new Date()
        }
      })

      // Restore product stock
      for (const item of vendaExistente.items) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            vendido: false,
            estoque: { increment: item.quantidade }
          }
        })

        logger.debug('Stock restored', { produtoId: item.produtoId, produtoNome: item.produto.nome })
      }
    })

    logger.info('Sale marked as REFUNDED and stock restored', { vendaId: vendaExistente.id })
  } else {
    logger.debug('Sale already marked as REFUNDED (idempotent)', { vendaId: vendaExistente.id })
  }

  logger.info('Refund processed successfully', { vendaId: vendaExistente.id, paymentId })
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
