import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CheckoutErro() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card className="text-center">
        <CardHeader className="pb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Ops! Algo deu errado
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Não foi possível processar seu pagamento
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-red-800">O que pode ter acontecido?</h3>
            <ul className="text-sm text-red-700 space-y-1 text-left">
              <li>• Pagamento foi cancelado</li>
              <li>• Dados do cartão estão incorretos</li>
              <li>• Limite do cartão foi excedido</li>
              <li>• Problema temporário no sistema</li>
            </ul>
          </div>

          <p className="text-gray-600 text-sm">
            Não se preocupe! Seus itens ainda estão no carrinho. 
            Você pode tentar novamente ou escolher outra forma de pagamento.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to={createPageUrl('Carrinho')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Carrinho
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link to={createPageUrl('Produtos')}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Continuar Comprando
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}