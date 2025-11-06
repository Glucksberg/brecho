'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui'
import { Mail, ArrowLeft } from 'lucide-react'

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/esqueci-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar email')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/loja" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">
              RC
            </div>
            <span className="text-2xl font-bold text-gray-900">Retrô Carólis</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Esqueci minha senha</h1>
          <p className="text-gray-600 mt-2">
            Digite seu email para receber o link de recuperação
          </p>
        </div>

        <Card variant="bordered">
          <CardContent className="p-6">
            {success ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Email enviado!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Enviamos um link de recuperação para <strong>{email}</strong>.
                    Verifique sua caixa de entrada e spam.
                  </p>
                </div>

                <div className="pt-4 space-y-2">
                  <Link href="/login" className="block">
                    <Button variant="primary" size="lg" className="w-full">
                      Voltar para Login
                    </Button>
                  </Link>

                  <button
                    onClick={() => {
                      setSuccess(false)
                      setEmail('')
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Tentar outro email
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Info Message */}
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                  <p>
                    Você receberá um email com instruções para redefinir sua senha.
                    O link expira em 1 hora.
                  </p>
                </div>

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-5 h-5" />}
                  placeholder="seu@email.com"
                  required
                />

                <div className="space-y-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                  </Button>

                  <Link href="/login" className="block">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full"
                      icon={<ArrowLeft className="w-5 h-5" />}
                    >
                      Voltar para Login
                    </Button>
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="text-blue-600 hover:text-blue-700 font-medium">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
