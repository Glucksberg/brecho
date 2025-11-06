'use client'

import { LojaLayout } from '@/components/layout'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function FavoritosPage() {
  const router = useRouter()
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites()
  const { addToCart } = useCart()

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      nome: product.nome,
      preco: product.preco,
      imagemPrincipal: product.imagemPrincipal,
      tamanho: product.tamanho,
      cor: product.cor,
      marca: product.marca,
      categoria: product.categoria
    })
    const goToCart = window.confirm('Produto adicionado ao carrinho! Deseja ir para o carrinho?')
    if (goToCart) {
      router.push('/loja/carrinho')
    }
  }

  if (favorites.length === 0) {
    return (
      <LojaLayout>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Card variant="bordered">
            <CardContent className="p-12 text-center">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Você ainda não tem favoritos
              </h2>
              <p className="text-gray-600 mb-6">
                Adicione produtos aos favoritos para acompanhá-los mais tarde
              </p>
              <Link href="/loja">
                <Button variant="primary" size="lg">
                  Explorar Produtos
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Meus Favoritos ({favorites.length})
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              if (window.confirm('Deseja remover todos os favoritos?')) {
                clearFavorites()
              }
            }}
          >
            Limpar Favoritos
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <Card key={product.id} variant="bordered" className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  {product.imagemPrincipal ? (
                    <img
                      src={product.imagemPrincipal}
                      alt={product.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                      📷
                    </div>
                  )}

                  {/* Remove from favorites button */}
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  {product.categoria && (
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      {product.categoria}
                    </p>
                  )}

                  <Link href={`/loja/produto/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {product.nome}
                    </h3>
                  </Link>

                  <div className="text-sm text-gray-600 mb-3 space-y-1">
                    {product.tamanho && <p>Tamanho: {product.tamanho}</p>}
                    {product.cor && <p>Cor: {product.cor}</p>}
                    {product.marca && <p>Marca: {product.marca}</p>}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(product.preco)}
                    </p>
                  </div>

                  {/* Add to cart button */}
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon={<ShoppingCart className="w-4 h-4" />}
                    onClick={() => handleAddToCart(product)}
                  >
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue shopping */}
        <div className="mt-8 text-center">
          <Link href="/loja">
            <Button variant="outline" size="lg">
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>
    </LojaLayout>
  )
}
