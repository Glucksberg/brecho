'use client'

import { LojaLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default function ContatoPage() {
  return (
    <LojaLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-3xl">Contato</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-600">
                Esta página está em construção. Em breve você encontrará informações de contato e um formulário para entrar em contato conosco.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </LojaLayout>
  )
}

