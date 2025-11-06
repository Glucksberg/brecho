'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar variant="admin" />
      </div>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar variant="admin" />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500 text-center">
            © 2024 Retrô Carólis. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </div>
  )
}
