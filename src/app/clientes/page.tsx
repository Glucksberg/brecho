'use client'

import { AdminLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui'
import { Plus, Search, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react'
import { formatCurrency, formatPhone, formatDate } from '@/lib/utils'

export default function ClientesPage() {
  // TODO: Fetch from API
  const clientes = [
    {
      id: '1',
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '(11) 98765-4321',
      cpf: '123.456.789-00',
      dataNascimento: new Date('1990-05-15'),
      totalCompras: 12,
      totalGasto: 2450.00,
      ultimaCompra: new Date('2024-11-05'),
      endereco: {
        cidade: 'São Paulo',
        estado: 'SP'
      }
    },
    {
      id: '2',
      nome: 'Ana Costa',
      email: 'ana@email.com',
      telefone: '(11) 97654-3210',
      cpf: '987.654.321-00',
      dataNascimento: new Date('1985-08-22'),
      totalCompras: 8,
      totalGasto: 1850.50,
      ultimaCompra: new Date('2024-11-01'),
      endereco: {
        cidade: 'São Paulo',
        estado: 'SP'
      }
    },
    {
      id: '3',
      nome: 'Pedro Lima',
      email: 'pedro@email.com',
      telefone: '(11) 96543-2109',
      cpf: '456.789.123-00',
      dataNascimento: new Date('1995-03-10'),
      totalCompras: 5,
      totalGasto: 980.00,
      ultimaCompra: new Date('2024-10-28'),
      endereco: {
        cidade: 'Guarulhos',
        estado: 'SP'
      }
    },
  ]

  const getClienteCategoria = (totalGasto: number) => {
    if (totalGasto >= 2000) return { label: 'VIP', color: 'danger' }
    if (totalGasto >= 1000) return { label: 'Premium', color: 'primary' }
    return { label: 'Regular', color: 'success' }
  }

  const totalClientes = clientes.length
  const totalGastoGeral = clientes.reduce((sum, c) => sum + c.totalGasto, 0)
  const ticketMedio = totalGastoGeral / totalClientes

  return (
    <AdminLayout title="Clientes">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar por nome, email, telefone, CPF..."
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
        <Button variant="primary" icon={<Plus className="w-5 h-5" />}>
          Novo Cliente
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Clientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalClientes}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gasto Total</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {formatCurrency(totalGastoGeral)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Médio</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {formatCurrency(ticketMedio)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clientes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map((cliente) => {
          const categoria = getClienteCategoria(cliente.totalGasto)

          return (
            <Card key={cliente.id} variant="bordered" className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                    <Badge variant={categoria.color as any} className="mt-2">
                      {categoria.label}
                    </Badge>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {cliente.nome.charAt(0)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{cliente.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{formatPhone(cliente.telefone)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{cliente.endereco.cidade}, {cliente.endereco.estado}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600">Total de Compras</p>
                    <p className="text-xl font-bold text-gray-900">{cliente.totalCompras}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Gasto</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(cliente.totalGasto)}
                    </p>
                  </div>
                </div>

                {/* Last Purchase */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600">Última Compra</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(cliente.ultimaCompra)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Compras
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </AdminLayout>
  )
}
