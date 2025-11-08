'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { LojaLayout } from '@/components/layout'
import { Input, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { User, Lock, Mail, Phone, LogIn } from 'lucide-react'

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    telefone: ''
  })
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
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

      // Success - redirect to callback URL or loja
      const callbackUrl = searchParams.get('callbackUrl') || '/loja'
      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          telefone: formData.telefone || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta')
        return
      }

      // Após cadastro, fazer login automaticamente
      const loginResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (loginResult?.error) {
        setError('Conta criada, mas erro ao fazer login. Tente fazer login manualmente.')
        setIsLogin(true)
        return
      }

      // Success - redirect to loja
      router.push('/loja')
      router.refresh()
    } catch (err: any) {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await signIn('google', {
        callbackUrl: searchParams.get('callbackUrl') || '/loja'
      })
    } catch (err) {
      setError('Erro ao fazer login com Google')
      setLoading(false)
    }
  }

  return (
    <LojaLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {isLogin ? 'Entrar na Conta' : 'Criar Conta'}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin 
                  ? 'Entre para continuar comprando' 
                  : 'Crie sua conta e comece a comprar'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Google Login Button */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full mb-4"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <form onSubmit={isLogin ? handleLogin : handleCadastro} className="space-y-4">
                {!isLogin && (
                  <Input
                    label="Nome Completo"
                    type="text"
                    placeholder="Seu nome"
                    leftIcon={<User className="w-5 h-5" />}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={!isLogin}
                  />
                )}

                <Input
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  leftIcon={<Mail className="w-5 h-5" />}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                {!isLogin && (
                  <Input
                    label="Telefone (opcional)"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    leftIcon={<Phone className="w-5 h-5" />}
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                )}

                <Input
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-5 h-5" />}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  helperText={!isLogin ? 'Mínimo 8 caracteres' : undefined}
                />

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-600">Lembrar-me</span>
                    </label>

                    <Link href="/esqueci-senha" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Esqueceu a senha?
                    </Link>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={loading}
                  icon={isLogin ? <LogIn className="w-5 h-5" /> : undefined}
                >
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setError('')
                      setFormData({ name: '', email: '', password: '', telefone: '' })
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {isLogin ? 'Criar conta' : 'Fazer login'}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LojaLayout>
  )
}

export default function LojaLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  )
}

