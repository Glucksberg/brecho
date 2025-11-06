'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Input, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setError('Email ou senha inválidos')
        return
      }

      // Success - redirect to callback URL or dashboard
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-3xl font-bold text-white">RC</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Retrô Carólis</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestão para Brechós</p>
        </div>

        {/* Login Form */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Entrar no Sistema</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                leftIcon={<Mail className="w-5 h-5" />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-5 h-5" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-600">Lembrar-me</span>
                </label>

                <Link href="/recuperar-senha" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
              >
                Entrar
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                É uma fornecedora?{' '}
                <Link href="/portal-fornecedora/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Acesse o Portal da Fornecedora
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Cliente?{' '}
                <Link href="/loja" className="text-blue-600 hover:text-blue-700 font-medium">
                  Visite nossa loja
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-600 mb-2">Credenciais de teste:</p>
          <div className="space-y-1 text-xs text-gray-500">
            <p>Admin: admin@retrocarolis.com / senha123</p>
            <p>Vendedor: vendedor@retrocarolis.com / senha123</p>
            <p>Fornecedor: fornecedor@retrocarolis.com / senha123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
