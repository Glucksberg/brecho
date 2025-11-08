'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { Input, Button } from '@/components/ui'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    dominio: '',
    slugPreview: ''
  })

  useEffect(() => {
    if ((session as any)?.user?.brechoId) {
      router.replace('/dashboard')
    }
  }, [session?.user, router])

  useEffect(() => {
    setForm((f) => ({ ...f, slugPreview: slugify(f.nome || 'meu-brecho') }))
  }, [form.nome])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/onboarding/create-brecho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          telefone: form.telefone || undefined,
          email: form.email || undefined,
          dominio: form.dominio || undefined
        })
      })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Erro ao criar brechó')
      }
      const brechoId = json.data?.brecho?.id
      if (brechoId) {
        await update({ brechoId })
        router.replace('/dashboard')
      } else {
        throw new Error('Brechó criado mas ID ausente na resposta')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar brechó')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Bem-vindo ao Retrô Carólis</CardTitle>
            <CardDescription>
              Vamos começar criando o seu brechó. Você poderá ajustar as informações depois nas configurações.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}
              <Input
                label="Nome do Brechó"
                placeholder="Ex: Retrô da Ana"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Telefone"
                  placeholder="(11) 99999-9999"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                />
                <Input
                  label="Email de contato"
                  type="email"
                  placeholder="contato@seudominio.com.br"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <Input
                label="Domínio (opcional)"
                placeholder="seudominio.com.br"
                value={form.dominio}
                onChange={(e) => setForm({ ...form, dominio: e.target.value })}
              />
              <div className="text-xs text-gray-500">
                URL interna (slug): <span className="font-medium">{form.slugPreview}</span>
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full" loading={submitting}>
                Criar meu brechó
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


