'use client'

import { AdminLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui'
import { Search, Filter, Check, X, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default function TrocasPage() {
  // TODO: Fetch from API
  const trocas = [
    {
      id: '1',
      numero: '#TR-001',
      tipo: 'DEVOLUCAO',
      motivo: 'DEFEITO',
      status: 'PENDENTE',
      dataSolicitacao: new Date('2024-11-06T10:00:00'),
      cliente: { nome: 'Maria Silva', email: 'maria@email.com' },
      venda: {
        id: 'v1',
        numeroVenda: '#VD-120',
        valorTotal: 189.90,
        origem: 'ONLINE',
        dataCriacao: new Date('2024-11-01'),
        itens: [
          { produto: { nome: 'Vestido Floral' }, quantidade: 1, precoUnitario: 189.90 }
        ]
      },
      observacoes: 'Produto apresentou defeito na costura'
    },
    {
      id: '2',
      numero: '#TR-002',
      tipo: 'TROCA',
      motivo: 'TAMANHO_INADEQUADO',
      status: 'APROVADA',
      dataSolicitacao: new Date('2024-11-05T14:30:00'),
      dataAprovacao: new Date('2024-11-05T15:00:00'),
      cliente: { nome: 'Ana Costa', email: 'ana@email.com' },
      venda: {
        id: 'v2',
        numeroVenda: '#VD-118',
        valorTotal: 119.90,
        origem: 'PRESENCIAL',
        dataCriacao: new Date('2024-11-04'),
        itens: [
          { produto: { nome: 'Calça Jeans' }, quantidade: 1, precoUnitario: 119.90 }
        ]
      },
      observacoes: 'Cliente quer trocar por tamanho maior'
    },
    {
      id: '3',
      numero: '#TR-003',
      tipo: 'DEVOLUCAO',
      motivo: 'ARREPENDIMENTO',
      status: 'RECUSADA',
      dataSolicitacao: new Date('2024-11-03T11:00:00'),
      dataRecusa: new Date('2024-11-03T12:00:00'),
      cliente: { nome: 'Pedro Lima', email: 'pedro@email.com' },
      venda: {
        id: 'v3',
        numeroVenda: '#VD-115',
        valorTotal: 89.90,
        origem: 'PRESENCIAL',
        dataCriacao: new Date('2024-10-20'),
        itens: [
          { produto: { nome: 'Camisa Estampada' }, quantidade: 1, precoUnitario: 89.90 }
        ]
      },
      observacoesRecusa: 'Prazo para troca expirado (compra presencial há mais de 7 dias)'
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'warning'
      case 'APROVADA':
        return 'success'
      case 'RECUSADA':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getTipoLabel = (tipo: string) => {
    return tipo === 'TROCA' ? 'Troca' : 'Devolução'
  }

  const getMotivoLabel = (motivo: string) => {
    const motivos: Record<string, string> = {
      DEFEITO: 'Defeito',
      TAMANHO_INADEQUADO: 'Tamanho Inadequado',
      ARREPENDIMENTO: 'Arrependimento',
      PRODUTO_ERRADO: 'Produto Errado',
      OUTRO: 'Outro'
    }
    return motivos[motivo] || motivo
  }

  const trocasPendentes = trocas.filter(t => t.status === 'PENDENTE').length
  const trocasAprovadas = trocas.filter(t => t.status === 'APROVADA').length
  const trocasRecusadas = trocas.filter(t => t.status === 'RECUSADA').length

  return (
    <AdminLayout title="Trocas e Devoluções">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar por número, cliente..."
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <Button variant="outline" icon={<Filter className="w-5 h-5" />}>
            Filtros
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-3xl font-bold text-yellow-600">{trocasPendentes}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprovadas</p>
                <p className="text-3xl font-bold text-green-600">{trocasAprovadas}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recusadas</p>
                <p className="text-3xl font-bold text-red-600">{trocasRecusadas}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trocas List */}
      <div className="space-y-4">
        {trocas.map((troca) => (
          <Card key={troca.id} variant="bordered" className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{troca.numero}</h3>
                    <Badge variant={getStatusColor(troca.status) as any}>
                      {troca.status}
                    </Badge>
                    <Badge variant={troca.tipo === 'TROCA' ? 'primary' : 'default'}>
                      {getTipoLabel(troca.tipo)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Solicitado em {formatDateTime(troca.dataSolicitacao)}
                  </p>
                </div>

                {troca.status === 'PENDENTE' && (
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" icon={<Check className="w-4 h-4" />}>
                      Aprovar
                    </Button>
                    <Button variant="danger" size="sm" icon={<X className="w-4 h-4" />}>
                      Recusar
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cliente Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cliente</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">{troca.cliente.nome}</p>
                    <p className="text-sm text-gray-600">{troca.cliente.email}</p>
                  </div>
                </div>

                {/* Venda Original */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Venda Original</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{troca.venda.numeroVenda}</span> - {formatCurrency(troca.venda.valorTotal)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {troca.venda.origem} • {formatDateTime(troca.venda.dataCriacao)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {troca.venda.itens.map(item => item.produto.nome).join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Motivo */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Motivo: <span className="font-semibold">{getMotivoLabel(troca.motivo)}</span>
                </p>
                {troca.observacoes && (
                  <p className="text-sm text-gray-600">{troca.observacoes}</p>
                )}
              </div>

              {/* Status Messages */}
              {troca.status === 'APROVADA' && troca.dataAprovacao && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Aprovada em {formatDateTime(troca.dataAprovacao)}
                  </p>
                </div>
              )}

              {troca.status === 'RECUSADA' && troca.dataRecusa && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-1">
                    ✗ Recusada em {formatDateTime(troca.dataRecusa)}
                  </p>
                  {troca.observacoesRecusa && (
                    <p className="text-sm text-red-700">{troca.observacoesRecusa}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  )
}
