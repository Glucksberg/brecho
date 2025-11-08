'use client'

import { useState } from 'react'
import { LojaLayout } from '@/components/layout'
import { Card, CardContent, Button, Input } from '@/components/ui'
import { Search, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'

export default function RastrearPage() {
  const [codigoRastreamento, setCodigoRastreamento] = useState('')
  const [rastreamento, setRastreamento] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRastrear = async () => {
    if (!codigoRastreamento.trim()) {
      setError('Por favor, informe o código de rastreamento')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // TODO: Integrar com API de rastreamento real
      // Por enquanto, simulação
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      setRastreamento({
        codigo: codigoRastreamento,
        status: 'EM_TRANSITO',
        previsaoEntrega: '2025-11-15',
        historico: [
          {
            data: '2025-11-08 10:00',
            status: 'Pedido confirmado',
            local: 'Loja Retrô Carólis'
          },
          {
            data: '2025-11-08 14:30',
            status: 'Pedido enviado',
            local: 'Centro de Distribuição'
          },
          {
            data: '2025-11-09 08:00',
            status: 'Em trânsito',
            local: 'Transportadora'
          }
        ]
      })
    } catch (err) {
      setError('Erro ao rastrear pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ENTREGUE':
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case 'EM_TRANSITO':
        return <Truck className="w-6 h-6 text-blue-600" />
      case 'PENDENTE':
        return <Clock className="w-6 h-6 text-yellow-600" />
      default:
        return <XCircle className="w-6 h-6 text-red-600" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ENTREGUE: 'Entregue',
      EM_TRANSITO: 'Em Trânsito',
      PENDENTE: 'Pendente',
      CANCELADO: 'Cancelado'
    }
    return labels[status] || status
  }

  return (
    <LojaLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rastrear Pedido
          </h1>
          <p className="text-gray-600">
            Informe o código de rastreamento para acompanhar seu pedido
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Digite o código de rastreamento"
                value={codigoRastreamento}
                onChange={(e) => setCodigoRastreamento(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRastrear()}
                leftIcon={<Search className="w-5 h-5" />}
                className="flex-1"
              />
              <Button
                variant="primary"
                onClick={handleRastrear}
                disabled={loading}
              >
                {loading ? 'Rastreando...' : 'Rastrear'}
              </Button>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Tracking Result */}
        {rastreamento && (
          <Card>
            <CardContent className="p-6">
              {/* Status Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Código de Rastreamento</p>
                  <p className="text-lg font-bold text-gray-900">{rastreamento.codigo}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(rastreamento.status)}
                    <span className="font-semibold text-gray-900">
                      {getStatusLabel(rastreamento.status)}
                    </span>
                  </div>
                  {rastreamento.previsaoEntrega && (
                    <p className="text-sm text-gray-600">
                      Previsão de entrega: {new Date(rastreamento.previsaoEntrega).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Histórico de Rastreamento</h3>
                {rastreamento.historico.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                      {index < rastreamento.historico.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-semibold text-gray-900">{item.status}</p>
                      <p className="text-sm text-gray-600">{item.local}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.data}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!rastreamento && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Informe o código de rastreamento acima para acompanhar seu pedido
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </LojaLayout>
  )
}

