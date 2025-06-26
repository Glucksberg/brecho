import React from 'react';
import { useFavorites } from '@/components/providers/FavoritesContext';
import { Button } from '@/components/ui/button';
import { Heart, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

import ProductGrid from '../components/produtos/ProductGrid';

export default function Favoritos() {
  const { favorites } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Heart className="w-12 h-12 mx-auto text-red-500 mb-4" />
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">Meus Favoritos</h1>
        <p className="mt-4 text-lg text-gray-600">
          {favorites.length > 0 
            ? `Você tem ${favorites.length} ${favorites.length === 1 ? 'item favorito' : 'itens favoritos'}.`
            : "Suas peças queridinhas aparecerão aqui."
          }
        </p>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-gray-50 rounded-lg"
        >
          <h2 className="text-2xl font-semibold mb-2">Sua lista de desejos está vazia.</h2>
          <p className="text-gray-600 mb-6">Clique no coração dos produtos que você amar para guardá-los aqui!</p>
          <Button asChild>
            <Link to={createPageUrl('Produtos')}>
                <Package className="w-4 h-4 mr-2" />
                Ver Produtos
            </Link>
          </Button>
        </motion.div>
      ) : (
        <ProductGrid produtos={favorites} />
      )}
    </div>
  );
}