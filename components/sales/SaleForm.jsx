import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus, Trash2, Search, User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Venda } from '@/entities/Venda';
import { mockProdutos } from '@/entities/Produto';
import { mockClientes } from '@/entities/Cliente';

const SaleForm = ({ venda = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: venda?.id || null,
    clienteId: venda?.clienteId || '',
    cliente: venda?.cliente || null,
    itens: venda?.itens || [],
    subtotal: venda?.subtotal || 0,
    desconto: venda?.desconto || 0,
    total: venda?.total || 0,
    formaPagamento: venda?.formaPagamento || '',
    status: venda?.status || 'pendente',
    observacoes: venda?.observacoes || '',
    taxaEntrega: venda?.taxaEntrega || 0,
    enderecoEntrega: venda?.enderecoEntrega || null
  });

  const [searchProduto, setSearchProduto] = useState('');
  const [searchCliente, setSearchCliente] = useState('');
  const [showProdutoSearch, setShowProdutoSearch] = useState(false);
  const [showClienteSearch, setShowClienteSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const formasPagamento = [
    { value: 'dinheiro', label: 'Dinheiro' },
    { value: 'cartao', label: 'Cartão' },
    { value: 'pix', label: 'PIX' },
    { value: 'transferencia', label: 'Transferência' }
  ];

  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'pago', label: 'Pago' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const produtosFiltrados = mockProdutos.filter(produto =>
    produto.nome.toLowerCase().includes(searchProduto.toLowerCase()) &&
    produto.isAvailable()
  );

  const clientesFiltrados = mockClientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchCliente.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchCliente.toLowerCase())
  );

  const calcularTotais = (itens, desconto = 0, taxaEntrega = 0) => {
    const subtotal = itens.reduce((total, item) => total + (item.quantidade * item.precoUnitario), 0);
    const total = subtotal - desconto + taxaEntrega;
    return { subtotal, total };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Recalcular totais quando necessário
      if (field === 'desconto' || field === 'taxaEntrega') {
        const { subtotal, total } = calcularTotais(prev.itens, 
          field === 'desconto' ? value : prev.desconto,
          field === 'taxaEntrega' ? value : prev.taxaEntrega
        );
        newData.subtotal = subtotal;
        newData.total = total;
      }
      
      return newData;
    });

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selecionarCliente = (cliente) => {
    setFormData(prev => ({
      ...prev,
      clienteId: cliente.id,
      cliente: cliente
    }));
    setShowClienteSearch(false);
    setSearchCliente('');
  };

  const adicionarProduto = (produto) => {
    const itemExistente = formData.itens.find(item => item.produtoId === produto.id);
    
    let novosItens;
    if (itemExistente) {
      novosItens = formData.itens.map(item =>
        item.produtoId === produto.id
          ? { ...item, quantidade: item.quantidade + 1, subtotal: (item.quantidade + 1) * item.precoUnitario }
          : item
      );
    } else {
      novosItens = [...formData.itens, {
        produtoId: produto.id,
        produto: produto,
        quantidade: 1,
        precoUnitario: produto.preco,
        subtotal: produto.preco
      }];
    }

    const { subtotal, total } = calcularTotais(novosItens, formData.desconto, formData.taxaEntrega);
    
    setFormData(prev => ({
      ...prev,
      itens: novosItens,
      subtotal,
      total
    }));
    
    setShowProdutoSearch(false);
    setSearchProduto('');
  };

  const removerProduto = (produtoId) => {
    const novosItens = formData.itens.filter(item => item.produtoId !== produtoId);
    const { subtotal, total } = calcularTotais(novosItens, formData.desconto, formData.taxaEntrega);
    
    setFormData(prev => ({
      ...prev,
      itens: novosItens,
      subtotal,
      total
    }));
  };

  const atualizarQuantidade = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerProduto(produtoId);
      return;
    }

    const novosItens = formData.itens.map(item =>
      item.produtoId === produtoId
        ? { ...item, quantidade: novaQuantidade, subtotal: novaQuantidade * item.precoUnitario }
        : item
    );

    const { subtotal, total } = calcularTotais(novosItens, formData.desconto, formData.taxaEntrega);
    
    setFormData(prev => ({
      ...prev,
      itens: novosItens,
      subtotal,
      total
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clienteId) {
      newErrors.cliente = 'Cliente é obrigatório';
    }

    if (formData.itens.length === 0) {
      newErrors.itens = 'Adicione pelo menos um produto';
    }

    if (!formData.formaPagamento) {
      newErrors.formaPagamento = 'Forma de pagamento é obrigatória';
    }

    if (formData.desconto < 0) {
      newErrors.desconto = 'Desconto não pode ser negativo';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const vendaData = {
        ...formData,
        desconto: parseFloat(formData.desconto) || 0,
        taxaEntrega: parseFloat(formData.taxaEntrega) || 0
      };

      const venda = new Venda(vendaData);
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave?.(venda);
      alert('Venda registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
      alert('Erro ao salvar venda. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Seleção de Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.cliente ? (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold">{formData.cliente.nome}</p>
                <p className="text-sm text-gray-600">{formData.cliente.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setFormData(prev => ({ ...prev, clienteId: '', cliente: null }))}
              >
                Alterar
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar cliente por nome ou email..."
                  value={searchCliente}
                  onChange={(e) => {
                    setSearchCliente(e.target.value);
                    setShowClienteSearch(true);
                  }}
                  className="pl-10"
                />
              </div>
              
              {showClienteSearch && searchCliente && (
                <div className="border rounded-lg max-h-60 overflow-y-auto">
                  {clientesFiltrados.map(cliente => (
                    <div
                      key={cliente.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => selecionarCliente(cliente)}
                    >
                      <p className="font-medium">{cliente.nome}</p>
                      <p className="text-sm text-gray-600">{cliente.email}</p>
                    </div>
                  ))}
                  {clientesFiltrados.length === 0 && (
                    <p className="p-3 text-gray-500">Nenhum cliente encontrado</p>
                  )}
                </div>
              )}
              
              {errors.cliente && <p className="text-sm text-red-500">{errors.cliente}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Produtos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Produtos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Busca de Produtos */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar produto para adicionar..."
              value={searchProduto}
              onChange={(e) => {
                setSearchProduto(e.target.value);
                setShowProdutoSearch(true);
              }}
              className="pl-10"
            />
          </div>

          {showProdutoSearch && searchProduto && (
            <div className="border rounded-lg max-h-60 overflow-y-auto">
              {produtosFiltrados.map(produto => (
                <div
                  key={produto.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center justify-between"
                  onClick={() => adicionarProduto(produto)}
                >
                  <div>
                    <p className="font-medium">{produto.nome}</p>
                    <p className="text-sm text-gray-600">{produto.categoria} - {produto.tamanho}</p>
                  </div>
                  <Badge variant="outline">{produto.getFormattedPrice()}</Badge>
                </div>
              ))}
              {produtosFiltrados.length === 0 && (
                <p className="p-3 text-gray-500">Nenhum produto encontrado</p>
              )}
            </div>
          )}

          {/* Lista de Produtos Adicionados */}
          {formData.itens.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Produtos Adicionados:</h4>
              {formData.itens.map(item => (
                <div key={item.produtoId} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.produto.nome}</p>
                    <p className="text-sm text-gray-600">{item.produto.categoria}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => atualizarQuantidade(item.produtoId, item.quantidade - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantidade}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => atualizarQuantidade(item.produtoId, item.quantidade + 1)}
                    >
                      +
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(item.subtotal)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removerProduto(item.produtoId)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {errors.itens && <p className="text-sm text-red-500">{errors.itens}</p>}
        </CardContent>
      </Card>

      {/* Detalhes da Venda */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Venda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
              <Select
                value={formData.formaPagamento}
                onChange={(e) => handleInputChange('formaPagamento', e.target.value)}
                className={errors.formaPagamento ? 'border-red-500' : ''}
              >
                <option value="">Selecione</option>
                {formasPagamento.map(forma => (
                  <option key={forma.value} value={forma.value}>
                    {forma.label}
                  </option>
                ))}
              </Select>
              {errors.formaPagamento && <p className="text-sm text-red-500 mt-1">{errors.formaPagamento}</p>}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="desconto">Desconto (R$)</Label>
              <Input
                id="desconto"
                type="number"
                step="0.01"
                value={formData.desconto}
                onChange={(e) => handleInputChange('desconto', e.target.value)}
                placeholder="0.00"
              />
              {errors.desconto && <p className="text-sm text-red-500 mt-1">{errors.desconto}</p>}
            </div>

            <div>
              <Label htmlFor="taxaEntrega">Taxa de Entrega (R$)</Label>
              <Input
                id="taxaEntrega"
                type="number"
                step="0.01"
                value={formData.taxaEntrega}
                onChange={(e) => handleInputChange('taxaEntrega', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <textarea
              id="observacoes"
              rows={3}
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Observações sobre a venda..."
            />
          </div>

          {/* Resumo dos Valores */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(formData.subtotal)}
              </span>
            </div>
            
            {formData.desconto > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Desconto:</span>
                <span>
                  -{new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(formData.desconto)}
                </span>
              </div>
            )}

            {formData.taxaEntrega > 0 && (
              <div className="flex justify-between">
                <span>Taxa de Entrega:</span>
                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(formData.taxaEntrega)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(formData.total)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Venda'}
        </Button>
      </div>
    </motion.div>
  );
};

export default SaleForm; 