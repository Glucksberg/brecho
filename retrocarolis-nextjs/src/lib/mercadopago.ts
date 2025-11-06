import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

// Configuração do Mercado Pago
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || ''

if (!accessToken && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  MERCADOPAGO_ACCESS_TOKEN não configurado!')
}

export const mercadopagoClient = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
})

export const mercadopagoPayment = new Payment(mercadopagoClient)
export const mercadopagoPreference = new Preference(mercadopagoClient)

// TypeScript Types
export interface MercadoPagoItem {
  id: string
  title: string
  description?: string
  picture_url?: string
  category_id?: string
  quantity: number
  currency_id: 'BRL' | 'USD' | 'EUR'
  unit_price: number
}

export interface MercadoPagoPayer {
  name?: string
  surname?: string
  email: string
  phone?: {
    area_code?: string
    number?: string
  }
  identification?: {
    type?: 'CPF' | 'CNPJ'
    number?: string
  }
  address?: {
    zip_code?: string
    street_name?: string
    street_number?: string
    city?: string
    state?: string
  }
}

export interface MercadoPagoShipment {
  cost?: number
  mode?: 'not_specified' | 'custom'
  receiver_address?: {
    zip_code: string
    street_name: string
    street_number: string
    floor?: string
    apartment?: string
    city_name?: string
    state_name?: string
    country_name?: string
  }
}

export interface MercadoPagoPreferenceRequest {
  items: MercadoPagoItem[]
  payer?: MercadoPagoPayer
  shipments?: MercadoPagoShipment
  back_urls?: {
    success: string
    failure: string
    pending: string
  }
  auto_return?: 'approved' | 'all'
  external_reference?: string
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>
    excluded_payment_types?: Array<{ id: string }>
    installments?: number
  }
  notification_url?: string
  statement_descriptor?: string
  metadata?: Record<string, any>
}

export interface MercadoPagoPreferenceResponse {
  id: string
  init_point: string // URL for checkout
  sandbox_init_point?: string // URL for sandbox checkout
  date_created: string
  operation_type: string
  items: MercadoPagoItem[]
}

export interface MercadoPagoPaymentNotification {
  action: 'payment.created' | 'payment.updated'
  api_version: string
  data: {
    id: string // Payment ID
  }
  date_created: string
  id: number // Notification ID
  live_mode: boolean
  type: 'payment'
  user_id: string
}

export interface MercadoPagoPaymentInfo {
  id: number
  status: 'pending' | 'approved' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back'
  status_detail: string
  transaction_amount: number
  currency_id: string
  date_created: string
  date_approved?: string
  payer: {
    email: string
    identification?: {
      type: string
      number: string
    }
  }
  external_reference?: string
  metadata?: Record<string, any>
  payment_method_id: string
  payment_type_id: string
}

// Utility functions
export function getPublicKey(): string {
  return process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || ''
}

export function isConfigured(): boolean {
  return !!(accessToken && getPublicKey())
}

export function isSandboxMode(): boolean {
  return process.env.MERCADOPAGO_MODE === 'sandbox'
}

// Get base URL for callbacks
export function getBaseUrl(): string {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return 'http://localhost:3000'
}

// Helper to create preference
export async function createCheckoutPreference(
  data: MercadoPagoPreferenceRequest
): Promise<MercadoPagoPreferenceResponse> {
  try {
    const response = await mercadopagoPreference.create({
      body: {
        ...data,
        back_urls: data.back_urls || {
          success: `${getBaseUrl()}/loja/checkout/sucesso`,
          failure: `${getBaseUrl()}/loja/checkout/erro`,
          pending: `${getBaseUrl()}/loja/checkout/pendente`
        },
        auto_return: data.auto_return || 'approved',
        notification_url: data.notification_url || `${getBaseUrl()}/api/webhooks/mercadopago`,
        statement_descriptor: data.statement_descriptor || 'RETRO CAROLIS'
      }
    })

    return response as unknown as MercadoPagoPreferenceResponse
  } catch (error) {
    console.error('Erro ao criar preferência Mercado Pago:', error)
    throw error
  }
}

// Helper to get payment info
export async function getPaymentInfo(paymentId: string): Promise<MercadoPagoPaymentInfo> {
  try {
    const response = await mercadopagoPayment.get({
      id: paymentId
    })

    return response as unknown as MercadoPagoPaymentInfo
  } catch (error) {
    console.error('Erro ao buscar pagamento Mercado Pago:', error)
    throw error
  }
}
