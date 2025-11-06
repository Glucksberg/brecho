'use client'

import { LojaLayout } from '@/components/layout'
import { Card, CardContent, Button, Badge, Input } from '@/components/ui'
import { Search, Filter, Heart } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'

export default function LojaPage() {
  // TODO: Fetch from API
  const produtosDestaque = [
    {
      id: '1',
      nome: 'Vestido Floral Vintage',
      preco: 189.90,
      categoria: 'VESTIDO',
      condicao: 'SEMINOVO',
      imagem: '/placeholder-product.jpg',
      destaque: true
    },
    {
      id: '2',
      nome: 'Jaqueta Jeans Anos 90',
      preco: 159.90,
      categoria: 'JAQUETA',
      condicao: 'SEMINOVO',
      imagem: '/placeholder-product.jpg',
      destaque: true
    },
    {
      id: '3',
      nome: 'Bolsa de Couro Marrom',
      preco: 129.90,
      categoria: 'ACESSORIO',
      condicao: 'USADO',
      imagem: '/placeholder-product.jpg',
      destaque: false
    },
    {
      id: '4',
      nome: 'Calça Jeans Skinny',
      preco: 119.90,
      categoria: 'CALCA',
      condicao: 'SEMINOVO',
      imagem: '/placeholder-product.jpg',
      destaque: false
    },
    {
      id: '5',
      nome: 'Camisa Estampada Retro',
      preco: 89.90,
      categoria: 'CAMISA',
      condicao: 'SEMINOVO',
      imagem: '/placeholder-product.jpg',
      destaque: false
    },
    {
      id: '6',
      nome: 'Tênis Branco Clássico',
      preco: 199.90,
      categoria: 'CALCADO',
      condicao: 'NOVO',
      imagem: '/placeholder-product.jpg',
      destaque: true
    },
  ]

  const getCondicaoBadge = (condicao: string) => {
    const badges: Record<string, { label: string; color: 'success' | 'primary' | 'warning' }> = {
      NOVO: { label: 'Novo', color: 'success' },
      SEMINOVO: { label: 'Seminovo', color: 'primary' },
      USADO: { label: 'Usado', color: 'warning' }
    }
    return badges[condicao] || badges.SEMINOVO
  }

  return (
    <LojaLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Moda Sustentável e Acessível</h1>
          <p className="text-xl mb-8">Renove seu guarda-roupa de forma consciente</p>
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Buscar roupas, acessórios..."
                className="flex-1"
                leftIcon={<Search className="w-5 h-5" />}
              />
              <Button variant="secondary" size="lg">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {['Vestidos', 'Blusas', 'Calças', 'Jaquetas', 'Acessórios', 'Calçados'].map((cat) => (
              <button
                key={cat}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
              >
                <p className="font-semibold text-gray-900">{cat}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Produtos em Destaque
          </h2>
          <Button variant="outline" icon={<Filter className="w-5 h-5" />}>
            Filtros
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produtosDestaque.map((produto) => {
            const condicao = getCondicaoBadge(produto.condicao)

            return (
              <Card key={produto.id} variant="bordered" className="group hover:shadow-xl transition-all">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-20 h-20" />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3">
                      <Badge variant={condicao.color}>
                        {condicao.label}
                      </Badge>
                    </div>

                    {/* Favorite Button */}
                    <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors">
                      <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                    </button>

                    {/* Quick View on Hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                      <Button
                        variant="primary"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      {produto.categoria}
                    </p>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {produto.nome}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(produto.preco)}
                      </p>
                      <Button variant="primary" size="sm">
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Carregar Mais Produtos
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Frete Grátis</h3>
              <p className="text-gray-600">Para compras acima de R$ 200</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RecycleIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Moda Sustentável</h3>
              <p className="text-gray-600">Economia circular e consciente</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Compra Segura</h3>
              <p className="text-gray-600">Garantia e troca facilitada</p>
            </div>
          </div>
        </div>
      </div>
    </LojaLayout>
  )
}

// Placeholder icons
function Package({ className }: { className?: string }) {
  return <div className={className}>📦</div>
}

function TruckIcon({ className }: { className?: string }) {
  return <div className={className}>🚚</div>
}

function RecycleIcon({ className }: { className?: string }) {
  return <div className={className}>♻️</div>
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return <div className={className}>✅</div>
}
