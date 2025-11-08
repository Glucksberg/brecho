'use client'

import { LojaLayout } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default function BlogPage() {
  return (
    <LojaLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-3xl">Blog</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-600">
                Esta página está em construção. Em breve você encontrará artigos e novidades sobre moda sustentável.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </LojaLayout>
  )
}

