'use client'

import { useEffect, useState } from 'react'
import { LojaLayout } from '@/components/layout'
import { Card, CardContent, Button, Badge, Input } from '@/components/ui'
import { Search, Filter, Heart, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import Link from 'next/link'

// Map category slug to genero/categoria filter
const categoryMap: Record<string, { genero?: string; categoria?: string }> = {
  feminino: { genero: 'FEMININO' },
  masculino: { genero: 'MASCULINO' },
  infantil: { genero: 'INFANTIL' },
  acessorios: { categoria: 'Acessórios' },
  calcados: { categoria: 'Calçados' },
}

export default function CategoriaPage({ params }: { params: { categoria: string } }) {
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()

  const categoriaSlug = params.categoria.toLowerCase()
  const categoriaNome = categoriaSlug.charAt(0).toUpperCase() + categoriaSlug.slice(1)
  const filter = categoryMap[categoriaSlug] || {}

  useEffect(() => {
    async function fetchProdutos() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (filter.genero) {
          // Note: API might need to filter by genero, but current API filters by categoria
          // For now, we'll fetch all and filter client-side if needed
        }
        if (filter.categoria) {
          params.append('categoria', filter.categoria)
        }
        params.append('status', 'ativo')

        const response = await fetch(`/api/produtos?${params.toString()}`)
        const data = await response.json()

        if (data.success) {
          let filtered = data.data.data || []
          
          // Filter by genero if needed (client-side for now)
          if (filter.genero) {
            // This would need to be done server-side ideally
            // For now, we'll show all products
          }
          
          setProdutos(filtered)
        }
      } catch (error) {
        console.error('Error fetching produtos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProdutos()
  }, [categoriaSlug])

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Categoria: {categoriaNome}
          </h1>
          <p className="text-gray-600">
            {produtos.length} {produtos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="w-64"
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <Button variant="outline" icon={<Filter className="w-5 h-5" />}>
            Filtros
          </Button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando produtos...</p>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Nenhum produto encontrado nesta categoria.</p>
            <Link href="/loja">
              <Button variant="primary">Voltar para a Loja</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.map((produto) => {
              const condicao = getCondicaoBadge(produto.condicao)

              return (
                <Card key={produto.id} variant="bordered" className="group hover:shadow-xl transition-all">
                  <CardContent className="p-0">
                    <Link href={`/loja/produto/${produto.id}`}>
                      <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden cursor-pointer">
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-20 h-20" />
                        </div>

                        <div className="absolute top-3 left-3">
                          <Badge variant={condicao.color}>
                            {condicao.label}
                          </Badge>
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleFavorite({
                              id: produto.id,
                              nome: produto.nome,
                              preco: produto.preco,
                              imagemPrincipal: produto.imagemPrincipal,
                              tamanho: produto.tamanho,
                              cor: produto.cor,
                              marca: produto.marca,
                              categoria: produto.categoria,
                              descricao: produto.descricao,
                            })
                          }}
                          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                        >
                          <Heart
                            className={`w-5 h-5 ${isFavorite(produto.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
                          />
                        </button>
                      </div>
                    </Link>

                    <div className="p-4">
                      <p className="text-xs text-gray-500 uppercase mb-1">
                        {produto.categoria}
                      </p>
                      <Link href={`/loja/produto/${produto.id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                          {produto.nome}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(produto.preco)}
                        </p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => addToCart({
                            id: produto.id,
                            nome: produto.nome,
                            preco: produto.preco,
                            imagemPrincipal: produto.imagemPrincipal,
                            tamanho: produto.tamanho,
                            cor: produto.cor,
                            marca: produto.marca,
                            categoria: produto.categoria,
                          })}
                        >
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </LojaLayout>
  )
}

