'use client'

import Link from 'next/link'
import { ShoppingCart, User, Search, Heart } from 'lucide-react'
import { Input } from '@/components/ui'
import { useCart } from '@/contexts/CartContext'
import { useFavorites } from '@/contexts/FavoritesContext'

interface LojaLayoutProps {
  children: React.ReactNode
}

export function LojaLayout({ children }: LojaLayoutProps) {
  const { cartCount } = useCart()
  const { favoritesCount } = useFavorites()
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        {/* Top Bar */}
        <div className="bg-gray-900 text-white py-2 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
            <p>Frete grátis para compras acima de R$ 200</p>
            <div className="flex gap-4">
              <Link href="/loja/rastrear" className="hover:underline">Rastrear Pedido</Link>
              <Link href="/loja/sobre" className="hover:underline">Sobre Nós</Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/loja" className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">
                RC
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Retrô Carólis</h1>
                <p className="text-xs text-gray-500">Moda Sustentável</p>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <Input
                type="search"
                placeholder="Buscar roupas, acessórios, calçados..."
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Link href="/loja/favoritos" className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Heart className="w-6 h-6 text-gray-600" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              <Link href="/loja/carrinho" className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/loja/conta" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-6 h-6 text-gray-600" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex gap-6 border-t border-gray-200 pt-4">
            <Link href="/loja/categoria/feminino" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Feminino
            </Link>
            <Link href="/loja/categoria/masculino" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Masculino
            </Link>
            <Link href="/loja/categoria/infantil" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Infantil
            </Link>
            <Link href="/loja/categoria/acessorios" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Acessórios
            </Link>
            <Link href="/loja/categoria/calcados" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Calçados
            </Link>
            <Link href="/loja/novidades" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Novidades
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-lg mb-4">Retrô Carólis</h3>
              <p className="text-gray-400 text-sm">
                Moda sustentável e acessível. Renove seu guarda-roupa de forma consciente.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/loja/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
                <li><Link href="/loja/como-funciona" className="hover:text-white transition-colors">Como Funciona</Link></li>
                <li><Link href="/loja/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/loja/contato" className="hover:text-white transition-colors">Contato</Link></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-semibold mb-4">Ajuda</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/loja/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/loja/envio" className="hover:text-white transition-colors">Envio e Entrega</Link></li>
                <li><Link href="/loja/trocas" className="hover:text-white transition-colors">Trocas e Devoluções</Link></li>
                <li><Link href="/loja/pagamento" className="hover:text-white transition-colors">Formas de Pagamento</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">
                Receba novidades e ofertas exclusivas
              </p>
              <div className="flex gap-2">
                <Input type="email" placeholder="Seu e-mail" className="flex-1" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Retrô Carólis. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
