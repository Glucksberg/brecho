'use client'

import { AdminLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui'
import { Plus, Search, DollarSign, Package, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function FornecedorasPage() {
  // TODO: Fetch real data from API
  const fornecedoras = [
    {
      id: '1',
      nome: 'Maria Silva',
      telefone: '(11) 98765-4321',
      email: 'maria@email.com',
      percentualRepasse: 60,
      produtosAtivos: 45,
      produtosVendidos: 23,
      creditoDisponivel: 1250.00,
      creditoPendente: 850.00,
      ativo: true
    },
    {
      id: '2',
      nome: 'Ana Costa',
      telefone: '(11) 97654-3210',
      email: 'ana@email.com',
      percentualRepasse: 65,
      produtosAtivos: 32,
      produtosVendidos: 18,
      creditoDisponivel: 890.50,
      creditoPendente: 450.00,
      ativo: true
    },
    {
      id: '3',
      nome: 'Juliana Santos',
      telefone: '(11) 96543-2109',
      email: 'juliana@email.com',
      percentualRepasse: 60,
      produtosAtivos: 28,
      produtosVendidos: 15,
      creditoDisponivel: 675.00,
      creditoPendente: 320.00,
      ativo: true
    },
  ]

  const getClassificacao = (produtosVendidos: number) => {
    if (produtosVendidos >= 20) return { label: 'VIP', color: 'danger' }
    if (produtosVendidos >= 15) return { label: 'Premium', color: 'primary' }
    if (produtosVendidos >= 10) return { label: 'Regular', color: 'success' }
    return { label: 'Iniciante', color: 'default' }
  }

  return (
    <AdminLayout title="Fornecedoras">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar por nome, email, telefone..."
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
        <Button variant="primary" icon={<Plus className="w-5 h-5" />}>
          Nova Fornecedora
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fornecedoras</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{fornecedoras.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produtos em Consignação</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {fornecedoras.reduce((sum, f) => sum + f.produtosAtivos, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crédito Disponível</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(fornecedoras.reduce((sum, f) => sum + f.creditoDisponivel, 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crédito Pendente</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {formatCurrency(fornecedoras.reduce((sum, f) => sum + f.creditoPendente, 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fornecedoras Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fornecedoras.map((fornecedora) => {
          const classificacao = getClassificacao(fornecedora.produtosVendidos)

          return (
            <Card key={fornecedora.id} variant="bordered" className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{fornecedora.nome}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{fornecedora.email}</p>
                    <p className="text-sm text-gray-500">{fornecedora.telefone}</p>
                  </div>
                  <Badge variant={classificacao.color as any}>
                    {classificacao.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{fornecedora.produtosAtivos}</p>
                    <p className="text-xs text-gray-600">Produtos Ativos</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{fornecedora.produtosVendidos}</p>
                    <p className="text-xs text-gray-600">Vendidos</p>
                  </div>
                </div>

                {/* Repasse */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Percentual de Repasse</p>
                  <p className="text-xl font-bold text-blue-600">{fornecedora.percentualRepasse}%</p>
                </div>

                {/* Credits */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Crédito Disponível</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(fornecedora.creditoDisponivel)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Crédito Pendente</span>
                    <span className="font-semibold text-yellow-600">
                      {formatCurrency(fornecedora.creditoPendente)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Produtos
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </AdminLayout>
  )
}
