
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge"; // Import the Badge component

const paymentMethods = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "PIX" },
  { value: "cartao_debito", label: "Cartão Débito" },
  { value: "cartao_credito", label: "Cartão Crédito" }
];

export default function SaleForm({ produtos, clientes, preSelectedProductId, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    produto_id: preSelectedProductId || "", // Initialize with preSelectedProductId
    produto_nome: "",
    valor_venda: "",
    desconto: "0",
    forma_pagamento: "",
    cliente_id: "", // New field for client ID
    cliente_nome: "", // New field for client name
    observacoes: ""
  });

  // Auto-select product if pre-selected via prop
  useEffect(() => {
    if (preSelectedProductId && produtos.length > 0) {
      const product = produtos.find(p => p.id === preSelectedProductId);
      if (product) {
        setFormData(prev => ({
          ...prev,
          produto_id: preSelectedProductId,
          produto_nome: product.nome,
          valor_venda: product.preco_venda?.toString() || ""
        }));
      }
    }
  }, [preSelectedProductId, produtos]);

  const selectedProduct = produtos.find(p => p.id === formData.produto_id);

  const handleProductChange = (productId) => {
    const product = produtos.find(p => p.id === productId);
    setFormData(prev => ({
      ...prev,
      produto_id: productId,
      produto_nome: product?.nome || "",
      valor_venda: product?.preco_venda?.toString() || ""
    }));
  };
  
  const handleClientChange = (clientId) => {
    const client = clientes.find(c => c.id === clientId);
    setFormData(prev => ({
      ...prev,
      cliente_id: clientId,
      cliente_nome: client?.nome || ""
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      valor_venda: parseFloat(formData.valor_venda),
      desconto: parseFloat(formData.desconto)
    };
    onSubmit(dataToSubmit);
  };

  const finalValue = (parseFloat(formData.valor_venda) || 0) - (parseFloat(formData.desconto) || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Nova Venda
            {preSelectedProductId && (
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                Venda Rápida
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="produto">Produto *</Label>
              <Select value={formData.produto_id} onValueChange={handleProductChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto..." />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map(produto => (
                    <SelectItem key={produto.id} value={produto.id}>
                      <div>
                        <div className="font-medium">{produto.nome}</div>
                        <div className="text-sm text-gray-500">
                          R$ {produto.preco_venda?.toFixed(2)} - {produto.categoria?.replace(/_/g, ' ')}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valor_venda">Valor de Venda (R$) *</Label>
                <Input
                  id="valor_venda"
                  type="number"
                  step="0.01"
                  value={formData.valor_venda}
                  onChange={e => setFormData(prev => ({ ...prev, valor_venda: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="desconto">Desconto (R$)</Label>
                <Input
                  id="desconto"
                  type="number"
                  step="0.01"
                  value={formData.desconto}
                  onChange={e => setFormData(prev => ({ ...prev, desconto: e.target.value }))}
                />
              </div>
            </div>

            {finalValue !== parseFloat(formData.valor_venda) && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">Valor Final:</span>
                  <span className="text-green-800 font-bold text-lg">
                    R$ {finalValue.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="forma_pagamento">Forma de Pagamento *</Label>
                <Select value={formData.forma_pagamento} onValueChange={value => setFormData(prev => ({ ...prev, forma_pagamento: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cliente">Cliente (opcional)</Label>
                <Select value={formData.cliente_id} onValueChange={handleClientChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Nenhum</SelectItem> {/* Use empty string for "Nenhum" option */}
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={3}
                placeholder="Observações para a venda..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Registrar Venda
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
