'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select } from '@/components/ui'
import { Download, Calendar, FileText, TrendingUp, Package, DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function RelatoriosPage() {
  const [tipoRelatorio, setTipoRelatorio] = useState('vendas')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  // Mock data
  const relatorioVendas = {
    periodo: {
      inicio: new Date('2024-11-01'),
      fim: new Date('2024-11-06')
    },
    totalVendas: 45800.00,
    quantidadeVendas: 234,
    ticketMedio: 195.73,
    vendasPorDia: [
      { data: new Date('2024-11-01'), total: 7500, quantidade: 38 },
      { data: new Date('2024-11-02'), total: 6800, quantidade: 35 },
      { data: new Date('2024-11-03'), total: 8200, quantidade: 42 },
      { data: new Date('2024-11-04'), total: 7900, quantidade: 40 },
      { data: new Date('2024-11-05'), total: 9200, quantidade: 47 },
      { data: new Date('2024-11-06'), total: 6200, quantidade: 32 },
    ],
    vendasPorFormaPagamento: [
      { tipo: 'DINHEIRO', total: 18320, quantidade: 92, percentual: 40 },
      { tipo: 'CARTAO_CREDITO', total: 15960, quantidade: 68, percentual: 35 },
      { tipo: 'PIX', total: 9160, quantidade: 52, percentual: 20 },
      { tipo: 'CARTAO_DEBITO', total: 2360, quantidade: 22, percentual: 5 },
    ],
    vendasPorVendedor: [
      { vendedorNome: 'João Santos', total: 25400, quantidade: 130, comissao: 2540 },
      { vendedorNome: 'Maria Silva', total: 20400, quantidade: 104, comissao: 2040 },
    ],
    produtosMaisVendidos: [
      { produtoNome: 'Vestido Floral Vintage', quantidade: 12, total: 2278.80 },
      { produtoNome: 'Calça Jeans Skinny', quantidade: 15, total: 1798.50 },
      { produtoNome: 'Jaqueta Jeans Anos 90', quantidade: 10, total: 1599.00 },
      { produtoNome: 'Bolsa de Couro', quantidade: 8, total: 1039.20 },
      { produtoNome: 'Camisa Estampada', quantidade: 18, total: 1618.20 },
    ]
  }

  const handleGerarRelatorio = () => {
    // TODO: Call API to generate report
    console.log('Gerar relatório:', { tipoRelatorio, dataInicio, dataFim })
  }

  const handleExportar = (formato: 'pdf' | 'excel') => {
    // TODO: Export report
    console.log('Exportar como:', formato)
  }

  return (
    <AdminLayout title="Relatórios">
      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setTipoRelatorio('vendas')}
          className={`p-6 border-2 rounded-lg transition-all text-left ${
            tipoRelatorio === 'vendas'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg">Relatório de Vendas</h3>
          </div>
          <p className="text-sm text-gray-600">
            Análise completa de vendas, formas de pagamento, vendedores e produtos
          </p>
        </button>

        <button
          onClick={() => setTipoRelatorio('consignacao')}
          className={`p-6 border-2 rounded-lg transition-all text-left ${
            tipoRelatorio === 'consignacao'
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg">Relatório de Consignação</h3>
          </div>
          <p className="text-sm text-gray-600">
            Produtos em consignação, vendas por fornecedora e créditos
          </p>
        </button>

        <button
          onClick={() => setTipoRelatorio('financeiro')}
          className={`p-6 border-2 rounded-lg transition-all text-left ${
            tipoRelatorio === 'financeiro'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg">Relatório Financeiro</h3>
          </div>
          <p className="text-sm text-gray-600">
            Fluxo de caixa, receitas, despesas e saldo
          </p>
        </button>
      </div>

      {/* Filters */}
      <Card variant="bordered" className="mb-8">
        <CardHeader>
          <CardTitle>Filtros do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="date"
              label="Data Início"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              leftIcon={<Calendar className="w-5 h-5" />}
            />
            <Input
              type="date"
              label="Data Fim"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              leftIcon={<Calendar className="w-5 h-5" />}
            />
            <div className="flex items-end gap-2">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleGerarRelatorio}
                icon={<FileText className="w-5 h-5" />}
              >
                Gerar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content - Vendas */}
      {tipoRelatorio === 'vendas' && (
        <>
          {/* Export Buttons */}
          <div className="flex gap-2 mb-6">
            <Button
              variant="outline"
              icon={<Download className="w-5 h-5" />}
              onClick={() => handleExportar('pdf')}
            >
              Exportar PDF
            </Button>
            <Button
              variant="outline"
              icon={<Download className="w-5 h-5" />}
              onClick={() => handleExportar('excel')}
            >
              Exportar Excel
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card variant="bordered">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Total de Vendas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {formatCurrency(relatorioVendas.totalVendas)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {relatorioVendas.quantidadeVendas} vendas
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Ticket Médio</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {formatCurrency(relatorioVendas.ticketMedio)}
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Média Diária</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {formatCurrency(relatorioVendas.totalVendas / relatorioVendas.vendasPorDia.length)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Vendas por Dia */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Vendas por Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatorioVendas.vendasPorDia.map((dia, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{formatDate(dia.data)}</p>
                        <p className="text-sm text-gray-600">{dia.quantidade} vendas</p>
                      </div>
                      <p className="font-bold text-gray-900">{formatCurrency(dia.total)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vendas por Forma de Pagamento */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Formas de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatorioVendas.vendasPorFormaPagamento.map((forma, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{forma.tipo}</span>
                        <span className="font-bold text-gray-900">{formatCurrency(forma.total)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${forma.percentual}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{forma.percentual}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vendas por Vendedor */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Desempenho por Vendedor</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Vendedor
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Vendas
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {relatorioVendas.vendasPorVendedor.map((vendedor, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {vendedor.vendedorNome}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-600">
                          {vendedor.quantidade}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                          {formatCurrency(vendedor.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Produtos Mais Vendidos */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Produto
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Qtd
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {relatorioVendas.produtosMaisVendidos.map((produto, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {produto.produtoNome}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-600">
                          {produto.quantidade}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                          {formatCurrency(produto.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Report Content - Consignação */}
      {tipoRelatorio === 'consignacao' && (
        <Card variant="bordered">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Relatório de Consignação
            </h3>
            <p className="text-gray-600">
              Selecione um período e clique em "Gerar Relatório"
            </p>
          </CardContent>
        </Card>
      )}

      {/* Report Content - Financeiro */}
      {tipoRelatorio === 'financeiro' && (
        <Card variant="bordered">
          <CardContent className="p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Relatório Financeiro
            </h3>
            <p className="text-gray-600">
              Selecione um período e clique em "Gerar Relatório"
            </p>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  )
}
