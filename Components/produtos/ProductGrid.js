import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Package } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductGrid({ produtos }) {
  if (produtos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center text-center p-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-sage-100/50"
      >
        <Package className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800">Nenhum produto encontrado</h3>
        <p className="text-gray-500 mt-2">Tente ajustar seus filtros ou volte mais tarde.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      <AnimatePresence>
        {produtos.map((produto, index) => (
          <motion.div
            key={produto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ProductCard produto={produto} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}