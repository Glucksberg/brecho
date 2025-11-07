'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AdminLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select } from '@/components/ui'
import { Save, Settings, Store, User, Bell, Lock, CreditCard, Users, Plus, X, Check, Mail, Phone, Percent, DollarSign } from 'lucide-react'

interface Vendedor {
  id: string
  name: string
  email: string
  telefone?: string
  comissao: number
  metaMensal: number
  createdAt: string
  clientesAssociados: Array<{
    id: string
    name: string
    email: string
  }>
}

export default function ConfiguracoesPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('geral')

  // Vendedores state
  const [vendedores, setVendedores] = useState<Vendedor[]>([])
  const [loadingVendedores, setLoadingVendedores] = useState(false)
  const [showAddVendedor, setShowAddVendedor] = useState(false)
  const [addingVendedor, setAddingVendedor] = useState(false)
  const [associatingCliente, setAssociatingCliente] = useState(false)
  const [vendedorForm, setVendedorForm] = useState({
    name: '',
    email: '',
    password: '',
    telefone: '',
    comissao: 5,
    metaMensal: 0
  })
  const [associacaoForm, setAssociacaoForm] = useState({
    vendedorId: '',
    clienteEmail: ''
  })
  const [vendedorError, setVendedorError] = useState('')
  const [vendedorSuccess, setVendedorSuccess] = useState('')

  // Fetch vendedores when vendedores tab is active
  useEffect(() => {
    if (activeTab === 'vendedores' && session?.user?.role === 'DONO') {
      fetchVendedores()
    }
  }, [activeTab, session])

  const fetchVendedores = async () => {
    setLoadingVendedores(true)
    try {
      const response = await fetch('/api/admin/vendedores')
      const data = await response.json()
      if (response.ok) {
        setVendedores(data.vendedores)
      }
    } catch (error) {
      console.error('Error fetching vendedores:', error)
    } finally {
      setLoadingVendedores(false)
    }
  }

  const handleCreateVendedor = async (e: React.FormEvent) => {
    e.preventDefault()
    setVendedorError('')
    setVendedorSuccess('')
    setAddingVendedor(true)

    try {
      const response = await fetch('/api/admin/vendedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendedorForm)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar vendedor')
      }

      setVendedorSuccess('Vendedor criado com sucesso!')
      setVendedorForm({
        name: '',
        email: '',
        password: '',
        telefone: '',
        comissao: 5,
        metaMensal: 0
      })
      setShowAddVendedor(false)
      fetchVendedores()
    } catch (error: any) {
      setVendedorError(error.message)
    } finally {
      setAddingVendedor(false)
    }
  }

  const handleAssociarCliente = async (e: React.FormEvent) => {
    e.preventDefault()
    setVendedorError('')
    setVendedorSuccess('')
    setAssociatingCliente(true)

    try {
      const response = await fetch(`/api/admin/vendedores/${associacaoForm.vendedorId}/associar-cliente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteEmail: associacaoForm.clienteEmail })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao associar cliente')
      }

      setVendedorSuccess('Cliente associado com sucesso!')
      setAssociacaoForm({ vendedorId: '', clienteEmail: '' })
      fetchVendedores()
    } catch (error: any) {
      setVendedorError(error.message)
    } finally {
      setAssociatingCliente(false)
    }
  }

  const handleRemoverAssociacao = async (vendedorId: string, clienteId: string) => {
    if (!confirm('Deseja remover esta associação?')) return

    try {
      const response = await fetch(`/api/admin/vendedores/${vendedorId}/associar-cliente`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao remover associação')
      }

      setVendedorSuccess('Associação removida com sucesso!')
      fetchVendedores()
    } catch (error: any) {
      setVendedorError(error.message)
    }
  }

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
    ...(session?.user?.role === 'DONO' ? [{ id: 'vendedores', label: 'Vendedores', icon: Users }] : []),
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

          {/* Vendedores */}
          {activeTab === 'vendedores' && session?.user?.role === 'DONO' && (
            <div className="space-y-6">
              {/* Messages */}
              {vendedorError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {vendedorError}
                </div>
              )}
              {vendedorSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {vendedorSuccess}
                </div>
              )}

              {/* Adicionar Vendedor */}
              <Card variant="bordered">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Adicionar Vendedor</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={showAddVendedor ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      onClick={() => setShowAddVendedor(!showAddVendedor)}
                    >
                      {showAddVendedor ? 'Cancelar' : 'Novo Vendedor'}
                    </Button>
                  </div>
                </CardHeader>
                {showAddVendedor && (
                  <CardContent>
                    <form onSubmit={handleCreateVendedor} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Nome Completo"
                          value={vendedorForm.name}
                          onChange={(e) => setVendedorForm({ ...vendedorForm, name: e.target.value })}
                          leftIcon={<User className="w-5 h-5" />}
                          required
                        />
                        <Input
                          label="Email"
                          type="email"
                          value={vendedorForm.email}
                          onChange={(e) => setVendedorForm({ ...vendedorForm, email: e.target.value })}
                          leftIcon={<Mail className="w-5 h-5" />}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Senha"
                          type="password"
                          value={vendedorForm.password}
                          onChange={(e) => setVendedorForm({ ...vendedorForm, password: e.target.value })}
                          leftIcon={<Lock className="w-5 h-5" />}
                          helperText="Mínimo 8 caracteres"
                          required
                        />
                        <Input
                          label="Telefone"
                          value={vendedorForm.telefone}
                          onChange={(e) => setVendedorForm({ ...vendedorForm, telefone: e.target.value })}
                          leftIcon={<Phone className="w-5 h-5" />}
                          placeholder="(00) 00000-0000"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Comissão (%)"
                          type="number"
                          value={vendedorForm.comissao}
                          onChange={(e) => setVendedorForm({ ...vendedorForm, comissao: Number(e.target.value) })}
                          leftIcon={<Percent className="w-5 h-5" />}
                          min={0}
                          max={100}
                        />
                        <Input
                          label="Meta Mensal (R$)"
                          type="number"
                          value={vendedorForm.metaMensal}
                          onChange={(e) => setVendedorForm({ ...vendedorForm, metaMensal: Number(e.target.value) })}
                          leftIcon={<DollarSign className="w-5 h-5" />}
                          min={0}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={addingVendedor}
                          icon={<Check className="w-5 h-5" />}
                        >
                          {addingVendedor ? 'Criando...' : 'Criar Vendedor'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                )}
              </Card>

              {/* Lista de Vendedores */}
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle>Vendedores Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingVendedores ? (
                    <p className="text-center text-gray-600 py-8">Carregando...</p>
                  ) : vendedores.length === 0 ? (
                    <p className="text-center text-gray-600 py-8">Nenhum vendedor cadastrado</p>
                  ) : (
                    <div className="space-y-4">
                      {vendedores.map((vendedor) => (
                        <div key={vendedor.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{vendedor.name}</h4>
                              <p className="text-sm text-gray-600">{vendedor.email}</p>
                              {vendedor.telefone && (
                                <p className="text-sm text-gray-600">{vendedor.telefone}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                Comissão: <span className="font-medium">{vendedor.comissao}%</span>
                              </p>
                              <p className="text-sm text-gray-600">
                                Meta: <span className="font-medium">R$ {vendedor.metaMensal.toLocaleString('pt-BR')}</span>
                              </p>
                            </div>
                          </div>

                          {/* Clientes Associados */}
                          {vendedor.clientesAssociados.length > 0 && (
                            <div className="border-t border-gray-200 pt-3 mt-3">
                              <p className="text-xs font-medium text-gray-700 mb-2">
                                Clientes Associados ({vendedor.clientesAssociados.length}):
                              </p>
                              <div className="space-y-1">
                                {vendedor.clientesAssociados.map((cliente) => (
                                  <div key={cliente.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm">
                                    <div>
                                      <span className="font-medium text-gray-900">{cliente.name}</span>
                                      <span className="text-gray-600 ml-2">({cliente.email})</span>
                                    </div>
                                    <button
                                      onClick={() => handleRemoverAssociacao(vendedor.id, cliente.id)}
                                      className="text-red-600 hover:text-red-700"
                                      title="Remover associação"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Associar Cliente */}
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle>Associar Cliente a Vendedor</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAssociarCliente} className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Associe um cliente a um vendedor para que ele tenha privilégios especiais ao comprar
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Vendedor"
                        value={associacaoForm.vendedorId}
                        onChange={(e) => setAssociacaoForm({ ...associacaoForm, vendedorId: e.target.value })}
                        options={[
                          { value: '', label: 'Selecione um vendedor' },
                          ...vendedores.map((v) => ({ value: v.id, label: v.name }))
                        ]}
                        required
                      />
                      <Input
                        label="Email do Cliente"
                        type="email"
                        value={associacaoForm.clienteEmail}
                        onChange={(e) => setAssociacaoForm({ ...associacaoForm, clienteEmail: e.target.value })}
                        leftIcon={<Mail className="w-5 h-5" />}
                        placeholder="cliente@email.com"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={associatingCliente}
                        icon={<Check className="w-5 h-5" />}
                      >
                        {associatingCliente ? 'Associando...' : 'Associar Cliente'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
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
