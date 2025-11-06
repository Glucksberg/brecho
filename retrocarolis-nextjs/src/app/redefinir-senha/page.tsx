'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui'
import { Lock, Check } from 'lucide-react'

export default function RedefinirSenhaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)

  useEffect(() => {
    validateToken()
  }, [token])

  const validateToken = async () => {
    if (!token) {
      setError('Token inválido ou expirado')
      setValidatingToken(false)
      return
    }

    try {
      const response = await fetch('/api/auth/validar-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      if (response.ok) {
        setTokenValid(true)
      } else {
        setError('Token inválido ou expirado')
      }
    } catch (err) {
      setError('Erro ao validar token')
    } finally {
      setValidatingToken(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }

    if (senha.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, senha })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao redefinir senha')
      }

      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando token...</p>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <Card variant="bordered">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❌</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Link Inválido
              </h2>

              <p className="text-gray-600 mb-6">
                {error || 'O link de recuperação é inválido ou expirou.'}
              </p>

              <Link href="/esqueci-senha">
                <Button variant="primary" size="lg" className="w-full">
                  Solicitar Novo Link
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900">Redefinir Senha</h1>
          <p className="text-gray-600 mt-2">
            Digite sua nova senha
          </p>
        </div>

        <Card variant="bordered">
          <CardContent className="p-6">
            {success ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Senha Redefinida!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Sua senha foi alterada com sucesso.
                    Você será redirecionado para o login...
                  </p>
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

                <Input
                  label="Nova Senha"
                  name="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  leftIcon={<Lock className="w-5 h-5" />}
                  helperText="Mínimo 8 caracteres"
                  required
                />

                <Input
                  label="Confirmar Nova Senha"
                  name="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  leftIcon={<Lock className="w-5 h-5" />}
                  required
                />

                {/* Password Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Requisitos da senha:
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className={senha.length >= 8 ? 'text-green-700' : ''}>
                      ✓ Mínimo 8 caracteres
                    </li>
                    <li className={senha && confirmarSenha && senha === confirmarSenha ? 'text-green-700' : ''}>
                      ✓ As senhas devem coincidir
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Redefinir Senha'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
