'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Package, DollarSign, FileText, LogOut } from 'lucide-react'

const menuItems = [
  { label: 'Dashboard', href: '/portal-fornecedora', icon: LayoutDashboard },
  { label: 'Meus Produtos', href: '/portal-fornecedora/produtos', icon: Package },
  { label: 'Créditos', href: '/portal-fornecedora/creditos', icon: DollarSign },
  { label: 'Relatórios', href: '/portal-fornecedora/relatorios', icon: FileText },
]

interface PortalFornecedoraLayoutProps {
  children: React.ReactNode
}

export function PortalFornecedoraLayout({ children }: PortalFornecedoraLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-900 text-white min-h-screen flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-purple-800">
          <Link href="/portal-fornecedora" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center font-bold text-xl">
              RC
            </div>
            <div>
              <h1 className="font-bold text-lg">Portal da Fornecedora</h1>
              <p className="text-xs text-purple-300">Retrô Carólis</p>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-purple-700 text-white'
                    : 'text-purple-200 hover:bg-purple-800 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-purple-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center">
              <span className="font-medium">MF</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Maria Fornecedora</p>
              <p className="text-xs text-purple-300">Crédito: R$ 1.250,00</p>
            </div>
          </div>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-purple-200 hover:bg-purple-800 hover:text-white transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Portal da Fornecedora</h2>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Crédito Disponível</p>
                <p className="text-xl font-bold text-green-600">R$ 1.250,00</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500 text-center">
            © 2024 Retrô Carólis. Portal da Fornecedora.
          </p>
        </footer>
      </div>
    </div>
  )
}
