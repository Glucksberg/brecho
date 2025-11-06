'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui'
import { CreditCard, DollarSign, TrendingUp, TrendingDown, Lock, Unlock, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default function CaixaPage() {
  const [modalAbrir, setModalAbrir] = useState(false)
  const [modalFechar, setModalFechar] = useState(false)

  // TODO: Fetch from API
  const caixaAberto = {
    id: '1',
    saldoInicial: 200.00,
    saldoAtual: 3450.00,
    dataAbertura: new Date('2024-11-06T08:00:00'),
    usuarioAbertura: { nome: 'João Santos' },
    vendasDinheiro: 2850.00,
    vendasCartaoCredito: 1250.00,
    vendasCartaoDebito: 650.00,
    vendasPix: 450.00,
    totalDespesas: 150.00,
    totalSangrias: 500.00,
    totalReforcos: 100.00,
    quantidadeVendas: 12
  }

  const caixasRecentes = [
    {
      id: '2',
      dataAbertura: new Date('2024-11-05T08:00:00'),
      dataFechamento: new Date('2024-11-05T18:30:00'),
      usuarioAbertura: { nome: 'João Santos' },
      usuarioFechamento: { nome: 'Maria Silva' },
      saldoInicial: 200.00,
      saldoFinal: 2890.00,
      saldoEsperado: 2850.00,
      diferenca: 40.00,
      status: 'FECHADO'
    },
    {
      id: '3',
      dataAbertura: new Date('2024-11-04T08:00:00'),
      dataFechamento: new Date('2024-11-04T18:00:00'),
      usuarioAbertura: { nome: 'Maria Silva' },
      usuarioFechamento: { nome: 'João Santos' },
      saldoInicial: 200.00,
      saldoFinal: 3120.00,
      saldoEsperado: 3150.00,
      diferenca: -30.00,
      status: 'FECHADO'
    },
  ]

  const saldoEsperado =
    caixaAberto.saldoInicial +
    caixaAberto.vendasDinheiro -
    caixaAberto.totalDespesas -
    caixaAberto.totalSangrias +
    caixaAberto.totalReforcos

  return (
    <AdminLayout title="Caixa">
      {/* Caixa Aberto Alert */}
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
              <Unlock className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-900">Caixa Aberto</h3>
              <p className="text-sm text-green-700 mt-1">
                Aberto por <span className="font-semibold">{caixaAberto.usuarioAbertura.nome}</span> às {formatDateTime(caixaAberto.dataAbertura)}
              </p>
              <p className="text-sm text-green-700">
                {caixaAberto.quantidadeVendas} vendas realizadas
              </p>
            </div>
          </div>
          <Button variant="danger" size="lg" icon={<Lock className="w-5 h-5" />}>
            Fechar Caixa
          </Button>
        </div>
      </div>

      {/* Saldo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="bordered">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Saldo Inicial</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {formatCurrency(caixaAberto.saldoInicial)}
            </p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Saldo Atual</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {formatCurrency(caixaAberto.saldoAtual)}
            </p>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">Saldo Esperado</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {formatCurrency(saldoEsperado)}
            </p>
            {saldoEsperado !== caixaAberto.saldoAtual && (
              <p className="text-sm text-gray-500 mt-1">
                Diferença: {formatCurrency(Math.abs(caixaAberto.saldoAtual - saldoEsperado))}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Movimentações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Entradas */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Entradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Dinheiro</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(caixaAberto.vendasDinheiro)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Cartão de Crédito</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(caixaAberto.vendasCartaoCredito)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Cartão de Débito</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(caixaAberto.vendasCartaoDebito)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">PIX</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(caixaAberto.vendasPix)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Reforços</span>
                <span className="font-bold text-blue-600">
                  {formatCurrency(caixaAberto.totalReforcos)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saídas */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Saídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Despesas</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(caixaAberto.totalDespesas)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Sangrias</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(caixaAberto.totalSangrias)}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Nova Sangria
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Nova Despesa
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Caixas Recentes */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Caixas Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data Abertura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data Fechamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Saldo Inicial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Saldo Final
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Diferença
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {caixasRecentes.map((caixa) => (
                  <tr key={caixa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDateTime(caixa.dataAbertura)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDateTime(caixa.dataFechamento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {caixa.usuarioAbertura.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {formatCurrency(caixa.saldoInicial)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {formatCurrency(caixa.saldoFinal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-semibold ${caixa.diferenca >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {caixa.diferenca >= 0 && '+'}{formatCurrency(caixa.diferenca)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="default">
                        {caixa.status}
                      </Badge>
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
