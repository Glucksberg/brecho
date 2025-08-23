import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/providers/CartContext';

const CartPage = () => {
  const { items, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [cupomCode, setCupomCode] = useState('');
  const [desconto, setDesconto] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const cuponsValidos = {
    'WELCOME15': 0.15,
    'BRECHO10': 0.10,
    'PRIMEIRA20': 0.20
  };

  const handleApplyCupom = () => {
    const cupom = cupomCode.toUpperCase();
    if (cuponsValidos[cupom]) {
      const descontoValor = cartTotal * cuponsValidos[cupom];
      setDesconto(descontoValor);
      alert(`Cupom aplicado! Desconto de ${(cuponsValidos[cupom] * 100)}%`);
    } else {
      alert('Cupom inválido!');
    }
  };

  const finalTotal = cartTotal - desconto;

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      // Simular criação de preferência do Mercado Pago
      const preferenceData = {
        items: items.map(item => ({
          title: item.nome,
          quantity: item.quantity,
          unit_price: item.preco,
          currency_id: 'BRL'
        })),
        payer: {
          email: 'cliente@email.com' // Pegar do contexto de usuário
        },
        payment_methods: {
          excluded_payment_types: [],
          excluded_payment_methods: [],
          installments: 12
        },
        back_urls: {
          success: `${window.location.origin}/CheckoutSucesso`,
          failure: `${window.location.origin}/CheckoutErro`,
          pending: `${window.location.origin}/CheckoutPendente`
        },
        auto_return: 'approved'
      };

      // Chamar API do Mercado Pago
      const response = await fetch('https://178.156.173.84:3443/api/create-mercadopago-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferenceData)
      });

      const data = await response.json();
      
      if (data.init_point) {
        // Redirecionar para o checkout do Mercado Pago
        window.location.href = data.init_point;
      } else {
        throw new Error('Erro ao criar preferência de pagamento');
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-8">
              Adicione alguns produtos incríveis ao seu carrinho para continuar
            </p>
            <Button
              size="lg"
              onClick={() => window.history.back()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar Comprando
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carrinho de Compras</h1>
          <p className="text-gray-600">{items.length} {items.length === 1 ? 'item' : 'itens'} no seu carrinho</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Produtos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={item.imagemPrincipal || '/placeholder-product.jpg'}
                      alt={item.nome}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.nome}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.categoria}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.tamanho}</Badge>
                        <Badge variant="secondary">{item.cor}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        
                        <span className="px-3 py-1 text-center min-w-[2rem]">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.preco * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.preco)} cada
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continuar Comprando
              </Button>
              
              <Button
                variant="destructive"
                onClick={clearCart}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Carrinho
              </Button>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cupom de Desconto */}
                <div>
                  <label className="block text-sm font-medium mb-2">Cupom de Desconto</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite o cupom"
                      value={cupomCode}
                      onChange={(e) => setCupomCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCupom}
                    >
                      Aplicar
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Cupons disponíveis: WELCOME15, BRECHO10, PRIMEIRA20</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(cartTotal)}
                    </span>
                  </div>

                  {desconto > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>
                        -{new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(desconto)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(finalTotal)}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isLoading ? 'Processando...' : 'Finalizar Compra'}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  <p>Pagamento seguro via Mercado Pago</p>
                  <p>Aceita cartão, PIX, boleto</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 