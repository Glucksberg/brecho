'use client'

import { LojaLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default function TrocasPage() {
  return (
    <LojaLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-3xl">Política de Trocas e Devoluções</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-600">
                Esta página está em construção. Em breve você encontrará informações sobre nossa política de trocas e devoluções.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </LojaLayout>
  )
}

