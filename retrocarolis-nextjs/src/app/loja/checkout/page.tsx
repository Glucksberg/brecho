'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LojaLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui'
import { Truck, Lock, ShoppingCart, CreditCard } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, cartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: ''
  })

  const [endereco, setEndereco] = useState({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  })

  const subtotal = cartTotal
  const frete = subtotal >= 200 ? 0 : 15.00
  const total = subtotal + frete

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/loja/carrinho')
    }
  }, [items, router])

  const buscarCEP = async () => {
    const cep = endereco.cep.replace(/\D/g, '')

    if (cep.length !== 8) {
      alert('CEP inválido')
      return
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        alert('CEP não encontrado')
        return
      }

      setEndereco({
        ...endereco,
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf
      })
    } catch (err) {
      alert('Erro ao buscar CEP')
    }
  }

  const handleCheckout = async () => {
    // Validate form
    if (!dadosCliente.nome || !dadosCliente.email || !dadosCliente.cpf) {
      setError('Preencha todos os dados pessoais')
      return
    }

    if (!endereco.cep || !endereco.rua || !endereco.numero || !endereco.cidade || !endereco.estado) {
      setError('Preencha todos os dados de endereço')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create Mercado Pago preference
      const response = await fetch('/api/pagamento/criar-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantity,
            imagemPrincipal: item.imagemPrincipal
          })),
          payer: {
            nome: (() => {
              const nameParts = dadosCliente.nome.trim().split(/\s+/)
              return nameParts[0] || dadosCliente.nome
            })(),
            sobrenome: (() => {
              const nameParts = dadosCliente.nome.trim().split(/\s+/)
              const lastName = nameParts.slice(1).join(' ')
              // Use first name as fallback for single-word names (Mercado Pago requirement)
              return lastName || nameParts[0] || 'N/A'
            })(),
            email: dadosCliente.email,
            telefone: dadosCliente.telefone,
            cpf: dadosCliente.cpf.replace(/\D/g, '')
          },
          shipment: {
            custo: frete,
            endereco: {
              cep: endereco.cep.replace(/\D/g, ''),
              rua: endereco.rua,
              numero: endereco.numero,
              complemento: endereco.complemento,
              bairro: endereco.bairro,
              cidade: endereco.cidade,
              estado: endereco.estado
            }
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar checkout')
      }

      // Redirect to Mercado Pago checkout
      const checkoutUrl = data.sandboxInitPoint || data.initPoint

      if (!checkoutUrl) {
        throw new Error('URL de checkout não retornada')
      }

      // Redirect to Mercado Pago
      window.location.href = checkoutUrl
    } catch (err: any) {
      console.error('Erro no checkout:', err)
      setError(err.message || 'Erro ao processar checkout')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null // Will redirect
  }

  return (
    <LojaLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Finalizar Compra
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Data */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Nome Completo"
                    value={dadosCliente.nome}
                    onChange={(e) => setDadosCliente({ ...dadosCliente, nome: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={dadosCliente.email}
                      onChange={(e) => setDadosCliente({ ...dadosCliente, email: e.target.value })}
                      required
                    />
                    <Input
                      label="Telefone"
                      value={dadosCliente.telefone}
                      onChange={(e) => setDadosCliente({ ...dadosCliente, telefone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  <Input
                    label="CPF"
                    value={dadosCliente.cpf}
                    onChange={(e) => setDadosCliente({ ...dadosCliente, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      label="CEP"
                      value={endereco.cep}
                      onChange={(e) => setEndereco({ ...endereco, cep: e.target.value })}
                      placeholder="00000-000"
                      required
                      className="flex-1"
                    />
                    <div className="flex items-end">
                      <Button variant="outline" onClick={buscarCEP}>
                        Buscar
                      </Button>
                    </div>
                  </div>

                  <Input
                    label="Rua"
                    value={endereco.rua}
                    onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Número"
                      value={endereco.numero}
                      onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                      required
                    />
                    <Input
                      label="Complemento"
                      value={endereco.complemento}
                      onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                      placeholder="Apto, Bloco, etc"
                    />
                  </div>

                  <Input
                    label="Bairro"
                    value={endereco.bairro}
                    onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Cidade"
                      value={endereco.cidade}
                      onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })}
                      required
                    />
                    <Input
                      label="Estado"
                      value={endereco.estado}
                      onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })}
                      placeholder="UF"
                      maxLength={2}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card variant="bordered" className="bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Pagamento Seguro via Mercado Pago
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Você será redirecionado para completar o pagamento de forma segura.
                      Aceitamos cartão de crédito, débito, PIX e boleto.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span>Seus dados estão protegidos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card variant="bordered" className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-200 last:border-0">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        {item.imagemPrincipal ? (
                          <img
                            src={item.imagemPrincipal}
                            alt={item.nome}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-2xl">📷</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{item.nome}</p>
                        <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          {formatCurrency(item.preco * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span>
                      {frete === 0 ? (
                        <span className="text-green-600 font-medium">Grátis</span>
                      ) : (
                        formatCurrency(frete)
                      )}
                    </span>
                  </div>

                  {subtotal < 200 && frete > 0 && (
                    <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                      💡 Falta {formatCurrency(200 - subtotal)} para frete grátis
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processando...' : 'Ir para Pagamento'}
                </Button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Troca grátis em 7 dias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Parcelamento sem juros</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LojaLayout>
  )
}
