'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react'

interface SidebarItem {
  label: string
  href: string
  icon: React.ElementType
  permission?: string
}

const adminMenuItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Produtos', href: '/admin/produtos', icon: Package },
  { label: 'Vendas', href: '/vendas', icon: ShoppingCart },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Fornecedoras', href: '/fornecedoras', icon: UserCheck },
  { label: 'Caixa', href: '/caixa', icon: CreditCard },
  { label: 'Trocas', href: '/trocas', icon: TrendingUp },
  { label: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
]

interface SidebarProps {
  variant?: 'admin' | 'loja' | 'portal'
}

export function Sidebar({ variant = 'admin' }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = variant === 'admin' ? adminMenuItems : []

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-xl">
            RC
          </div>
          <div>
            <h1 className="font-bold text-lg">Retrô Carólis</h1>
            <p className="text-xs text-gray-400">Sistema de Gestão</p>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="font-medium">AC</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Admin</p>
            <p className="text-xs text-gray-400">admin@retrocarolis.com</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  )
}
