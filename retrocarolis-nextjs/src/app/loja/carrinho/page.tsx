'use client'

import { useState } from 'react'
import { LojaLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui'
import { Trash2, Plus, Minus, Tag, ShoppingBag } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default function CarrinhoPage() {
  const [cupom, setCupom] = useState('')

  // Mock cart data
  const [itens, setItens] = useState([
    {
      id: '1',
      produtoId: 'p1',
      nome: 'Vestido Floral Vintage',
      preco: 189.90,
      quantidade: 1,
      imagem: '/placeholder-product.jpg',
      tamanho: 'M',
      cor: 'Floral Multicolorido'
    },
    {
      id: '2',
      produtoId: 'p2',
      nome: 'Jaqueta Jeans Anos 90',
      preco: 159.90,
      quantidade: 1,
      imagem: '/placeholder-product.jpg',
      tamanho: 'G',
      cor: 'Azul'
    },
    {
      id: '3',
      produtoId: 'p3',
      nome: 'Bolsa de Couro Marrom',
      preco: 129.90,
      quantidade: 2,
      imagem: '/placeholder-product.jpg',
      tamanho: 'Único',
      cor: 'Marrom'
    },
  ])

  const updateQuantity = (id: string, delta: number) => {
    setItens(itens.map(item =>
      item.id === id
        ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
        : item
    ))
  }

  const removeItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id))
  }

  const aplicarCupom = () => {
    // TODO: Implement coupon validation
    console.log('Aplicar cupom:', cupom)
  }

  const subtotal = itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0)
  const desconto = 0 // TODO: Calculate discount from coupon
  const frete = subtotal >= 200 ? 0 : 15.00
  const total = subtotal - desconto + frete

  if (itens.length === 0) {
    return (
      <LojaLayout>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Card variant="bordered">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Seu carrinho está vazio
              </h2>
              <p className="text-gray-600 mb-6">
                Adicione produtos para começar suas compras
              </p>
              <Link href="/loja">
                <Button variant="primary" size="lg">
                  Continuar Comprando
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </LojaLayout>
    )
  }

  return (
    <LojaLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Carrinho de Compras
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Itens ({itens.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itens.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      {/* Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-4xl">📷</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/loja/produto/${item.produtoId}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {item.nome}
                          </h3>
                        </Link>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Tamanho: {item.tamanho}</p>
                          <p>Cor: {item.cor}</p>
                        </div>
                        <p className="font-bold text-blue-600 mt-2">
                          {formatCurrency(item.preco)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-3">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 hover:bg-gray-100 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantidade}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 hover:bg-gray-100 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.preco * item.quantidade)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Coupon */}
            <Card variant="bordered" className="mt-4">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Código do cupom"
                    value={cupom}
                    onChange={(e) => setCupom(e.target.value)}
                    leftIcon={<Tag className="w-5 h-5" />}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={aplicarCupom}>
                    Aplicar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card variant="bordered" className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  {desconto > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>-{formatCurrency(desconto)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span>
                      {frete === 0 ? (
                        <span className="text-green-600 font-medium">Grátis</span>
                      ) : (
                        formatCurrency(frete)
                      )}
                    </span>
                  </div>

                  {frete > 0 && (
                    <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                      💡 Falta {formatCurrency(200 - subtotal)} para frete grátis
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link href="/loja/checkout">
                  <Button variant="primary" size="lg" className="w-full mb-3">
                    Finalizar Compra
                  </Button>
                </Link>

                <Link href="/loja">
                  <Button variant="outline" size="lg" className="w-full">
                    Continuar Comprando
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Troca grátis em 7 dias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Parcelamento sem juros</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LojaLayout>
  )
}
