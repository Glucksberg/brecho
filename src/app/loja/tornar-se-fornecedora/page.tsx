'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LojaLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui'
import { Store, ArrowRight, Check, Info } from 'lucide-react'

export default function TornarSeFornecedoraPage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [canBecome, setCanBecome] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  const [formData, setFormData] = useState({
    telefone: '',
    cpf: '',
    percentualRepasse: 60,
    // Endereço
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    // Dados bancários
    pix: '',
    banco: '',
    agencia: '',
    conta: '',
    tipoConta: 'CORRENTE' as 'CORRENTE' | 'POUPANCA'
  })

  useEffect(() => {
    checkStatus()
  }, [session])

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/tornar-se-fornecedora')
      const data = await response.json()

      if (data.isFornecedora) {
        // Já é fornecedora, redirecionar
        router.push('/portal-fornecedora')
        return
      }

      setCanBecome(data.canBecomeFornecedora)

      if (!data.canBecomeFornecedora) {
        setError('Você não pode se tornar fornecedora')
      }
    } catch (err) {
      setError('Erro ao verificar status')
    } finally {
      setCheckingStatus(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/tornar-se-fornecedora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telefone: formData.telefone,
          cpf: formData.cpf || undefined,
          percentualRepasse: formData.percentualRepasse,
          endereco: formData.rua ? {
            rua: formData.rua,
            numero: formData.numero,
            complemento: formData.complemento || undefined,
            bairro: formData.bairro,
            cidade: formData.cidade,
            estado: formData.estado,
            cep: formData.cep
          } : undefined,
          dadosBancarios: formData.pix || formData.banco ? {
            pix: formData.pix || undefined,
            banco: formData.banco || undefined,
            agencia: formData.agencia || undefined,
            conta: formData.conta || undefined,
            tipoConta: formData.tipoConta
          } : undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao processar solicitação')
        return
      }

      // Sucesso! Atualizar sessão e redirecionar
      await update() // Atualiza a sessão do NextAuth

      // Aguardar um pouco para garantir que a sessão foi atualizada
      setTimeout(() => {
        router.push('/portal-fornecedora')
      }, 1000)
    } catch (err) {
      setError('Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || checkingStatus) {
    return (
      <LojaLayout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </LojaLayout>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login?callbackUrl=/loja/tornar-se-fornecedora')
    return null
  }

  if (!canBecome) {
    return (
      <LojaLayout>
        <div className="max-w-3xl mx-auto px-4 py-16">
          <Card variant="bordered">
            <CardContent className="p-12 text-center">
              <Info className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Acesso não permitido
              </h2>
              <p className="text-gray-600 mb-6">
                {error || 'Você não pode se tornar fornecedora neste momento'}
              </p>
              <Button variant="primary" onClick={() => router.push('/loja')}>
                Voltar para a Loja
              </Button>
            </CardContent>
          </Card>
        </div>
      </LojaLayout>
    )
  }

  return (
    <LojaLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Store className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Torne-se uma Fornecedora
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Venda suas peças em consignação na Retrô Carólis e ganhe dinheiro com roupas que você não usa mais!
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card variant="bordered">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">60% para você</h3>
              <p className="text-sm text-gray-600">Receba 60% do valor de cada venda</p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Sem taxas</h3>
              <p className="text-sm text-gray-600">Não cobramos taxas de cadastro</p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Portal exclusivo</h3>
              <p className="text-sm text-gray-600">Acompanhe suas vendas em tempo real</p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Preencha seus dados</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Telefone"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    required
                  />
                  <Input
                    label="CPF (opcional)"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço (opcional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Rua"
                      placeholder="Rua das Flores"
                      value={formData.rua}
                      onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Número"
                    placeholder="123"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  />
                  <Input
                    label="Complemento"
                    placeholder="Apto 45"
                    value={formData.complemento}
                    onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                  />
                  <Input
                    label="Bairro"
                    placeholder="Centro"
                    value={formData.bairro}
                    onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                  />
                  <Input
                    label="Cidade"
                    placeholder="São Paulo"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  />
                  <Input
                    label="Estado (UF)"
                    placeholder="SP"
                    maxLength={2}
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                  />
                  <Input
                    label="CEP"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                  />
                </div>
              </div>

              {/* Dados Bancários */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Bancários (opcional)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Você pode preencher agora ou depois no portal de fornecedoras
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Chave PIX (recomendado)"
                      placeholder="seu@email.com ou CPF ou telefone"
                      value={formData.pix}
                      onChange={(e) => setFormData({ ...formData, pix: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Banco"
                    placeholder="Banco do Brasil"
                    value={formData.banco}
                    onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
                  />
                  <Input
                    label="Agência"
                    placeholder="1234-5"
                    value={formData.agencia}
                    onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
                  />
                  <Input
                    label="Conta"
                    placeholder="12345-6"
                    value={formData.conta}
                    onChange={(e) => setFormData({ ...formData, conta: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Conta
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={formData.tipoConta}
                      onChange={(e) => setFormData({ ...formData, tipoConta: e.target.value as 'CORRENTE' | 'POUPANCA' })}
                    >
                      <option value="CORRENTE">Conta Corrente</option>
                      <option value="POUPANCA">Conta Poupança</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Percentual de Repasse */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Percentual de Repasse</h3>
                <p className="text-sm text-purple-700 mb-3">
                  Você receberá <strong>{formData.percentualRepasse}%</strong> do valor de cada venda
                </p>
                <p className="text-xs text-purple-600">
                  Este percentual pode variar de acordo com acordos especiais. O padrão é 60%.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/loja')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="flex-1"
                >
                  <span className="inline-flex items-center gap-2">
                    Tornar-se Fornecedora
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </LojaLayout>
  )
}
