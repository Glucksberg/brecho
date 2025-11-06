'use client'

import { useSearchParams } from 'next/navigation'
import { LojaLayout } from '@/components/layout'
import { Card, CardContent, Button } from '@/components/ui'
import { Clock, Mail, Smartphone, Barcode } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPendentePage() {
  const searchParams = useSearchParams()

  const paymentId = searchParams.get('payment_id')
  const paymentType = searchParams.get('payment_type')

  const getPendingMessage = (type: string | null) => {
    if (type === 'ticket') {
      return {
        title: 'Aguardando Pagamento do Boleto',
        description: 'Seu boleto foi gerado com sucesso. Pague até a data de vencimento para confirmar seu pedido.',
        icon: <Barcode className="w-12 h-12 text-orange-600" />,
        steps: [
          'Você receberá o boleto por email',
          'Pague em qualquer banco ou lotérica',
          'O prazo de processamento é de até 2 dias úteis',
          'Após a confirmação, seu pedido será processado'
        ]
      }
    }

    if (type === 'pix') {
      return {
        title: 'Aguardando Pagamento via PIX',
        description: 'Seu código PIX foi gerado. Escaneie o QR Code ou copie o código para efetuar o pagamento.',
        icon: <Smartphone className="w-12 h-12 text-orange-600" />,
        steps: [
          'Abra o app do seu banco',
          'Escolha a opção PIX',
          'Escaneie o QR Code ou cole o código',
          'Confirme o pagamento - processamento instantâneo!'
        ]
      }
    }

    return {
      title: 'Pagamento em Análise',
      description: 'Seu pagamento está sendo processado. Isso pode levar alguns minutos.',
      icon: <Clock className="w-12 h-12 text-orange-600" />,
      steps: [
        'Seu pedido está reservado',
        'Estamos verificando o pagamento',
        'Você receberá um email quando for aprovado',
        'Isso geralmente leva alguns minutos'
      ]
    }
  }

  const pendingInfo = getPendingMessage(paymentType)

  return (
    <LojaLayout>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Card variant="bordered">
          <CardContent className="p-12 text-center">
            {/* Pending Icon */}
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {pendingInfo.icon}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {pendingInfo.title}
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              {pendingInfo.description}
            </p>

            {/* Payment Info */}
            {paymentId && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID do Pagamento:</span>
                    <span className="font-mono font-medium text-gray-900">{paymentId}</span>
                  </div>
                  {paymentType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Método:</span>
                      <span className="font-medium text-gray-900">
                        {paymentType === 'ticket' && 'Boleto'}
                        {paymentType === 'pix' && 'PIX'}
                        {paymentType === 'credit_card' && 'Cartão de Crédito'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Pendente
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-900 mb-4">
                O que acontece agora?
              </h3>
              <ul className="space-y-3 text-sm text-blue-800">
                {pendingInfo.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5 font-bold">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Email Notice */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-8 bg-gray-50 p-4 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>
                Enviamos todas as informações para o seu email
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

        {/* Help */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Dúvidas sobre seu pagamento?{' '}
            <a href="mailto:contato@retrocarolis.com.br" className="text-blue-600 hover:text-blue-700">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </LojaLayout>
  )
}
