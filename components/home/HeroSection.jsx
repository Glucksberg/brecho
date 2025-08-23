import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, ShoppingBag, ArrowRight, Play, Star, Shirt, Crown, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createPageUrl } from '@/utils';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const slides = [
    {
      title: "Moda que Reconta",
      subtitle: "Histórias",
      description: "Cada peça do nosso brechó carrega memórias e está pronta para criar novas histórias com você.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      badge: "✨ Peças Únicas"
    },
    {
      title: "Sustentabilidade",
      subtitle: "em Cada Look",
      description: "Moda consciente que preserva o planeta e valoriza a individualidade de cada pessoa.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      badge: "🌱 Eco-Friendly"
    },
    {
      title: "Estilo Atemporal",
      subtitle: "Preços Justos",
      description: "Qualidade premium de marcas renomadas com preços que cabem no seu bolso.",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      badge: "👑 Premium"
    }
  ];

  const stats = [
    { icon: Shirt, label: 'Peças Exclusivas', value: '500+', color: 'from-purple-500 to-purple-600' },
    { icon: Heart, label: 'Clientes Apaixonados', value: '1.2K+', color: 'from-pink-500 to-pink-600' },
    { icon: Crown, label: 'Marcas Premium', value: '50+', color: 'from-orange-500 to-orange-600' },
    { icon: Leaf, label: 'Impacto Sustentável', value: '100%', color: 'from-green-500 to-green-600' }
  ];

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background com gradiente dinâmico */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo Textual */}
          <motion.div
            className="text-center lg:text-left"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {/* Badge Dinâmico */}
            <motion.div variants={fadeInUp} className="mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge variant="purple" className="px-6 py-2 text-sm font-medium shadow-lg">
                    {slides[currentSlide].badge}
                  </Badge>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Título Principal Dinâmico */}
            <motion.div variants={fadeInUp} className="mb-6">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentSlide}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
                >
                  <span className="block text-gray-900 mb-2">
                    {slides[currentSlide].title}
                  </span>
                  <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    {slides[currentSlide].subtitle}
                  </span>
                </motion.h1>
              </AnimatePresence>
            </motion.div>

            {/* Descrição Dinâmica */}
            <motion.div variants={fadeInUp} className="mb-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                >
                  {slides[currentSlide].description}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Botões de Ação */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Link to={createPageUrl("Produtos")}>
                <Button 
                  size="xl" 
                  className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Explorar Coleção
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={createPageUrl("Sobre")}>
                <Button 
                  size="xl" 
                  variant="outline"
                  className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Nossa História
                </Button>
              </Link>
            </motion.div>

            {/* Indicadores de Slide */}
            <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start gap-3 mb-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-purple-600 w-8' 
                      : 'bg-purple-200 hover:bg-purple-300'
                  }`}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Imagem Dinâmica */}
          <motion.div
            variants={fadeInUp}
            className="relative"
          >
            <div className="relative w-full h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Overlay com efeito */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              
              {/* Elemento flutuante */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
              >
                <Sparkles className="w-6 h-6 text-purple-600" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Estatísticas */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:bg-white/95 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className={`inline-flex p-3 bg-gradient-to-br ${stat.color} rounded-xl mb-4 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action Especial */}
        <motion.div
          variants={fadeInUp}
          className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-1 shadow-2xl"
        >
          <div className="bg-white rounded-3xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Primeira compra com <span className="text-purple-600">15% OFF</span>
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
              Use o código <Badge variant="purple" className="mx-1 font-mono">WELCOME15</Badge> e ganhe desconto especial. 
              Válido para qualquer peça da nossa coleção exclusiva.
            </p>
            <Link to={createPageUrl("Produtos")}>
              <Button 
                size="xl" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Usar Desconto Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 