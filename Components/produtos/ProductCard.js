
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '@/components/providers/CartContext';
import { useFavorites } from '@/components/providers/FavoritesContext';
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

export default function ProductCard({ produto }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const handleAddToCart = (e) => {
    e.preventDefault(); // Impede a navegação ao clicar no botão
    e.stopPropagation(); // Prevents the click from bubbling up to the Link
    addToCart(produto);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(produto);
  };

  const favorited = isFavorite(produto.id);

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Link to={createPageUrl(`ProdutoDetalhe?id=${produto.id}`)} className="h-full flex flex-col cursor-pointer">
        <Card className="h-full flex flex-col overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
          <div className="relative overflow-hidden">
            <img 
              src={produto.foto_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2896&auto=format&fit=crop'} 
              alt={produto.nome}
              className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <Badge variant="secondary" className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm">
              {categoryLabels[produto.categoria] || produto.categoria}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 hover:bg-white transition-transform hover:scale-110"
              onClick={handleToggleFavorite}
            >
              <Heart className={`w-5 h-5 transition-all ${favorited ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
            </Button>
          </div>
          <CardContent className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-lg text-gray-800 truncate">{produto.nome}</h3>
            <p className="text-sm text-gray-500 mb-4">{produto.marca || 'Marca não informada'}</p>
            <div className="flex-grow" />
            <div className="flex justify-between items-center mt-auto">
              <p className="text-2xl font-extrabold text-gray-900">
                R$ {produto.preco_venda?.toFixed(2)}
              </p>
              <Button size="icon" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full h-11 w-11" onClick={handleAddToCart}>
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
