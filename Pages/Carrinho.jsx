import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/providers/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, ShoppingCart, CreditCard, ChevronLeft, Loader2, User, Mail, Phone, MapPin, CreditCard as CpfIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Cliente } from '@/entities/Cliente';

export default function Carrinho() {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const [currentUser, setCurrentUser] = useState(null);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    endereco: '',
    cpf: ''
  });
  const [wantAccount, setWantAccount] = useState(false);
  const [accountData, setAccountData] = useState({
    senha: '',
    confirmarSenha: '',
    aceitaTermos: false,
    aceitaMarketing: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar se usuário está logado
    const userData = localStorage.getItem('brechoLuliUser');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      // Buscar dados completos do cliente
      loadClientData(user.id);
    }
  }, []);

  const loadClientData = async (clienteId) => {
    try {
      const clientes = await Cliente.filter({ id: clienteId });
      if (clientes.length > 0) {
        const cliente = clientes[0];
        setCustomerData({
          name: cliente.nome,
          email: cliente.email,
          phone: cliente.telefone || '',
          endereco: cliente.endereco || '',
          cpf: cliente.cpf || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
    }
  };

  const handleCreateAccount = async () => {
    if (wantAccount) {
      if (accountData.senha.length < 6) {
        setError('Senha deve ter pelo menos 6 caracteres');
        return false;
      }
      if (accountData.senha !== accountData.confirmarSenha) {
        setError('Senhas não conferem');
        return false;
      }
      if (!accountData.aceitaTermos) {
        setError('Você deve aceitar os termos para criar uma conta');
        return false;
      }

      try {
        // Verificar se email já existe
        const existingClientes = await Cliente.filter({ email: customerData.email });
        if (existingClientes.length > 0) {
          setError('Este email já está cadastrado');
          return false;
        }

        // Criar conta
        const clienteData = {
          nome: customerData.name,
          email: customerData.email,
          telefone: customerData.phone,
          endereco: customerData.endereco,
          cpf: customerData.cpf.replace(/\D/g, ''),
          senha_hash: btoa(accountData.senha),
          aceita_marketing: accountData.aceitaMarketing,
          data_cadastro: new Date().toISOString(),
          fonte_cadastro: "checkout",
          cadastro_completo: true,
          status: "ativo"
        };

        const novoCliente = await Cliente.create(clienteData);

        // Salvar sessão
        localStorage.setItem('brechoLuliUser', JSON.stringify({
          id: novoCliente.id,
          nome: novoCliente.nome,
          email: novoCliente.email,
          loginTime: Date.now()
        }));

        setCurrentUser({
          id: novoCliente.id,
          nome: novoCliente.nome,
          email: novoCliente.email
        });

        return true;
      } catch (error) {
        setError('Erro ao criar conta: ' + error.message);
        return false;
      }
    }
    return true;
  };

  const handleMercadoPagoCheckout = async () => {
    if (!customerData.name || !customerData.email || !customerData.phone || !customerData.endereco) {
      alert('Por favor, preencha todos os dados obrigatórios para continuar.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // Criar conta se solicitado
      const accountCreated = await handleCreateAccount();
      if (!accountCreated) {
        setIsProcessing(false);
        return;
      }

      const preferenceData = {
        items: cartItems.map(item => ({
          title: item.nome,
          description: `${item.categoria?.replace(/_/g, ' ')} - ${item.marca || 'Sem marca'}`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: item.preco_venda
        })),
        payer: {
          name: customerData.name,
          email: customerData.email,
          phone: { number: customerData.phone },
          address: {
            street_name: customerData.endereco
          }
        },
        back_urls: {
          success: `${window.location.origin}${createPageUrl('CheckoutSucesso')}`,
          failure: `${window.location.origin}${createPageUrl('CheckoutErro')}`,
          pending: `${window.location.origin}${createPageUrl('CheckoutPendente')}`
        },
        auto_return: 'approved',
        external_reference: `brecho-luli-${Date.now()}`,
      };

      const response = await fetch('https://178.156.173.84:3443/api/create-mercadopago-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferenceData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro da API:', errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      
      if (!responseData.init_point) {
        throw new Error('Backend não retornou URL de checkout válida');
      }

      // Salvar dados do pedido para a página de sucesso
      localStorage.setItem('brechoLuliPendingOrder', JSON.stringify({
        ...preferenceData,
        total: cartTotal,
        customer: customerData
      }));

      // Redirecionar o cliente para o checkout do Mercado Pago
      window.location.href = responseData.init_point;
      
    } catch (error) {
      console.error('Erro completo no checkout:', error);
      setError(error.message);
      alert(`Ocorreu um erro ao tentar finalizar a compra. Verifique sua conexão e tente novamente.\n\nDetalhes: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCPF = (value) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length <= 11) {
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Meu Carrinho</h1>
        <Link to={createPageUrl('Produtos')} className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800">
          <ChevronLeft className="w-5 h-5" />
          Continuar comprando
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio.</h2>
          <p className="text-gray-600 mb-6">Que tal encontrar algumas peças únicas na nossa coleção?</p>
          <Button asChild>
            <Link to={createPageUrl('Produtos')}>Ver Produtos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
                <img 
                  src={item.foto_url || 'https://via.placeholder.com/100'} 
                  alt={item.nome} 
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{item.nome}</h3>
                  {item.marca && <p className="text-sm text-gray-500">{item.marca}</p>}
                  {item.tamanho && <p className="text-sm text-gray-500">Tamanho: {item.tamanho}</p>}
                  <p className="text-lg font-semibold text-purple-600 mt-1">R$ {item.preco_venda.toFixed(2)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24 space-y-6">
              <h2 className="text-xl font-bold mb-4">Finalizar Pedido</h2>
              
              {currentUser ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">Logado como {currentUser.nome}</p>
                  <p className="text-green-600 text-sm">{currentUser.email}</p>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 mb-2">Já tem uma conta?</p>
                  <Link to={createPageUrl('Login')} className="text-blue-600 underline text-sm">
                    Faça login para agilizar o processo
                  </Link>
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Dados para Entrega</h3>
                
                <div>
                  <Label htmlFor="name">Nome completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      value={customerData.name}
                      onChange={(e) => setCustomerData(prev => ({...prev, name: e.target.value}))}
                      placeholder="Seu nome completo"
                      className="pl-10"
                      required
                      disabled={!!currentUser}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData(prev => ({...prev, email: e.target.value}))}
                      placeholder="seu@email.com"
                      className="pl-10"
                      required
                      disabled={!!currentUser}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Celular *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData(prev => ({...prev, phone: e.target.value}))}
                      placeholder="(11) 99999-9999"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="endereco">Endereço de entrega *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="endereco"
                      value={customerData.endereco}
                      onChange={(e) => setCustomerData(prev => ({...prev, endereco: e.target.value}))}
                      placeholder="Rua, número, bairro, cidade - estado"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <div className="relative">
                    <CpfIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="cpf"
                      value={customerData.cpf}
                      onChange={(e) => setCustomerData(prev => ({...prev, cpf: formatCPF(e.target.value)}))}
                      placeholder="000.000.000-00"
                      className="pl-10"
                      maxLength={14}
                    />
                  </div>
                </div>

                {!currentUser && (
                  <>
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                          id="wantAccount"
                          checked={wantAccount}
                          onCheckedChange={setWantAccount}
                        />
                        <Label htmlFor="wantAccount" className="text-sm">
                          Quero criar uma conta para futuras compras
                        </Label>
                      </div>

                      {wantAccount && (
                        <div className="space-y-3 pl-6 border-l-2 border-purple-200">
                          <div>
                            <Label htmlFor="senha" className="text-sm">Senha *</Label>
                            <Input
                              id="senha"
                              type="password"
                              value={accountData.senha}
                              onChange={(e) => setAccountData(prev => ({...prev, senha: e.target.value}))}
                              placeholder="Mínimo 6 caracteres"
                              className="text-sm"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="confirmarSenha" className="text-sm">Confirmar senha *</Label>
                            <Input
                              id="confirmarSenha"
                              type="password"
                              value={accountData.confirmarSenha}
                              onChange={(e) => setAccountData(prev => ({...prev, confirmarSenha: e.target.value}))}
                              placeholder="Confirme sua senha"
                              className="text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id="aceitaTermos"
                                checked={accountData.aceitaTermos}
                                onCheckedChange={(checked) => setAccountData(prev => ({...prev, aceitaTermos: checked}))}
                              />
                              <Label htmlFor="aceitaTermos" className="text-xs leading-4">
                                Aceito os Termos de Uso e Política de Privacidade *
                              </Label>
                            </div>

                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id="aceitaMarketing"
                                checked={accountData.aceitaMarketing}
                                onCheckedChange={(checked) => setAccountData(prev => ({...prev, aceitaMarketing: checked}))}
                              />
                              <Label htmlFor="aceitaMarketing" className="text-xs leading-4">
                                Quero receber ofertas por email/WhatsApp
                              </Label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
                  <span>R$ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span>A calcular</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button 
                size="lg" 
                className="w-full text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" 
                onClick={handleMercadoPagoCheckout}
                disabled={isProcessing || !customerData.name || !customerData.email || !customerData.phone || !customerData.endereco}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pagar com Mercado Pago
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <Button variant="link" size="sm" className="text-red-500 mt-2" onClick={clearCart}>
                  Limpar Carrinho
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center pt-2 border-t">
                <p>🔒 Pagamento 100% seguro</p>
                <p>Aceita PIX, cartão, boleto e mais</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}