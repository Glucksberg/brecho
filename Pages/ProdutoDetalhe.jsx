
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Produto } from '@/entities/Produto';
import { useCart } from '@/components/providers/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Tag, Ruler, Sparkles, Package, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const categoryLabels = {
  roupas_femininas: "Roupas Femininas",
  roupas_masculinas: "Roupas Masculinas",
  calcados: "Calçados",
  acessorios: "Acessórios",
  bolsas: "Bolsas",
  infantil: "Infantil",
  oleos_essenciais: "Óleos Essenciais",
  mandalas: "Mandalas",
  artesanato: "Artesanato",
  gratiluz: "Gratiluz",
};

const conditionLabels = {
  excelente: "Excelente",
  muito_bom: "Muito Bom",
  bom: "Bom",
  regular: "Regular"
};

export default function ProdutoDetalhe() {
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cartItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const data = await Produto.get(id);
          setProduto(data);
        } catch (err) {
          setError('Produto não encontrado.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setError('Nenhum produto especificado.');
      setLoading(false);
    }
  }, [location.search]);

  if (loading) {
    return <div className="text-center py-20">Carregando detalhes do produto...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  if (!produto) {
    return <div className="text-center py-20">Produto não disponível.</div>;
  }
  
  const isItemInCart = cartItems.find(item => item.id === produto.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link to={createPageUrl('Produtos')} className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-8">
        <ChevronLeft className="w-5 h-5" />
        Voltar para a coleção
      </Link>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <img 
            src={produto.foto_url || 'https://via.placeholder.com/600'} 
            alt={produto.nome}
            className="w-full h-auto object-cover rounded-2xl shadow-lg"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{produto.nome}</h1>
          {produto.marca && <p className="text-lg text-gray-500 mb-4">Marca: {produto.marca}</p>}
          
          <p className="text-4xl font-extrabold text-purple-600 mb-6">
            R$ {produto.preco_venda?.toFixed(2)}
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Categoria:</span>
              <span>{categoryLabels[produto.categoria] || produto.categoria}</span>
            </div>
            <div className="flex items-center gap-3">
              <Ruler className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Tamanho:</span>
              <span>{produto.tamanho || 'Não informado'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Condição:</span>
              <Badge variant="outline">{conditionLabels[produto.condicao] || produto.condicao}</Badge>
            </div>
          </div>
          
          {produto.descricao && (
            <div className="prose text-gray-600 mb-6">
              <p>{produto.descricao}</p>
            </div>
          )}

          <div className="mt-auto">
            <Button
              size="lg"
              className="w-full text-lg py-7"
              onClick={() => addToCart(produto)}
              disabled={isItemInCart}
            >
              <ShoppingBag className="w-6 h-6 mr-3" />
              {isItemInCart ? 'Produto no Carrinho' : 'Adicionar ao Carrinho'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
