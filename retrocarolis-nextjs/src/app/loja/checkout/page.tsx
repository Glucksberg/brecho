'use client'

import { useState } from 'react'
import { LojaLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select } from '@/components/ui'
import { CreditCard, Truck, Lock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function CheckoutPage() {
  const [etapa, setEtapa] = useState<'dados' | 'pagamento' | 'confirmacao'>('dados')

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

  const [pagamento, setPagamento] = useState({
    tipo: 'CARTAO_CREDITO',
    numeroCartao: '',
    nomeCartao: '',
    validade: '',
    cvv: '',
    parcelas: 1
  })

  // Mock cart data
  const itens = [
    { id: '1', nome: 'Vestido Floral Vintage', preco: 189.90, quantidade: 1 },
    { id: '2', nome: 'Jaqueta Jeans', preco: 159.90, quantidade: 1 },
  ]

  const subtotal = itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0)
  const frete = 0
  const total = subtotal + frete

  const buscarCEP = async () => {
    // TODO: Integrate with ViaCEP API
    console.log('Buscar CEP:', endereco.cep)
  }

  const finalizarCompra = () => {
    // TODO: Process payment and create order
    console.log('Finalizar compra:', { dadosCliente, endereco, pagamento })
    setEtapa('confirmacao')
  }

  return (
    <LojaLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Finalizar Compra
        </h1>

        {/* Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${etapa === 'dados' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                etapa === 'dados' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="font-medium">Dados</span>
            </div>

            <div className="w-16 h-0.5 bg-gray-300" />

            <div className={`flex items-center gap-2 ${etapa === 'pagamento' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                etapa === 'pagamento' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="font-medium">Pagamento</span>
            </div>

            <div className="w-16 h-0.5 bg-gray-300" />

            <div className={`flex items-center gap-2 ${etapa === 'confirmacao' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                etapa === 'confirmacao' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="font-medium">Confirmação</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Etapa 1: Dados */}
            {etapa === 'dados' && (
              <div className="space-y-6">
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
                          label="E-mail"
                          type="email"
                          value={dadosCliente.email}
                          onChange={(e) => setDadosCliente({ ...dadosCliente, email: e.target.value })}
                          required
                        />
                        <Input
                          label="Telefone"
                          value={dadosCliente.telefone}
                          onChange={(e) => setDadosCliente({ ...dadosCliente, telefone: e.target.value })}
                          required
                        />
                      </div>
                      <Input
                        label="CPF"
                        value={dadosCliente.cpf}
                        onChange={(e) => setDadosCliente({ ...dadosCliente, cpf: e.target.value })}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

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
                        <Select
                          label="Estado"
                          value={endereco.estado}
                          onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })}
                          options={[
                            { value: 'SP', label: 'São Paulo' },
                            { value: 'RJ', label: 'Rio de Janeiro' },
                            { value: 'MG', label: 'Minas Gerais' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button variant="primary" size="lg" className="w-full" onClick={() => setEtapa('pagamento')}>
                  Continuar para Pagamento
                </Button>
              </div>
            )}

            {/* Etapa 2: Pagamento */}
            {etapa === 'pagamento' && (
              <div className="space-y-6">
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Forma de Pagamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Payment Method Selection */}
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
                          { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
                          { value: 'PIX', label: 'PIX' },
                          { value: 'BOLETO', label: 'Boleto' },
                        ].map((metodo) => (
                          <button
                            key={metodo.value}
                            onClick={() => setPagamento({ ...pagamento, tipo: metodo.value as any })}
                            className={`p-4 border-2 rounded-lg text-center font-medium transition-colors ${
                              pagamento.tipo === metodo.value
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {metodo.label}
                          </button>
                        ))}
                      </div>

                      {/* Credit Card Form */}
                      {(pagamento.tipo === 'CARTAO_CREDITO' || pagamento.tipo === 'CARTAO_DEBITO') && (
                        <div className="space-y-4">
                          <Input
                            label="Número do Cartão"
                            value={pagamento.numeroCartao}
                            onChange={(e) => setPagamento({ ...pagamento, numeroCartao: e.target.value })}
                            placeholder="0000 0000 0000 0000"
                            required
                          />
                          <Input
                            label="Nome no Cartão"
                            value={pagamento.nomeCartao}
                            onChange={(e) => setPagamento({ ...pagamento, nomeCartao: e.target.value })}
                            required
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Validade"
                              value={pagamento.validade}
                              onChange={(e) => setPagamento({ ...pagamento, validade: e.target.value })}
                              placeholder="MM/AA"
                              required
                            />
                            <Input
                              label="CVV"
                              value={pagamento.cvv}
                              onChange={(e) => setPagamento({ ...pagamento, cvv: e.target.value })}
                              placeholder="123"
                              required
                            />
                          </div>

                          {pagamento.tipo === 'CARTAO_CREDITO' && (
                            <Select
                              label="Parcelas"
                              value={String(pagamento.parcelas)}
                              onChange={(e) => setPagamento({ ...pagamento, parcelas: Number(e.target.value) })}
                              options={[
                                { value: '1', label: `1x de ${formatCurrency(total)} sem juros` },
                                { value: '2', label: `2x de ${formatCurrency(total / 2)} sem juros` },
                                { value: '3', label: `3x de ${formatCurrency(total / 3)} sem juros` },
                              ]}
                            />
                          )}
                        </div>
                      )}

                      {/* PIX */}
                      {pagamento.tipo === 'PIX' && (
                        <div className="p-6 bg-blue-50 rounded-lg text-center">
                          <p className="text-sm text-gray-600 mb-2">
                            Após confirmar o pedido, você receberá o QR Code para pagamento
                          </p>
                          <p className="font-semibold text-blue-600">
                            Pagamento instantâneo
                          </p>
                        </div>
                      )}

                      {/* Boleto */}
                      {pagamento.tipo === 'BOLETO' && (
                        <div className="p-6 bg-yellow-50 rounded-lg text-center">
                          <p className="text-sm text-gray-600 mb-2">
                            O boleto será gerado após a confirmação do pedido
                          </p>
                          <p className="font-semibold text-yellow-700">
                            Prazo de compensação: até 3 dias úteis
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" onClick={() => setEtapa('dados')}>
                    Voltar
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    icon={<Lock className="w-5 h-5" />}
                    onClick={finalizarCompra}
                  >
                    Finalizar Pedido
                  </Button>
                </div>
              </div>
            )}

            {/* Etapa 3: Confirmação */}
            {etapa === 'confirmacao' && (
              <Card variant="bordered">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl">✓</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Pedido Realizado com Sucesso!
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Número do pedido: <span className="font-semibold">#12345</span>
                  </p>
                  <p className="text-gray-600 mb-8">
                    Enviamos um e-mail com os detalhes do seu pedido
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="primary" size="lg">
                      Acompanhar Pedido
                    </Button>
                    <Button variant="outline" size="lg">
                      Voltar para Loja
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card variant="bordered" className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {itens.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantidade}x {item.nome}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.preco * item.quantidade)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">{formatCurrency(total)}</span>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Pagamento seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Dados protegidos</span>
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
