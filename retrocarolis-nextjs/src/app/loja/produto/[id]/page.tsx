'use client'

import { useState } from 'react'
import { LojaLayout } from '@/components/layout'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import { Heart, Share2, ShoppingCart, Truck, RefreshCcw, ShieldCheck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ProdutoDetalhePage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Mock product data
  const produto = {
    id: params.id,
    nome: 'Vestido Floral Vintage Anos 70',
    preco: 189.90,
    categoria: 'VESTIDO',
    subcategoria: 'Vestido Longo',
    condicao: 'SEMINOVO',
    marca: 'Vintage Collection',
    tamanho: 'M',
    cor: 'Floral Multicolorido',
    descricao: 'Lindo vestido vintage dos anos 70 com estampa floral vibrante. Perfeito estado de conservação, com tecido leve e confortável. Ideal para ocasiões especiais ou uso casual. A peça possui alças ajustáveis e zíper lateral.',
    imagens: [
      '/placeholder-product.jpg',
      '/placeholder-product-2.jpg',
      '/placeholder-product-3.jpg',
    ],
    medidas: {
      busto: '92cm',
      cintura: '76cm',
      quadril: '98cm',
      comprimento: '120cm'
    },
    status: 'ATIVO',
    tipo: 'CONSIGNADO',
    estoque: 1,
    peso: 0.3,
    materiais: ['100% Algodão'],
  }

  const getCondicaoBadge = (condicao: string) => {
    const badges: Record<string, { label: string; color: 'success' | 'primary' | 'warning' }> = {
      NOVO: { label: 'Novo', color: 'success' },
      SEMINOVO: { label: 'Seminovo', color: 'primary' },
      USADO: { label: 'Usado', color: 'warning' }
    }
    return badges[condicao] || badges.SEMINOVO
  }

  const condicao = getCondicaoBadge(produto.condicao)

  return (
    <LojaLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <a href="/loja" className="hover:text-blue-600">Início</a>
          <span>/</span>
          <a href="/loja/categoria/vestido" className="hover:text-blue-600">Vestidos</a>
          <span>/</span>
          <span className="text-gray-900">{produto.nome}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            {/* Main Image */}
            <Card variant="bordered" className="mb-4">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="text-gray-400 text-8xl">📷</div>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {produto.imagens.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                    📷
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge variant={condicao.color}>
                {condicao.label}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {produto.nome}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-gray-600">SKU: {produto.id}</span>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm text-gray-600">{produto.categoria}</span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-600">
                  {formatCurrency(produto.preco)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Em até 3x sem juros no cartão
              </p>
            </div>

            {/* Size and Color */}
            <div className="mb-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Tamanho</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border-2 border-blue-500 bg-blue-50 text-blue-600 rounded-lg font-medium">
                    {produto.tamanho}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Cor</p>
                <p className="text-gray-900">{produto.cor}</p>
              </div>

              {produto.marca && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Marca</p>
                  <p className="text-gray-900">{produto.marca}</p>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Quantidade</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(produto.estoque, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  +
                </button>
                <span className="text-sm text-gray-600 ml-2">
                  ({produto.estoque} disponível)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <Button variant="primary" size="lg" className="flex-1" icon={<ShoppingCart className="w-5 h-5" />}>
                Adicionar ao Carrinho
              </Button>
              <Button variant="outline" size="lg" icon={<Heart className="w-5 h-5" />}>
              </Button>
              <Button variant="outline" size="lg" icon={<Share2 className="w-5 h-5" />}>
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-green-600" />
                <span>Frete grátis para compras acima de R$ 200</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RefreshCcw className="w-5 h-5 text-blue-600" />
                <span>Troca grátis em até 7 dias</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <span>Compra 100% segura</span>
              </div>
            </div>

            {/* Description */}
            <Card variant="bordered">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {produto.descricao}
                </p>

                {produto.materiais && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-700 text-sm mb-1">Materiais:</p>
                    <p className="text-gray-600 text-sm">{produto.materiais.join(', ')}</p>
                  </div>
                )}

                <div className="mt-4">
                  <p className="font-medium text-gray-700 text-sm mb-2">Medidas:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Busto:</span>
                      <span className="font-medium">{produto.medidas.busto}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cintura:</span>
                      <span className="font-medium">{produto.medidas.cintura}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quadril:</span>
                      <span className="font-medium">{produto.medidas.quadril}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Comprimento:</span>
                      <span className="font-medium">{produto.medidas.comprimento}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Você também pode gostar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} variant="bordered" className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center text-gray-400 text-4xl">
                    📷
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase mb-1">VESTIDO</p>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      Produto Relacionado {i}
                    </h3>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(159.90)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </LojaLayout>
  )
}
