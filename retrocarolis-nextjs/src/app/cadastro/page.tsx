'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui'
import { User, Mail, Lock, Phone, MapPin, Building } from 'lucide-react'

export default function CadastroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cpf: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name.startsWith('endereco.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validations
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (formData.senha.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta')
      }

      // Success - redirect to login
      alert('Conta criada com sucesso! Faça login para continuar.')
      router.push('/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const buscarCep = async () => {
    const cep = formData.endereco.cep.replace(/\D/g, '')

    if (cep.length !== 8) {
      return
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setError('CEP não encontrado')
        return
      }

      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }
      }))
    } catch (err) {
      setError('Erro ao buscar CEP')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/loja" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">
              RC
            </div>
            <span className="text-2xl font-bold text-gray-900">Retrô Carólis</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Criar Conta</h1>
          <p className="text-gray-600 mt-2">Preencha seus dados para começar</p>
        </div>

        <Card variant="bordered">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Personal Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
                <div className="space-y-4">
                  <Input
                    label="Nome Completo"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    leftIcon={<User className="w-5 h-5" />}
                    required
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    leftIcon={<Mail className="w-5 h-5" />}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="CPF"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                      required
                    />

                    <Input
                      label="Telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      leftIcon={<Phone className="w-5 h-5" />}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>

                  <Input
                    label="Senha"
                    name="senha"
                    type="password"
                    value={formData.senha}
                    onChange={handleChange}
                    leftIcon={<Lock className="w-5 h-5" />}
                    helperText="Mínimo 8 caracteres"
                    required
                  />

                  <Input
                    label="Confirmar Senha"
                    name="confirmarSenha"
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    leftIcon={<Lock className="w-5 h-5" />}
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Endereço de Entrega</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      label="CEP"
                      name="endereco.cep"
                      value={formData.endereco.cep}
                      onChange={handleChange}
                      placeholder="00000-000"
                      className="flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={buscarCep}
                      className="mt-7"
                    >
                      Buscar
                    </Button>
                  </div>

                  <Input
                    label="Rua"
                    name="endereco.rua"
                    value={formData.endereco.rua}
                    onChange={handleChange}
                    leftIcon={<MapPin className="w-5 h-5" />}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Número"
                      name="endereco.numero"
                      value={formData.endereco.numero}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Complemento"
                      name="endereco.complemento"
                      value={formData.endereco.complemento}
                      onChange={handleChange}
                      placeholder="Apto, Bloco, etc"
                    />
                  </div>

                  <Input
                    label="Bairro"
                    name="endereco.bairro"
                    value={formData.endereco.bairro}
                    onChange={handleChange}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Cidade"
                      name="endereco.cidade"
                      value={formData.endereco.cidade}
                      onChange={handleChange}
                      leftIcon={<Building className="w-5 h-5" />}
                      required
                    />

                    <Input
                      label="Estado"
                      name="endereco.estado"
                      value={formData.endereco.estado}
                      onChange={handleChange}
                      placeholder="UF"
                      maxLength={2}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Fazer login
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
