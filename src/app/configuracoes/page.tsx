'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select } from '@/components/ui'
import { Save, Settings, Store, User, Bell, Lock, CreditCard } from 'lucide-react'

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('geral')

  // Mock data
  const [configGeral, setConfigGeral] = useState({
    nomeBrecho: 'Retrô Carólis',
    email: 'contato@retrocarolis.com',
    telefone: '(11) 98765-4321',
    cnpj: '12.345.678/0001-90',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567'
  })

  const [configVendas, setConfigVendas] = useState({
    percentualRepassePadrao: 60,
    diasLiberacaoCredito: 30,
    bonusCreditoEmProdutos: 15,
    prazoTrocaPresencial: 7,
    prazoTrocaOnline: 7,
    permitirVendasSemEstoque: false
  })

  const tabs = [
    { id: 'geral', label: 'Geral', icon: Settings },
    { id: 'loja', label: 'Loja Online', icon: Store },
    { id: 'vendas', label: 'Vendas', icon: CreditCard },
    { id: 'usuarios', label: 'Usuários', icon: User },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Lock },
  ]

  return (
    <AdminLayout title="Configurações">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card variant="bordered">
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Geral */}
          {activeTab === 'geral' && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nome do Brechó"
                      value={configGeral.nomeBrecho}
                      onChange={(e) => setConfigGeral({ ...configGeral, nomeBrecho: e.target.value })}
                      required
                    />
                    <Input
                      label="CNPJ"
                      value={configGeral.cnpj}
                      onChange={(e) => setConfigGeral({ ...configGeral, cnpj: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="E-mail"
                      type="email"
                      value={configGeral.email}
                      onChange={(e) => setConfigGeral({ ...configGeral, email: e.target.value })}
                      required
                    />
                    <Input
                      label="Telefone"
                      value={configGeral.telefone}
                      onChange={(e) => setConfigGeral({ ...configGeral, telefone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Endereço</h3>
                    <div className="space-y-4">
                      <Input
                        label="Endereço"
                        value={configGeral.endereco}
                        onChange={(e) => setConfigGeral({ ...configGeral, endereco: e.target.value })}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Cidade"
                          value={configGeral.cidade}
                          onChange={(e) => setConfigGeral({ ...configGeral, cidade: e.target.value })}
                        />
                        <Select
                          label="Estado"
                          value={configGeral.estado}
                          onChange={(e) => setConfigGeral({ ...configGeral, estado: e.target.value })}
                          options={[
                            { value: 'SP', label: 'São Paulo' },
                            { value: 'RJ', label: 'Rio de Janeiro' },
                            { value: 'MG', label: 'Minas Gerais' },
                          ]}
                        />
                        <Input
                          label="CEP"
                          value={configGeral.cep}
                          onChange={(e) => setConfigGeral({ ...configGeral, cep: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" icon={<Save className="w-5 h-5" />}>
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Vendas */}
          {activeTab === 'vendas' && (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Configurações de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Consignação</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Percentual de Repasse Padrão (%)"
                        type="number"
                        value={configVendas.percentualRepassePadrao}
                        onChange={(e) => setConfigVendas({ ...configVendas, percentualRepassePadrao: Number(e.target.value) })}
                        helperText="Padrão aplicado ao cadastrar novas fornecedoras"
                      />
                      <Input
                        label="Dias para Liberação de Crédito"
                        type="number"
                        value={configVendas.diasLiberacaoCredito}
                        onChange={(e) => setConfigVendas({ ...configVendas, diasLiberacaoCredito: Number(e.target.value) })}
                        helperText="Dias após a venda para liberar o crédito"
                      />
                    </div>

                    <Input
                      label="Bônus em Crédito para Produtos (%)"
                      type="number"
                      value={configVendas.bonusCreditoEmProdutos}
                      onChange={(e) => setConfigVendas({ ...configVendas, bonusCreditoEmProdutos: Number(e.target.value) })}
                      helperText="Percentual de bônus quando fornecedora usa crédito para comprar produtos"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <h3 className="font-semibold text-gray-900">Trocas e Devoluções</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Prazo Troca Presencial (dias)"
                        type="number"
                        value={configVendas.prazoTrocaPresencial}
                        onChange={(e) => setConfigVendas({ ...configVendas, prazoTrocaPresencial: Number(e.target.value) })}
                      />
                      <Input
                        label="Prazo Troca Online (dias)"
                        type="number"
                        value={configVendas.prazoTrocaOnline}
                        onChange={(e) => setConfigVendas({ ...configVendas, prazoTrocaOnline: Number(e.target.value) })}
                        helperText="Mínimo 7 dias conforme CDC"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configVendas.permitirVendasSemEstoque}
                        onChange={(e) => setConfigVendas({ ...configVendas, permitirVendasSemEstoque: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Permitir vendas sem estoque</p>
                        <p className="text-sm text-gray-600">
                          Permite criar vendas mesmo quando o produto não está em estoque
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" icon={<Save className="w-5 h-5" />}>
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Loja Online */}
          {activeTab === 'loja' && (
            <Card variant="bordered">
              <CardContent className="p-12 text-center">
                <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Configurações da Loja Online
                </h3>
                <p className="text-gray-600">
                  Configure banner, cores, frete e formas de pagamento
                </p>
              </CardContent>
            </Card>
          )}

          {/* Outros tabs */}
          {['usuarios', 'notificacoes', 'seguranca'].includes(activeTab) && (
            <Card variant="bordered">
              <CardContent className="p-12 text-center">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Em Desenvolvimento
                </h3>
                <p className="text-gray-600">
                  Esta seção estará disponível em breve
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
