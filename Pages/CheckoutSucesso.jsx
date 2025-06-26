import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useCart } from '@/components/providers/CartContext';

export default function CheckoutSucesso() {
  const [orderData, setOrderData] = useState(null);
  const { clearCart } = useCart();

  useEffect(() => {
    // Recuperar dados do pedido do localStorage
    const pendingOrder = localStorage.getItem('brechoLuliPendingOrder');
    if (pendingOrder) {
      const parsedOrder = JSON.parse(pendingOrder);
      setOrderData(parsedOrder);
      
      // Limpar carrinho após pagamento bem-sucedido
      clearCart();
      
      // Limpar dados temporários
      localStorage.removeItem('brechoLuliPendingOrder');
    }
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card className="text-center">
        <CardHeader className="pb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Pagamento Realizado!
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Obrigado pela sua compra no Brechó da Luli
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {orderData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Resumo do Pedido</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Cliente: {orderData.payer?.name}</p>
                <p>Email: {orderData.payer?.email}</p>
                <p>Total: R$ {orderData.total?.toFixed(2)}</p>
                <p>Itens: {orderData.items?.length}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Package className="w-5 h-5" />
              <span className="font-medium">Entraremos em contato em breve para combinar a entrega</span>
            </div>
            
            <p className="text-gray-600 text-sm">
              Você receberá um email de confirmação com todos os detalhes do seu pedido.
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