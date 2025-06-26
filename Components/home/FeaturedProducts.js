import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../produtos/ProductCard'; // Assuming ProductCard is generic enough

export default function FeaturedProducts({ produtos, loading }) {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Recém-Chegados</h2>
        <p className="mt-3 text-lg text-gray-600">As últimas novidades que garimpamos para você.</p>
      </motion.div>

      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {produtos.map((produto, index) => (
            <motion.div
              key={produto.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard produto={produto} />
            </motion.div>
          ))}
        </div>
      )}
      
      {produtos.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4" />
            <p>Nenhum produto em destaque no momento. Volte em breve!</p>
        </div>
      )}

      <div className="text-center mt-12">
        <Link to={createPageUrl("Produtos")}>
          <Button size="lg" variant="outline">
            Ver todos os produtos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}