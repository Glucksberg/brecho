'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/layout'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  CreditCard,
  AlertCircle
} from 'lucide-react'

interface Stats {
  vendasHoje: {
    total: number
    quantidade: number
    crescimento: number
  }
  vendasMes: {
    total: number
    quantidade: number
    crescimento: number
  }
  produtosAtivos: number
  produtosVendidosMes: number
  ticketMedio: number
  caixaAberto: boolean
  saldoCaixa: number
}

interface RecentSale {
  id: string
  cliente: string
  valor: number
  produtos: number
  tempo: string
}

interface LowStockProduct {
  id: string
  nome: string
  estoque: number
  categoria: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentSales, setRecentSales] = useState<RecentSale[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [loading, setLoading] = useState(true)

  // TODO: Get brechoId from session/context
  const brechoId = 'default-brecho-id'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch all dashboard data in parallel
        const [statsRes, salesRes, stockRes] = await Promise.all([
          fetch(`/api/dashboard/stats?brechoId=${brechoId}`),
          fetch(`/api/dashboard/vendas-recentes?brechoId=${brechoId}&limit=4`),
          fetch(`/api/dashboard/estoque-baixo?brechoId=${brechoId}&limit=5`)
        ])

        const [statsData, salesData, stockData] = await Promise.all([
          statsRes.json(),
          salesRes.json(),
          stockRes.json()
        ])

        if (statsData) setStats(statsData)
        if (salesData?.vendas) setRecentSales(salesData.vendas)
        if (stockData?.produtos) setLowStockProducts(stockData.produtos)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [brechoId])

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!stats) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Erro ao carregar dados do dashboard</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Vendas Hoje"
          value={stats.vendasHoje.total}
          format="currency"
          icon={<DollarSign className="w-7 h-7" />}
          subtitle={`${stats.vendasHoje.quantidade} vendas`}
        />

        <StatCard
          title="Vendas do Mês"
          value={stats.vendasMes.total}
          format="currency"
          icon={<TrendingUp className="w-7 h-7" />}
          trend={{
            value: stats.vendasMes.crescimento,
            isPositive: stats.vendasMes.crescimento > 0
          }}
        />

        <StatCard
          title="Produtos Ativos"
          value={stats.produtosAtivos}
          format="number"
          icon={<Package className="w-7 h-7" />}
          subtitle={`${stats.produtosVendidosMes} vendidos no mês`}
        />

        <StatCard
          title="Ticket Médio"
          value={stats.ticketMedio}
          format="currency"
          icon={<ShoppingCart className="w-7 h-7" />}
        />
      </div>

      {/* Caixa Status */}
      {stats.caixaAberto && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-900">Caixa Aberto</p>
              <p className="text-sm text-green-700">
                Saldo atual: <span className="font-bold">{stats.saldoCaixa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Ver Detalhes
          </button>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{sale.cliente}</p>
                      <p className="text-sm text-gray-500">{sale.produtos} produtos • {sale.tempo}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {sale.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Estoque Baixo</CardTitle>
              <Badge variant="warning" className="gap-1">
                <AlertCircle className="w-3 h-3" />
                {lowStockProducts.length} alertas
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{product.nome}</p>
                    <p className="text-sm text-gray-500">{product.categoria}</p>
                  </div>
                  <Badge variant="warning">
                    {product.estoque} {product.estoque === 1 ? 'unidade' : 'unidades'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Nova Venda</h3>
          <p className="text-sm text-gray-500">Registrar uma nova venda no sistema</p>
        </button>

        <button className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Novo Produto</h3>
          <p className="text-sm text-gray-500">Cadastrar um novo produto</p>
        </button>

        <button className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Nova Fornecedora</h3>
          <p className="text-sm text-gray-500">Cadastrar fornecedora para consignação</p>
        </button>
      </div>
    </AdminLayout>
  )
}
