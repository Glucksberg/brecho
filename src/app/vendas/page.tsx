'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui'
import { Plus, Search, Filter, Calendar, Download } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default function VendasPage() {
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    status: '',
    origem: ''
  })

  // TODO: Fetch from API
  const vendas = [
    {
      id: '1',
      numeroVenda: '#VD-001',
      cliente: { nome: 'Maria Silva', email: 'maria@email.com' },
      vendedor: { nome: 'João Santos' },
      data: new Date('2024-11-06T10:30:00'),
      origem: 'PRESENCIAL',
      tipoPagamento: 'DINHEIRO',
      valorTotal: 385.90,
      status: 'FINALIZADA',
      quantidadeItens: 3
    },
    {
      id: '2',
      numeroVenda: '#VD-002',
      cliente: { nome: 'Ana Costa', email: 'ana@email.com' },
      vendedor: { nome: 'João Santos' },
      data: new Date('2024-11-06T11:15:00'),
      origem: 'ONLINE',
      tipoPagamento: 'CARTAO_CREDITO',
      valorTotal: 229.50,
      status: 'FINALIZADA',
      quantidadeItens: 2
    },
    {
      id: '3',
      numeroVenda: '#VD-003',
      cliente: { nome: 'Pedro Lima', email: 'pedro@email.com' },
      vendedor: { nome: 'João Santos' },
      data: new Date('2024-11-06T14:20:00'),
      origem: 'PRESENCIAL',
      tipoPagamento: 'PIX',
      valorTotal: 450.00,
      status: 'FINALIZADA',
      quantidadeItens: 4
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FINALIZADA':
        return 'success'
      case 'CANCELADA':
        return 'danger'
      case 'PENDENTE':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getOrigemBadge = (origem: string) => {
    return origem === 'ONLINE' ? 'primary' : 'default'
  }

  const getTipoPagamento = (tipo: string) => {
    const tipos: Record<string, string> = {
      DINHEIRO: 'Dinheiro',
      CARTAO_CREDITO: 'Cartão Crédito',
      CARTAO_DEBITO: 'Cartão Débito',
      PIX: 'PIX',
      CREDITO_FORNECEDORA: 'Crédito'
    }
    return tipos[tipo] || tipo
  }

  const totalVendas = vendas.reduce((sum, v) => sum + v.valorTotal, 0)

  return (
    <AdminLayout title="Vendas">
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
          <Button variant="outline" icon={<Download className="w-5 h-5" />}>
            Exportar
          </Button>
        </div>
        <Button variant="primary" icon={<Plus className="w-5 h-5" />}>
          Nova Venda
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card variant="bordered">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total de Vendas</p>
            <p className="text-2xl font-bold text-gray-900">{vendas.length}</p>
          </CardContent>
        </Card>
        <Card variant="bordered">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Valor Total</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalVendas)}</p>
          </CardContent>
        </Card>
        <Card variant="bordered">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Ticket Médio</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalVendas / vendas.length)}
            </p>
          </CardContent>
        </Card>
        <Card variant="bordered">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Itens Vendidos</p>
            <p className="text-2xl font-bold text-purple-600">
              {vendas.reduce((sum, v) => sum + v.quantidadeItens, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Date Filters */}
      <Card variant="bordered" className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="date"
              label="Data Início"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              leftIcon={<Calendar className="w-5 h-5" />}
            />
            <Input
              type="date"
              label="Data Fim"
              value={filtros.dataFim}
              onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              leftIcon={<Calendar className="w-5 h-5" />}
            />
            <div className="flex items-end gap-2">
              <Button variant="primary" className="flex-1">Filtrar</Button>
              <Button variant="outline">Limpar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendas Table */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Lista de Vendas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Venda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vendedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Origem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendas.map((venda) => (
                  <tr key={venda.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-gray-900">{venda.numeroVenda}</p>
                        <p className="text-sm text-gray-500">{venda.quantidadeItens} itens</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{venda.cliente.nome}</p>
                        <p className="text-sm text-gray-500">{venda.cliente.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{venda.vendedor.nome}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{formatDateTime(venda.data)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getOrigemBadge(venda.origem) as any}>
                        {venda.origem}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {getTipoPagamento(venda.tipoPagamento)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(venda.valorTotal)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(venda.status) as any}>
                        {venda.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="ghost" size="sm">Ver Detalhes</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
