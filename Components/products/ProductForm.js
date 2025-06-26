import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { UploadFile } from "@/integrations/Core";

const categories = [
{ value: "roupas_femininas", label: "Roupas Femininas" },
{ value: "roupas_masculinas", label: "Roupas Masculinas" },
{ value: "calcados", label: "Calçados" },
{ value: "acessorios", label: "Acessórios" },
{ value: "bolsas", label: "Bolsas" },
{ value: "infantil", label: "Infantil" },
{ value: "oleos_essenciais", label: "Óleos Essenciais" },
{ value: "mandalas", label: "Mandalas" },
{ value: "artesanato", label: "Artesanato" },
{ value: "gratiluz", label: "Gratiluz" }

];

const conditions = [
  { value: "excelente", label: "Excelente" },
  { value: "muito_bom", label: "Muito Bom" },
  { value: "bom", label: "Bom" },
  { value: "regular", label: "Regular" }
];

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(product || {
    nome: "",
    categoria: "",
    tamanho: "",
    cor: "",
    marca: "",
    preco_compra: "",
    preco_venda: "",
    condicao: "",
    status: "disponivel",
    descricao: "",
    foto_url: ""
  });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      preco_compra: formData.preco_compra ? parseFloat(formData.preco_compra) : null,
      preco_venda: parseFloat(formData.preco_venda)
    };
    onSubmit(dataToSubmit);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, foto_url: file_url }));
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            {product ? "Editar Produto" : "Novo Produto"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={value => setFormData(prev => ({ ...prev, categoria: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="tamanho">Tamanho</Label>
                <Input
                  id="tamanho"
                  value={formData.tamanho}
                  onChange={e => setFormData(prev => ({ ...prev, tamanho: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="cor">Cor</Label>
                <Input
                  id="cor"
                  value={formData.cor}
                  onChange={e => setFormData(prev => ({ ...prev, cor: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={e => setFormData(prev => ({ ...prev, marca: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preco_compra">Preço de Compra (R$)</Label>
                <Input
                  id="preco_compra"
                  type="number"
                  step="0.01"
                  value={formData.preco_compra}
                  onChange={e => setFormData(prev => ({ ...prev, preco_compra: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="preco_venda">Preço de Venda (R$) *</Label>
                <Input
                  id="preco_venda"
                  type="number"
                  step="0.01"
                  value={formData.preco_venda}
                  onChange={e => setFormData(prev => ({ ...prev, preco_venda: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="condicao">Condição</Label>
              <Select value={formData.condicao} onValueChange={value => setFormData(prev => ({ ...prev, condicao: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map(cond => (
                    <SelectItem key={cond.value} value={cond.value}>
                      {cond.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="foto">Foto do Produto</Label>
              <div className="flex gap-4 items-center">
                <Input
                  id="foto"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <span className="text-sm text-gray-500">Enviando...</span>}
              </div>
              {formData.foto_url && (
                <div className="mt-2">
                  <img src={formData.foto_url} alt="Preview" className="w-20 h-20 object-cover rounded" />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={e => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-sage-500 to-sage-600">
                <Save className="w-4 h-4 mr-2" />
                Salvar Produto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}