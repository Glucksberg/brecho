'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LojaLayout } from '@/components/layout'
import { Card, CardContent, Button } from '@/components/ui'
import { CheckCircle, Package, Mail } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

export default function CheckoutSucessoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()

  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const externalReference = searchParams.get('external_reference')
  const preferenceId = searchParams.get('preference_id')

  useEffect(() => {
    // Clear cart on successful payment
    if (status === 'approved') {
      clearCart()
    }
  }, [status, clearCart])

  return (
    <LojaLayout>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Card variant="bordered">
          <CardContent className="p-12 text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pagamento Confirmado!
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Seu pedido foi recebido e está sendo processado.
              Você receberá um email com os detalhes da compra.
            </p>

            {/* Payment Info */}
            {paymentId && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID do Pagamento:</span>
                    <span className="font-mono font-medium text-gray-900">{paymentId}</span>
                  </div>
                  {preferenceId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID do Pedido:</span>
                      <span className="font-mono font-medium text-gray-900">{preferenceId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Aprovado
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Próximos Passos
              </h3>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Você receberá um email de confirmação em breve</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Seu pedido será preparado e enviado em até 2 dias úteis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Você poderá acompanhar o status do pedido na sua conta</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>O código de rastreamento será enviado por email</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-8">
              <Mail className="w-4 h-4" />
              <span>
                Dúvidas? Entre em contato:{' '}
                <a href="mailto:contato@retrocarolis.com.br" className="text-blue-600 hover:text-blue-700">
                  contato@retrocarolis.com.br
                </a>
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/loja/conta" className="flex-1 sm:flex-initial">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Ver Meus Pedidos
                </Button>
              </Link>
              <Link href="/loja" className="flex-1 sm:flex-initial">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Obrigado por comprar na Retrô Carólis! 💚
          </p>
          <p className="mt-2">
            Você está ajudando a construir um futuro mais sustentável.
          </p>
        </div>
      </div>
    </LojaLayout>
  )
}
