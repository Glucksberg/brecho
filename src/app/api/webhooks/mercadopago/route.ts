import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoPaymentNotification } from '@/lib/mercadopago'
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

    // Por ora, apenas reconhecemos o recebimento (processamento completo será habilitado depois)
    return NextResponse.json({ received: true, type: body.type, action: body.action })
  } catch (error: any) {
    logger.error('Error processing Mercado Pago webhook', { error: error.message, stack: error.stack })

    // Always return 200 to prevent retries
    return NextResponse.json(
      { error: 'Internal error', message: error.message },
      { status: 200 }
    )
  }
}
