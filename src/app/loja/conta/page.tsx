'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { LojaLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui'
import { User, Mail, Phone, MapPin, Lock, Package, Heart, CreditCard, LogOut, Store, ArrowRight, Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Tab = 'perfil' | 'pedidos' | 'favoritos' | 'endereco' | 'senha'

/**
 * Formata telefone brasileiro no formato (XX)XXXXX-XXXX enquanto digita
 */
function formatPhoneInput(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '')
  
  // Limita a 11 dígitos (DDD + 9 dígitos)
  const limited = numbers.slice(0, 11)
  
  // Aplica a formatação
  if (limited.length <= 2) {
    return limited.length > 0 ? `(${limited}` : ''
  } else if (limited.length <= 7) {
    return `(${limited.slice(0, 2)})${limited.slice(2)}`
  } else {
    return `(${limited.slice(0, 2)})${limited.slice(2, 7)}-${limited.slice(7)}`
  }
}

export default function MinhaContaPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<Tab>('perfil')
  const [loading, setLoading] = useState(false)
  const [canBecomeFornecedora, setCanBecomeFornecedora] = useState(false)
  const [usuario, setUsuario] = useState<any>(null)
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefone: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    }
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (session === null) {
      router.push('/loja/login?callbackUrl=/loja/conta')
    }
  }, [session, router])

  useEffect(() => {
    if (session?.user) {
      fetchUserData()
      fetchPedidos()
      checkFornecedoraStatus()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile')
      
      // Verificar se a resposta é JSON antes de fazer parse
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        // Se não for JSON, provavelmente foi redirecionado para login
        if (response.status === 401 || response.redirected) {
          router.push('/loja/login?callbackUrl=/loja/conta')
          return
        }
        throw new Error('Resposta inválida do servidor')
      }
      
      if (response.ok) {
        const data = await response.json()
        setUsuario(data.usuario)
        if (data.usuario) {
          // Formatar telefone ao carregar (se existir)
          const telefoneFormatado = data.usuario.telefone 
            ? formatPhoneInput(data.usuario.telefone) 
            : ''
          
          setFormData({
            name: data.usuario.name || '',
            email: data.usuario.email || '',
            telefone: telefoneFormatado,
            endereco: data.usuario.endereco || {
              cep: '',
              rua: '',
              numero: '',
              complemento: '',
              bairro: '',
              cidade: '',
              estado: ''
            }
          })
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
        if (response.status === 401) {
          router.push('/loja/login?callbackUrl=/loja/conta')
        } else {
          console.error('Erro ao buscar dados do usuário:', errorData)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const fetchPedidos = async () => {
    try {
      const response = await fetch('/api/user/pedidos')
      
      // Verificar se a resposta é JSON antes de fazer parse
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        // Se não for JSON, provavelmente foi redirecionado para login
        if (response.status === 401 || response.redirected) {
          return // Não redirecionar novamente, já foi feito em fetchUserData
        }
        return // Silenciosamente falhar se não for JSON
      }
      
      if (response.ok) {
        const data = await response.json()
        setPedidos(data.pedidos || [])
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
        if (response.status !== 401) {
          console.error('Erro ao buscar pedidos:', errorData)
        }
      }
    } catch (error) {
      // Ignorar erros de parse JSON (provavelmente HTML de redirecionamento)
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        return // Silenciosamente ignorar erros de parse JSON
      }
      console.error('Erro ao buscar pedidos:', error)
    }
  }

  const checkFornecedoraStatus = async () => {
    try {
      const response = await fetch('/api/tornar-se-fornecedora')
      const data = await response.json()
      setCanBecomeFornecedora(data.canBecomeFornecedora)
    } catch (error) {
      // Silently fail
    }
  }

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
    try {
      const formDataToSend: any = {}
      
      // Coletar dados do formulário baseado na aba ativa
      if (activeTab === 'perfil') {
        formDataToSend.name = formData.name
        formDataToSend.email = formData.email
        formDataToSend.telefone = formData.telefone
      } else if (activeTab === 'endereco') {
        formDataToSend.endereco = formData.endereco
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataToSend)
      })

      if (response.ok) {
        await fetchUserData()
        alert('Dados salvos com sucesso!')
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao salvar dados')
      }
    } catch (error) {
      alert('Erro ao salvar dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: true,
        callbackUrl: '/loja'
      })
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      alert('Erro ao fazer logout. Tente novamente.')
    }
  }

  // Show loading state
  if (loadingData || !session?.user) {
    return (
      <LojaLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </LojaLayout>
    )
  }

  // Use session data as fallback
  const userData = usuario || {
    name: (session?.user as any)?.nome || session?.user?.email?.split('@')[0] || 'Usuário',
    email: session?.user?.email || '',
    telefone: '',
    cpf: '',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
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
                  onClick={() => router.push('/loja/tornar-se-fornecedora')}
                >
                  <span className="inline-flex items-center gap-2">
                    Quero ser Fornecedora
                    <ArrowRight className="w-5 h-5" />
                  </span>
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
                    {userData.image ? (
                      <img src={userData.image} alt={userData.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">{userData.name}</h3>
                  <p className="text-sm text-gray-600">{userData.email}</p>
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
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        leftIcon={<User className="w-5 h-5" />}
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        leftIcon={<Mail className="w-5 h-5" />}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="CPF"
                        defaultValue={userData.cpf || ''}
                        disabled
                      />
                      <Input
                        label="Telefone"
                        value={formData.telefone}
                        onChange={(e) => {
                          const formatted = formatPhoneInput(e.target.value)
                          setFormData({ ...formData, telefone: formatted })
                        }}
                        placeholder="(11)99985-1234"
                        leftIcon={<Phone className="w-5 h-5" />}
                        maxLength={14} // (XX)XXXXX-XXXX = 14 caracteres
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
                          value={formData.endereco.cep}
                          onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, cep: e.target.value } })}
                        />
                      </div>
                    </div>

                    <Input
                      label="Rua"
                      value={formData.endereco.rua}
                      onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, rua: e.target.value } })}
                      leftIcon={<MapPin className="w-5 h-5" />}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Número"
                        value={formData.endereco.numero}
                        onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, numero: e.target.value } })}
                      />
                      <Input
                        label="Complemento"
                        value={formData.endereco.complemento}
                        onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, complemento: e.target.value } })}
                      />
                    </div>

                    <Input
                      label="Bairro"
                      value={formData.endereco.bairro}
                      onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, bairro: e.target.value } })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Cidade"
                        value={formData.endereco.cidade}
                        onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } })}
                      />
                      <Input
                        label="Estado"
                        value={formData.endereco.estado}
                        onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco, estado: e.target.value } })}
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
