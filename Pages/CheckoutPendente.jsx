import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Package, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CheckoutPendente() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card className="text-center">
        <CardHeader className="pb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Pagamento Pendente
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Estamos aguardando a confirmação do seu pagamento
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-yellow-800">Status do Pagamento</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• Seu pedido foi registrado com sucesso</p>
              <p>• Aguardando confirmação do pagamento</p>
              <p>• Você receberá um email quando for aprovado</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-yellow-600">
              <Package className="w-5 h-5" />
              <span className="font-medium">Assim que o pagamento for confirmado, prepararemos seu pedido</span>
            </div>
            
            <p className="text-gray-600 text-sm">
              Dependendo da forma de pagamento escolhida, a confirmação pode levar de alguns minutos até 3 dias úteis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to={createPageUrl('Produtos')}>
                <Package className="w-4 h-4 mr-2" />
                Continuar Comprando
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link to={createPageUrl('Home')}>
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}