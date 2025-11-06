'use client'

import { Bell, Search, Menu } from 'lucide-react'
import { Input } from '@/components/ui'

interface HeaderProps {
  title?: string
  onMenuClick?: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden md:block w-80">
            <Input
              type="search"
              placeholder="Buscar produtos, vendas, clientes..."
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  )
}
