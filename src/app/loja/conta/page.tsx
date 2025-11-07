'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { LojaLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui'
import { User, Mail, Phone, MapPin, Lock, Package, Heart, CreditCard, LogOut, Store, ArrowRight, Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Tab = 'perfil' | 'pedidos' | 'favoritos' | 'endereco' | 'senha'

export default function MinhaContaPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<Tab>('perfil')
  const [loading, setLoading] = useState(false)
  const [canBecomeFornecedora, setCanBecomeFornecedora] = useState(false)

  useEffect(() => {
    checkFornecedoraStatus()
  }, [session])

  const checkFornecedoraStatus = async () => {
    try {
      const response = await fetch('/api/tornar-se-fornecedora')
      const data = await response.json()
      setCanBecomeFornecedora(data.canBecomeFornecedora)
    } catch (error) {
      // Silently fail
    }
  }

  // Mock user data
  const usuario = {
    nome: 'Maria Silva',
    email: 'maria@example.com',
    telefone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    endereco: {
      rua: 'Rua das Flores',
      numero: '123',
      complemento: 'Apto 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567'
    }
  }

  // Mock orders
  const pedidos = [
    {
      id: '1',
      numero: '#001234',
      data: '2024-01-15',
      status: 'ENTREGUE',
      total: 349.80,
      itens: 3
    },
    {
      id: '2',
      numero: '#001235',
      data: '2024-01-10',
      status: 'EM_TRANSITO',
      total: 189.90,
      itens: 1
    },
    {
      id: '3',
      numero: '#001236',
      data: '2024-01-05',
      status: 'PROCESSANDO',
      total: 279.70,
      itens: 2
    }
  ]

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: 'success' | 'warning' | 'primary' | 'danger' }> = {
      ENTREGUE: { label: 'Entregue', color: 'success' },
      EM_TRANSITO: { label: 'Em Trânsito', color: 'primary' },
      PROCESSANDO: { label: 'Processando', color: 'warning' },
      CANCELADO: { label: 'Cancelado', color: 'danger' }
    }
    return badges[status] || badges.PROCESSANDO
  }

  const tabs = [
    { id: 'perfil' as Tab, label: 'Meu Perfil', icon: User },
    { id: 'pedidos' as Tab, label: 'Meus Pedidos', icon: Package },
    { id: 'favoritos' as Tab, label: 'Favoritos', icon: Heart },
    { id: 'endereco' as Tab, label: 'Endereço', icon: MapPin },
    { id: 'senha' as Tab, label: 'Alterar Senha', icon: Lock }
  ]

  const handleSalvar = async () => {
    setLoading(true)
    // TODO: Implement save
    setTimeout(() => {
      setLoading(false)
      alert('Dados salvos com sucesso!')
    }, 1000)
  }

  const handleLogout = () => {
    // TODO: Implement logout
    alert('Logout')
  }

  return (
    <LojaLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Minha Conta
        </h1>

        {/* Banner Tornar-se Fornecedora */}
        {canBecomeFornecedora && (
          <Card variant="bordered" className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Store className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-purple-900">
                        Torne-se uma Fornecedora
                      </h3>
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-purple-700">
                      Venda suas peças em consignação e ganhe <strong>60% do valor</strong> de cada venda!
                    </p>
                    <p className="text-sm text-purple-600 mt-1">
                      ✨ Sem taxas de cadastro • Portal exclusivo • Pagamentos garantidos
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  className="bg-purple-600 hover:bg-purple-700"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => router.push('/loja/tornar-se-fornecedora')}
                >
                  Quero ser Fornecedora
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card variant="bordered">
              <CardContent className="p-4">
                {/* User Info */}
                <div className="text-center pb-4 border-b border-gray-200 mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{usuario.nome}</h3>
                  <p className="text-sm text-gray-600">{usuario.email}</p>
                </div>

                {/* Navigation */}
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
                        {tab.label}
                      </button>
                    )
                  })}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sair
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>
                  {tabs.find(t => t.id === activeTab)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Perfil Tab */}
                {activeTab === 'perfil' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nome Completo"
                        defaultValue={usuario.nome}
                        leftIcon={<User className="w-5 h-5" />}
                      />
                      <Input
                        label="Email"
                        type="email"
                        defaultValue={usuario.email}
                        leftIcon={<Mail className="w-5 h-5" />}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="CPF"
                        defaultValue={usuario.cpf}
                        disabled
                      />
                      <Input
                        label="Telefone"
                        defaultValue={usuario.telefone}
                        leftIcon={<Phone className="w-5 h-5" />}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        onClick={handleSalvar}
                        disabled={loading}
                      >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Pedidos Tab */}
                {activeTab === 'pedidos' && (
                  <div className="space-y-4">
                    {pedidos.map((pedido) => {
                      const status = getStatusBadge(pedido.status)
                      return (
                        <div key={pedido.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-gray-900">{pedido.numero}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(pedido.data).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <Badge variant={status.color}>{status.label}</Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              {pedido.itens} {pedido.itens === 1 ? 'item' : 'itens'}
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="font-bold text-blue-600">
                                {formatCurrency(pedido.total)}
                              </p>
                              <Button variant="outline" size="sm">
                                Ver Detalhes
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {pedidos.length === 0 && (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">Você ainda não tem pedidos</p>
                        <Link href="/loja">
                          <Button variant="primary">
                            Começar a Comprar
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Favoritos Tab */}
                {activeTab === 'favoritos' && (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Veja seus favoritos na{' '}
                      <Link href="/loja/favoritos" className="text-blue-600 hover:text-blue-700 font-medium">
                        página de favoritos
                      </Link>
                    </p>
                  </div>
                )}

                {/* Endereço Tab */}
                {activeTab === 'endereco' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Input
                          label="CEP"
                          defaultValue={usuario.endereco.cep}
                        />
                      </div>
                    </div>

                    <Input
                      label="Rua"
                      defaultValue={usuario.endereco.rua}
                      leftIcon={<MapPin className="w-5 h-5" />}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Número"
                        defaultValue={usuario.endereco.numero}
                      />
                      <Input
                        label="Complemento"
                        defaultValue={usuario.endereco.complemento}
                      />
                    </div>

                    <Input
                      label="Bairro"
                      defaultValue={usuario.endereco.bairro}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Cidade"
                        defaultValue={usuario.endereco.cidade}
                      />
                      <Input
                        label="Estado"
                        defaultValue={usuario.endereco.estado}
                        maxLength={2}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        onClick={handleSalvar}
                        disabled={loading}
                      >
                        {loading ? 'Salvando...' : 'Salvar Endereço'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Senha Tab */}
                {activeTab === 'senha' && (
                  <div className="space-y-6">
                    <Input
                      label="Senha Atual"
                      type="password"
                      leftIcon={<Lock className="w-5 h-5" />}
                    />

                    <Input
                      label="Nova Senha"
                      type="password"
                      leftIcon={<Lock className="w-5 h-5" />}
                      helperText="Mínimo 8 caracteres"
                    />

                    <Input
                      label="Confirmar Nova Senha"
                      type="password"
                      leftIcon={<Lock className="w-5 h-5" />}
                    />

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        onClick={handleSalvar}
                        disabled={loading}
                      >
                        {loading ? 'Salvando...' : 'Alterar Senha'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LojaLayout>
  )
}
