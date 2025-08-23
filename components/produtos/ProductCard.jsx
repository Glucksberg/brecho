import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star, Badge as BadgeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/components/providers/CartContext';
import { useFavorites } from '@/components/providers/FavoritesContext';

const ProductCard = ({ 
  produto, 
  onView, 
  showQuickActions = true,
  size = 'normal',
  className = ""
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const isFavorite = favorites.some(fav => fav.id === produto.id);
  const hasDiscount = produto.precoOriginal && produto.precoOriginal > produto.preco;
  const discountPercent = hasDiscount 
    ? Math.round(((produto.precoOriginal - produto.preco) / produto.precoOriginal) * 100)
    : 0;

  const sizeClasses = {
    small: {
      card: 'max-w-48',
      image: 'h-32',
      title: 'text-sm',
      price: 'text-sm'
    },
    normal: {
      card: 'max-w-72',
      image: 'h-48',
      title: 'text-base',
      price: 'text-lg'
    },
    large: {
      card: 'max-w-80',
      image: 'h-56',
      title: 'text-lg',
      price: 'text-xl'
    }
  };

  const classes = sizeClasses[size] || sizeClasses.normal;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(produto);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(produto.id);
    } else {
      addToFavorites(produto);
    }
  };

  const handleView = (e) => {
    e.stopPropagation();
    onView?.(produto);
  };

  const getConditionColor = (condicao) => {
    const colors = {
      'novo': 'bg-green-100 text-green-800',
      'seminovo': 'bg-blue-100 text-blue-800',
      'usado': 'bg-yellow-100 text-yellow-800'
    };
    return colors[condicao] || 'bg-gray-100 text-gray-800';
  };

  const getConditionLabel = (condicao) => {
    const labels = {
      'novo': 'Novo',
      'seminovo': 'Semi-novo',
      'usado': 'Usado'
    };
    return labels[condicao] || condicao;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`${classes.card} ${className}`}
    >
      <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
        <div className="relative">
          {/* Container da Imagem */}
          <div className={`relative ${classes.image} overflow-hidden bg-gray-100`}>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
            )}
            
            {!imageError ? (
              <img
                src={produto.imagemPrincipal || produto.imagens?.[0] || '/placeholder-product.jpg'}
                alt={produto.nome}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(true);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-400">
                  <BadgeIcon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-xs">Sem imagem</p>
                </div>
              </div>
            )}

            {/* Badges de Desconto e Destaque */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {hasDiscount && (
                <Badge className="bg-red-500 text-white text-xs font-bold">
                  -{discountPercent}%
                </Badge>
              )}
              {produto.destaque && (
                <Badge className="bg-purple-500 text-white text-xs">
                  Destaque
                </Badge>
              )}
            </div>

            {/* Botões de Ação Rápida */}
            {showQuickActions && (
              <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-full backdrop-blur-sm ${
                    isFavorite 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleView}
                  className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Botão de Adicionar ao Carrinho (hover) */}
            {showQuickActions && (
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2"
                  disabled={!produto.isAvailable?.()}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {produto.isAvailable?.() ? 'Adicionar' : 'Indisponível'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Informações do Produto */}
          <div className="space-y-2">
            {/* Categoria e Condição */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {produto.categoria}
              </Badge>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(produto.condicao)}`}>
                {getConditionLabel(produto.condicao)}
              </span>
            </div>

            {/* Nome do Produto */}
            <h3 className={`font-semibold text-gray-900 line-clamp-2 ${classes.title}`}>
              {produto.nome}
            </h3>

            {/* Marca */}
            {produto.marca && (
              <p className="text-sm text-gray-600">{produto.marca}</p>
            )}

            {/* Características */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {produto.tamanho && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {produto.tamanho}
                </span>
              )}
              {produto.cor && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {produto.cor}
                </span>
              )}
            </div>

            {/* Preço */}
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-purple-600 ${classes.price}`}>
                  {produto.getFormattedPrice ? produto.getFormattedPrice() : 
                   new Intl.NumberFormat('pt-BR', {
                     style: 'currency',
                     currency: 'BRL'
                   }).format(produto.preco)}
                </span>
                
                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(produto.precoOriginal)}
                  </span>
                )}
              </div>

              {/* Avaliação (se disponível) */}
              {produto.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(produto.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    ({produto.reviewCount || 0})
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Variações específicas do ProductCard
export const ProductCardCompact = ({ produto, ...props }) => (
  <ProductCard 
    produto={produto} 
    size="small" 
    showQuickActions={false}
    {...props} 
  />
);

export const ProductCardFeatured = ({ produto, ...props }) => (
  <ProductCard 
    produto={produto} 
    size="large" 
    className="border-2 border-purple-200"
    {...props} 
  />
);

export const ProductCardList = ({ produto, onView, ...props }) => {
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const isFavorite = favorites.some(fav => fav.id === produto.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="flex">
          {/* Imagem */}
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={produto.imagemPrincipal || produto.imagens?.[0] || '/placeholder-product.jpg'}
              alt={produto.nome}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Conteúdo */}
          <CardContent className="flex-1 p-4">
            <div className="flex justify-between h-full">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {produto.nome}
                    </h3>
                    <p className="text-sm text-gray-600">{produto.marca}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {produto.categoria}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {produto.descricao}
                </p>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-purple-600">
                    {produto.getFormattedPrice ? produto.getFormattedPrice() : 
                     new Intl.NumberFormat('pt-BR', {
                       style: 'currency',
                       currency: 'BRL'
                     }).format(produto.preco)}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {produto.tamanho}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {produto.cor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (isFavorite) {
                      removeFromFavorites(produto.id);
                    } else {
                      addToFavorites(produto);
                    }
                  }}
                  className={isFavorite ? 'text-red-500' : 'text-gray-500'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addToCart(produto)}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView?.(produto)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard; 