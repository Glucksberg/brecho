'use client'

import { AdminLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, Badge } from '@/components/ui'
import { Plus, Search, Filter } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ProdutosPage() {
  // TODO: Fetch real data from API
  const produtos = [
    {
      id: '1',
      nome: 'Vestido Floral Vintage',
      categoria: 'VESTIDO',
      preco: 189.90,
      status: 'ATIVO',
      tipo: 'CONSIGNADO',
      fornecedora: 'Maria Silva',
      codigoBarras: '7891234567890'
    },
    {
      id: '2',
      nome: 'Calça Jeans Anos 90',
      categoria: 'CALCA',
      preco: 129.90,
      status: 'ATIVO',
      tipo: 'PROPRIO',
      fornecedora: null,
      codigoBarras: '7891234567891'
    },
    {
      id: '3',
      nome: 'Jaqueta de Couro Marrom',
      categoria: 'JAQUETA',
      preco: 349.90,
      status: 'VENDIDO',
      tipo: 'CONSIGNADO',
      fornecedora: 'Ana Costa',
      codigoBarras: '7891234567892'
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'success'
      case 'VENDIDO':
        return 'info'
      case 'RESERVADO':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getTipoColor = (tipo: string) => {
    return tipo === 'CONSIGNADO' ? 'primary' : 'default'
  }

  return (
    <AdminLayout title="Produtos">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar por nome, código de barras..."
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <Button variant="outline" icon={<Filter className="w-5 h-5" />}>
            Filtros
          </Button>
        </div>
        <Button variant="primary" icon={<Plus className="w-5 h-5" />}>
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Select
          label="Categoria"
          options={[
            { value: 'VESTIDO', label: 'Vestidos' },
            { value: 'CALCA', label: 'Calças' },
            { value: 'CAMISA', label: 'Camisas' },
            { value: 'JAQUETA', label: 'Jaquetas' },
          ]}
        />
        <Select
          label="Tipo"
          options={[
            { value: 'PROPRIO', label: 'Próprio' },
            { value: 'CONSIGNADO', label: 'Consignado' },
          ]}
        />
        <Select
          label="Status"
          options={[
            { value: 'ATIVO', label: 'Ativo' },
            { value: 'VENDIDO', label: 'Vendido' },
            { value: 'RESERVADO', label: 'Reservado' },
          ]}
        />
        <Select
          label="Condição"
          options={[
            { value: 'NOVO', label: 'Novo' },
            { value: 'SEMINOVO', label: 'Seminovo' },
            { value: 'USADO', label: 'Usado' },
          ]}
        />
      </div>

      {/* Products Table */}
      <Card variant="bordered">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Produtos</CardTitle>
            <p className="text-sm text-gray-500">{produtos.length} produtos encontrados</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produtos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{produto.nome}</p>
                        <p className="text-sm text-gray-500">{produto.codigoBarras}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{produto.categoria}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">{formatCurrency(produto.preco)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getTipoColor(produto.tipo) as any}>
                        {produto.tipo}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{produto.fornecedora || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(produto.status) as any}>
                        {produto.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="ghost" size="sm">Editar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
