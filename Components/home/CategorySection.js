import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Roupas Femininas', href: 'Produtos?categoria=roupas_femininas', image: 'https://images.unsplash.com/photo-1581044777550-4cfa6ce67943?q=80&w=2592&auto=format&fit=crop' },
  { name: 'Roupas Masculinas', href: 'Produtos?categoria=roupas_masculinas', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2592&auto=format&fit=crop' },
  { name: 'Bolsas', href: 'Produtos?categoria=bolsas', image: 'https://images.unsplash.com/photo-1590739241989-3b63286b8f36?q=80&w=2592&auto=format&fit=crop' },
  { name: 'Calçados', href: 'Produtos?categoria=calcados', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2592&auto=format&fit=crop' },
];

export default function CategorySection() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Navegue por Categorias</h2>
        <p className="mt-3 text-lg text-gray-600">Encontre exatamente o que você procura.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={createPageUrl(category.href)}>
              <Card className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <img src={category.image} alt={category.name} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  <p className="text-white/80 mt-1 flex items-center">
                    Ver produtos <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}