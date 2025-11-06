'use client'

import { PortalFornecedoraLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { DollarSign, Package, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function PortalFornecedoraPage() {
  // TODO: Fetch from API
  const fornecedora = {
    id: '1',
    nome: 'Maria Fornecedora',
    percentualRepasse: 60,
    produtosAtivos: 32,
    produtosVendidos: 18,
    creditoDisponivel: 1250.00,
    creditoPendente: 850.00,
    totalVendido: 4580.00
  }

  const creditosRecentes = [
    {
      id: '1',
      produto: 'Vestido Floral Vintage',
      valorVenda: 189.90,
      valorCredito: 113.94,
      status: 'LIBERADO',
      dataVenda: new Date('2024-10-15'),
      dataLiberacao: new Date('2024-11-14')
    },
    {
      id: '2',
      produto: 'Jaqueta Jeans',
      valorVenda: 159.90,
      valorCredito: 95.94,
      status: 'PENDENTE',
      dataVenda: new Date('2024-11-01'),
      dataLiberacao: new Date('2024-12-01')
    },
    {
      id: '3',
      produto: 'Bolsa de Couro',
      valorVenda: 129.90,
      valorCredito: 77.94,
      status: 'LIBERADO',
      dataVenda: new Date('2024-10-10'),
      dataLiberacao: new Date('2024-11-09')
    },
  ]

  const produtosAtivos = [
    {
      id: '1',
      nome: 'Calça Jeans Skinny',
      preco: 119.90,
      categoria: 'CALCA',
      dataEntrada: new Date('2024-11-01'),
      status: 'ATIVO'
    },
    {
      id: '2',
      nome: 'Camisa Estampada',
      preco: 89.90,
      categoria: 'CAMISA',
      dataEntrada: new Date('2024-10-28'),
      status: 'ATIVO'
    },
    {
      id: '3',
      nome: 'Saia Plissada',
      preco: 99.90,
      categoria: 'SAIA',
      dataEntrada: new Date('2024-10-25'),
      status: 'RESERVADO'
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIBERADO':
        return 'success'
      case 'PENDENTE':
        return 'warning'
      case 'UTILIZADO':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <PortalFornecedoraLayout>
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8 mb-8">
        <h2 className="text-3xl font-bold mb-2">Olá, {fornecedora.nome}! 👋</h2>
        <p className="text-purple-100">
          Acompanhe seus produtos em consignação e seus créditos disponíveis
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crédito Disponível</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {formatCurrency(fornecedora.creditoDisponivel)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  +15% em produtos
                </p>
              </div>
              <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crédito Pendente</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {formatCurrency(fornecedora.creditoPendente)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Libera em 30 dias
                </p>
              </div>
              <div className="w-14 h-14 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produtos Ativos</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {fornecedora.produtosAtivos}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Em consignação
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produtos Vendidos</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {fornecedora.produtosVendidos}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Total vendido: {formatCurrency(fornecedora.totalVendido)}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repasse Info */}
      <Card variant="bordered" className="mb-8 bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900">Seu Percentual de Repasse</p>
              <p className="text-4xl font-bold text-purple-600 mt-1">
                {fornecedora.percentualRepasse}%
              </p>
              <p className="text-sm text-purple-700 mt-2">
                Em cada venda, você recebe {fornecedora.percentualRepasse}% do valor do produto
              </p>
            </div>
            <CheckCircle className="w-16 h-16 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Créditos Recentes */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Créditos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {creditosRecentes.map((credito) => (
                <div key={credito.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{credito.produto}</p>
                      <p className="text-sm text-gray-500">
                        Vendido em {formatDate(credito.dataVenda)}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(credito.status) as any}>
                      {credito.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-600">Valor da Venda</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(credito.valorVenda)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Seu Crédito</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(credito.valorCredito)}
                      </p>
                    </div>
                  </div>
                  {credito.status === 'PENDENTE' && (
                    <p className="text-xs text-yellow-600 mt-2">
                      Libera em {formatDate(credito.dataLiberacao)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Produtos Ativos */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Seus Produtos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {produtosAtivos.map((produto) => (
                <div key={produto.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{produto.nome}</p>
                      <p className="text-sm text-gray-500">{produto.categoria}</p>
                      <p className="text-sm text-gray-500">
                        Desde {formatDate(produto.dataEntrada)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(produto.preco)}
                      </p>
                      <Badge variant={produto.status === 'RESERVADO' ? 'warning' : 'success'} className="mt-1">
                        {produto.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalFornecedoraLayout>
  )
}
