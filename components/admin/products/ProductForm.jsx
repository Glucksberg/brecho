import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Produto } from '@/entities/Produto';

const ProductForm = ({ produto = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: produto?.id || null,
    nome: produto?.nome || '',
    descricao: produto?.descricao || '',
    preco: produto?.preco || '',
    precoOriginal: produto?.precoOriginal || '',
    categoria: produto?.categoria || '',
    subcategoria: produto?.subcategoria || '',
    tamanho: produto?.tamanho || '',
    cor: produto?.cor || '',
    marca: produto?.marca || '',
    condicao: produto?.condicao || 'usado',
    genero: produto?.genero || '',
    imagens: produto?.imagens || [],
    imagemPrincipal: produto?.imagemPrincipal || '',
    estoque: produto?.estoque || 1,
    ativo: produto?.ativo !== undefined ? produto.ativo : true,
    destaque: produto?.destaque || false,
    tags: produto?.tags || [],
    peso: produto?.peso || '',
    dimensoes: produto?.dimensoes || {
      altura: '',
      largura: '',
      profundidade: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');

  const categorias = [
    'Roupas',
    'Acessórios',
    'Calçados',
    'Bolsas',
    'Joias',
    'Perfumes'
  ];

  const subcategorias = {
    'Roupas': ['Vestidos', 'Blusas', 'Calças', 'Saias', 'Casacos', 'Camisetas'],
    'Acessórios': ['Colares', 'Pulseiras', 'Brincos', 'Anéis', 'Óculos', 'Lenços'],
    'Calçados': ['Sapatos', 'Sandálias', 'Tênis', 'Botas', 'Chinelos'],
    'Bolsas': ['Bolsas de Mão', 'Mochilas', 'Carteiras', 'Clutches'],
    'Joias': ['Ouro', 'Prata', 'Bijuterias', 'Relógios'],
    'Perfumes': ['Femininos', 'Masculinos', 'Unissex']
  };

  const tamanhos = ['PP', 'P', 'M', 'G', 'GG', 'XGG', '36', '38', '40', '42', '44', '46'];
  
  const cores = [
    'Azul', 'Preto', 'Branco', 'Vermelho', 'Verde', 'Rosa',
    'Amarelo', 'Roxo', 'Marrom', 'Cinza', 'Bege', 'Laranja'
  ];

  const condicoes = [
    { value: 'novo', label: 'Novo' },
    { value: 'seminovo', label: 'Semi-novo' },
    { value: 'usado', label: 'Usado' }
  ];

  const generos = [
    { value: 'feminino', label: 'Feminino' },
    { value: 'masculino', label: 'Masculino' },
    { value: 'unissex', label: 'Unissex' },
    { value: 'infantil', label: 'Infantil' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDimensionChange = (dimension, value) => {
    setFormData(prev => ({
      ...prev,
      dimensoes: {
        ...prev.dimensoes,
        [dimension]: value
      }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.preco || formData.preco <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    if (!formData.tamanho) {
      newErrors.tamanho = 'Tamanho é obrigatório';
    }

    if (!formData.cor) {
      newErrors.cor = 'Cor é obrigatória';
    }

    if (formData.estoque < 0) {
      newErrors.estoque = 'Estoque não pode ser negativo';
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
      // Converter os dados para os tipos corretos
      const produtoData = {
        ...formData,
        preco: parseFloat(formData.preco),
        precoOriginal: formData.precoOriginal ? parseFloat(formData.precoOriginal) : null,
        estoque: parseInt(formData.estoque),
        peso: formData.peso ? parseFloat(formData.peso) : 0,
        dimensoes: {
          altura: formData.dimensoes.altura ? parseFloat(formData.dimensoes.altura) : 0,
          largura: formData.dimensoes.largura ? parseFloat(formData.dimensoes.largura) : 0,
          profundidade: formData.dimensoes.profundidade ? parseFloat(formData.dimensoes.profundidade) : 0
        }
      };

      const produto = new Produto(produtoData);
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave?.(produto);
      alert('Produto salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle>
            {formData.id ? 'Editar Produto' : 'Cadastrar Novo Produto'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className={errors.nome ? 'border-red-500' : ''}
                  placeholder="Ex: Vestido Floral Vintage"
                />
                {errors.nome && <p className="text-sm text-red-500 mt-1">{errors.nome}</p>}
              </div>

              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => handleInputChange('marca', e.target.value)}
                  placeholder="Ex: Zara, Farm, etc."
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <textarea
                id="descricao"
                rows={4}
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Descreva o produto em detalhes..."
              />
            </div>

            {/* Categoria e Subcategoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  className={errors.categoria ? 'border-red-500' : ''}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
                {errors.categoria && <p className="text-sm text-red-500 mt-1">{errors.categoria}</p>}
              </div>

              <div>
                <Label htmlFor="subcategoria">Subcategoria</Label>
                <Select
                  value={formData.subcategoria}
                  onChange={(e) => handleInputChange('subcategoria', e.target.value)}
                  disabled={!formData.categoria}
                >
                  <option value="">Selecione uma subcategoria</option>
                  {formData.categoria && subcategorias[formData.categoria]?.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Preços */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="preco">Preço *</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => handleInputChange('preco', e.target.value)}
                  className={errors.preco ? 'border-red-500' : ''}
                  placeholder="0.00"
                />
                {errors.preco && <p className="text-sm text-red-500 mt-1">{errors.preco}</p>}
              </div>

              <div>
                <Label htmlFor="precoOriginal">Preço Original (para desconto)</Label>
                <Input
                  id="precoOriginal"
                  type="number"
                  step="0.01"
                  value={formData.precoOriginal}
                  onChange={(e) => handleInputChange('precoOriginal', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Características */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="tamanho">Tamanho *</Label>
                <Select
                  value={formData.tamanho}
                  onChange={(e) => handleInputChange('tamanho', e.target.value)}
                  className={errors.tamanho ? 'border-red-500' : ''}
                >
                  <option value="">Selecione</option>
                  {tamanhos.map(tam => (
                    <option key={tam} value={tam}>{tam}</option>
                  ))}
                </Select>
                {errors.tamanho && <p className="text-sm text-red-500 mt-1">{errors.tamanho}</p>}
              </div>

              <div>
                <Label htmlFor="cor">Cor *</Label>
                <Select
                  value={formData.cor}
                  onChange={(e) => handleInputChange('cor', e.target.value)}
                  className={errors.cor ? 'border-red-500' : ''}
                >
                  <option value="">Selecione</option>
                  {cores.map(cor => (
                    <option key={cor} value={cor}>{cor}</option>
                  ))}
                </Select>
                {errors.cor && <p className="text-sm text-red-500 mt-1">{errors.cor}</p>}
              </div>

              <div>
                <Label htmlFor="condicao">Condição</Label>
                <Select
                  value={formData.condicao}
                  onChange={(e) => handleInputChange('condicao', e.target.value)}
                >
                  {condicoes.map(cond => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Gênero e Estoque */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="genero">Gênero</Label>
                <Select
                  value={formData.genero}
                  onChange={(e) => handleInputChange('genero', e.target.value)}
                >
                  <option value="">Selecione</option>
                  {generos.map(gen => (
                    <option key={gen.value} value={gen.value}>{gen.label}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="estoque">Estoque</Label>
                <Input
                  id="estoque"
                  type="number"
                  value={formData.estoque}
                  onChange={(e) => handleInputChange('estoque', e.target.value)}
                  className={errors.estoque ? 'border-red-500' : ''}
                  placeholder="1"
                />
                {errors.estoque && <p className="text-sm text-red-500 mt-1">{errors.estoque}</p>}
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map(tag => (
                  <span key={tag} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Digite uma tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Dimensões e Peso */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <Label htmlFor="peso">Peso (g)</Label>
                <Input
                  id="peso"
                  type="number"
                  value={formData.peso}
                  onChange={(e) => handleInputChange('peso', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  value={formData.dimensoes.altura}
                  onChange={(e) => handleDimensionChange('altura', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="largura">Largura (cm)</Label>
                <Input
                  id="largura"
                  type="number"
                  value={formData.dimensoes.largura}
                  onChange={(e) => handleDimensionChange('largura', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="profundidade">Profundidade (cm)</Label>
                <Input
                  id="profundidade"
                  type="number"
                  value={formData.dimensoes.profundidade}
                  onChange={(e) => handleDimensionChange('profundidade', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Opções */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.ativo}
                  onChange={(e) => handleInputChange('ativo', e.target.checked)}
                />
                <span>Produto ativo</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.destaque}
                  onChange={(e) => handleInputChange('destaque', e.target.checked)}
                />
                <span>Produto em destaque</span>
              </label>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Salvando...' : 'Salvar Produto'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductForm; 