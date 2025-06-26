import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Recycle, Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-16 border border-sage-100/50">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Paixão por Moda, Respeito pelo Planeta
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            O Brechó da Luli é mais do que uma loja, é um convite para um consumo mais consciente e estiloso. Cada peça é escolhida a dedo, trazendo qualidade e personalidade para o seu guarda-roupa.
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-2 rounded-full"><Heart className="w-5 h-5 text-purple-600" /></div>
              <div>
                <h4 className="font-semibold">Curadoria Especial</h4>
                <p className="text-gray-500">Garimpos únicos que contam histórias e definem estilos.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-2 rounded-full"><Recycle className="w-5 h-5 text-green-600" /></div>
              <div>
                <h4 className="font-semibold">Sustentabilidade</h4>
                <p className="text-gray-500">Dando nova vida a peças incríveis e reduzindo o impacto ambiental.</p>
              </div>
            </div>
          </div>
          <Link to={createPageUrl("Sobre")}>
            <Button size="lg">
              Conheça nossa história <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="h-96"
        >
          <img 
            src="https://images.unsplash.com/photo-1524638431109-93d95c968f03?q=80&w=2592&auto=format&fit=crop" 
            alt="Mulher sorrindo em uma loja de roupas" 
            className="w-full h-full object-cover rounded-2xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}