'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, Modal, ModalFooter } from '@/components/ui'
import { Plus, Search, Filter, Calendar, DollarSign, TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function DespesasPage() {
  const [showModal, setShowModal] = useState(false)
  const [filtro, setFiltro] = useState('')
  const [mes, setMes] = useState('2024-01')

  // Mock data
  const despesas = [
    {
      id: '1',
      tipo: 'FIXA',
      categoria: 'ALUGUEL',
      descricao: 'Aluguel da loja',
      valor: 2500.00,
      dataVencimento: '2024-01-10',
      dataPagamento: '2024-01-08',
      status: 'PAGO'
    },
    {
      id: '2',
      tipo: 'FIXA',
      categoria: 'SALARIOS',
      descricao: 'Salário Funcionários',
      valor: 4500.00,
      dataVencimento: '2024-01-05',
      dataPagamento: '2024-01-05',
      status: 'PAGO'
    },
    {
      id: '3',
      tipo: 'VARIAVEL',
      categoria: 'MARKETING',
      descricao: 'Anúncios Instagram',
      valor: 350.00,
      dataVencimento: '2024-01-15',
      dataPagamento: null,
      status: 'PENDENTE'
    },
    {
      id: '4',
      tipo: 'FIXA',
      categoria: 'INTERNET',
      descricao: 'Internet Fibra 200MB',
      valor: 120.00,
      dataVencimento: '2024-01-20',
      dataPagamento: null,
      status: 'PENDENTE'
    },
    {
      id: '5',
      tipo: 'VARIAVEL',
      categoria: 'MANUTENCAO',
      descricao: 'Reparo Ar Condicionado',
      valor: 280.00,
      dataVencimento: '2024-01-12',
      dataPagamento: null,
      status: 'ATRASADO'
    }
  ]

  const totalPago = despesas
    .filter(d => d.status === 'PAGO')
    .reduce((sum, d) => sum + d.valor, 0)

  const totalPendente = despesas
    .filter(d => d.status === 'PENDENTE' || d.status === 'ATRASADO')
    .reduce((sum, d) => sum + d.valor, 0)

  const totalMes = despesas.reduce((sum, d) => sum + d.valor, 0)

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: 'success' | 'warning' | 'danger' }> = {
      PAGO: { label: 'Pago', color: 'success' },
      PENDENTE: { label: 'Pendente', color: 'warning' },
      ATRASADO: { label: 'Atrasado', color: 'danger' }
    }
    return badges[status] || badges.PENDENTE
  }

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      ALUGUEL: 'Aluguel',
      SALARIOS: 'Salários',
      MARKETING: 'Marketing',
      INTERNET: 'Internet',
      MANUTENCAO: 'Manutenção',
      AGUA: 'Água',
      LUZ: 'Luz',
      TELEFONE: 'Telefone',
      CONTADOR: 'Contador',
      MATERIAL: 'Material de Escritório',
      OUTROS: 'Outros'
    }
    return labels[categoria] || categoria
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Despesas</h1>
            <p className="text-gray-600 mt-1">Gerencie todas as despesas do brechó</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setShowModal(true)}
          >
            Nova Despesa
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="bordered">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total do Mês</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalMes)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pago</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalPago)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pendente</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(totalPendente)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="bordered">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar despesas..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  leftIcon={<Search className="w-5 h-5" />}
                />
              </div>
              <Input
                type="month"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                leftIcon={<Calendar className="w-5 h-5" />}
                className="md:w-48"
              />
              <Button variant="outline" icon={<Filter className="w-5 h-5" />}>
                Filtrar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Lista de Despesas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
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
                  {despesas.map((despesa) => {
                    const status = getStatusBadge(despesa.status)
                    return (
                      <tr key={despesa.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{despesa.descricao}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {getCategoriaLabel(despesa.categoria)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {despesa.tipo === 'FIXA' ? 'Fixa' : 'Variável'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(despesa.dataVencimento).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(despesa.valor)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={status.color}>{status.label}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {despesa.status === 'PENDENTE' && (
                              <Button variant="success" size="sm">
                                Marcar Pago
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" icon={<Edit2 className="w-4 h-4" />} />
                            <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-red-500" />} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal Nova Despesa */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Nova Despesa"
          size="lg"
        >
          <div className="space-y-4">
            <Input label="Descrição" placeholder="Ex: Aluguel da loja" required />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Selecione...</option>
                  <option value="ALUGUEL">Aluguel</option>
                  <option value="SALARIOS">Salários</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="INTERNET">Internet</option>
                  <option value="LUZ">Luz</option>
                  <option value="AGUA">Água</option>
                  <option value="TELEFONE">Telefone</option>
                  <option value="MANUTENCAO">Manutenção</option>
                  <option value="CONTADOR">Contador</option>
                  <option value="MATERIAL">Material de Escritório</option>
                  <option value="OUTROS">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="FIXA">Fixa</option>
                  <option value="VARIAVEL">Variável</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Valor"
                type="number"
                step="0.01"
                placeholder="0,00"
                leftIcon={<DollarSign className="w-5 h-5" />}
                required
              />

              <Input
                label="Data de Vencimento"
                type="date"
                leftIcon={<Calendar className="w-5 h-5" />}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="recorrente" className="rounded" />
              <label htmlFor="recorrente" className="text-sm text-gray-700">
                Despesa recorrente (repetir mensalmente)
              </label>
            </div>
          </div>

          <ModalFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => {
              setShowModal(false)
              alert('Despesa cadastrada!')
            }}>
              Cadastrar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </AdminLayout>
  )
}
