import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-20 pb-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center md:text-left"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight">
              Moda que <span className="text-purple-600">Reconta</span> Histórias
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
              Descubra peças únicas e cheias de estilo em nosso brechó online. Moda consciente que combina com você e com o planeta.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to={createPageUrl("Produtos")}>
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg px-8 py-7 hover:shadow-lg transition-shadow">
                  Ver Coleção
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Sobre")}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-7">
                  Nossa História
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden md:block"
          >
             <img 
               src="https://images.unsplash.com/photo-1576185458896-9f783149d0a7?q=80&w=2592&auto=format&fit=crop" 
               alt="Modelo com roupas estilosas" 
               className="rounded-3xl shadow-2xl w-full h-auto object-cover"
             />
          </motion.div>
        </div>
      </div>
    </div>
  );
}