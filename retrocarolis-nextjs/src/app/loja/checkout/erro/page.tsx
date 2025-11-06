'use client'

import { useSearchParams } from 'next/navigation'
import { LojaLayout } from '@/components/layout'
import { Card, CardContent, Button } from '@/components/ui'
import { XCircle, RefreshCcw, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutErroPage() {
  const searchParams = useSearchParams()

  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const statusDetail = searchParams.get('status_detail')

  const getErrorMessage = (detail: string | null) => {
    const messages: Record<string, string> = {
      'cc_rejected_bad_filled_card_number': 'Número do cartão inválido',
      'cc_rejected_bad_filled_date': 'Data de validade inválida',
      'cc_rejected_bad_filled_other': 'Verifique os dados do cartão',
      'cc_rejected_bad_filled_security_code': 'Código de segurança inválido',
      'cc_rejected_blacklist': 'Cartão bloqueado',
      'cc_rejected_call_for_authorize': 'Entre em contato com seu banco',
      'cc_rejected_card_disabled': 'Cartão desabilitado',
      'cc_rejected_duplicated_payment': 'Pagamento duplicado',
      'cc_rejected_high_risk': 'Pagamento recusado por segurança',
      'cc_rejected_insufficient_amount': 'Saldo insuficiente',
      'cc_rejected_invalid_installments': 'Número de parcelas inválido',
      'cc_rejected_max_attempts': 'Limite de tentativas excedido'
    }

    return messages[detail || ''] || 'Não foi possível processar o pagamento'
  }

  return (
    <LojaLayout>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Card variant="bordered">
          <CardContent className="p-12 text-center">
            {/* Error Icon */}
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pagamento Não Autorizado
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              {getErrorMessage(statusDetail)}
            </p>

            {/* Error Details */}
            {paymentId && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID da Tentativa:</span>
                    <span className="font-mono font-medium text-gray-900">{paymentId}</span>
                  </div>
                  {statusDetail && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Motivo:</span>
                      <span className="text-red-600 font-medium">{getErrorMessage(statusDetail)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Recusado
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                O que fazer?
              </h3>
              <ul className="space-y-3 text-sm text-yellow-800">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Verifique se os dados do cartão estão corretos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Confirme se há saldo/limite disponível</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Tente usar outro cartão ou forma de pagamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Entre em contato com seu banco se o problema persistir</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/loja/checkout" className="flex-1 sm:flex-initial">
                <Button variant="primary" size="lg" className="w-full sm:w-auto" icon={<RefreshCcw className="w-5 h-5" />}>
                  Tentar Novamente
                </Button>
              </Link>
              <Link href="/loja/carrinho" className="flex-1 sm:flex-initial">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Voltar ao Carrinho
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Precisa de ajuda?{' '}
            <a href="mailto:contato@retrocarolis.com.br" className="text-blue-600 hover:text-blue-700">
              Entre em contato conosco
            </a>
          </p>
        </div>
      </div>
    </LojaLayout>
  )
}
