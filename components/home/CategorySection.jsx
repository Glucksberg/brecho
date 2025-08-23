import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Shirt, 
  Watch, 
  ShoppingBag, 
  Crown,
  Heart,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createPageUrl } from '@/utils';

const CategorySection = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    {
      id: 'vestidos',
      name: 'Vestidos',
      count: 120,
      description: 'Peças únicas para ocasiões especiais',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: Shirt,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      popular: true,
      trend: '+15%'
    },
    {
      id: 'blazers',
      name: 'Blazers',
      count: 85,
      description: 'Elegância profissional e casual',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: Crown,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      popular: false,
      trend: '+8%'
    },
    {
      id: 'acessorios',
      name: 'Acessórios',
      count: 200,
      description: 'Detalhes que fazem a diferença',
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: Watch,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      popular: true,
      trend: '+22%'
    },
    {
      id: 'bolsas',
      name: 'Bolsas',
      count: 95,
      description: 'Estilo e funcionalidade em cada peça',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: ShoppingBag,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      popular: false,
      trend: '+12%'
    },
    {
      id: 'saias',
      name: 'Saias',
      count: 75,
      description: 'Feminilidade e versatilidade',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: Sparkles,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      popular: true,
      trend: '+18%'
    },
    {
      id: 'calcados',
      name: 'Calçados',
      count: 110,
      description: 'Conforto e estilo para seus pés',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: Heart,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      popular: false,
      trend: '+7%'
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleOnHover = {
    hover: { scale: 1.05, y: -5 },
    tap: { scale: 0.98 }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <Badge variant="purple" className="px-4 py-2 text-sm font-medium shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Explore por Categoria
            </Badge>
          </motion.div>
          
          <motion.h2
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Encontre Seu{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Estilo Perfeito
            </span>
          </motion.h2>
          
          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Navegue por nossas categorias cuidadosamente organizadas e descubra 
            peças que combinam perfeitamente com sua personalidade.
          </motion.p>

          {/* Estatísticas rápidas */}
          <motion.div
            variants={fadeInUp}
            className="flex justify-center items-center gap-8 mt-8"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600 font-medium">
                <span className="text-green-600 font-bold">685+</span> produtos disponíveis
              </span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-600 font-medium">Novos itens semanalmente</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                variants={fadeInUp}
                whileHover="hover"
                whileTap="tap"
                transition={{ duration: 0.3 }}
                onHoverStart={() => setHoveredCategory(category.id)}
                onHoverEnd={() => setHoveredCategory(null)}
              >
                <Link to={createPageUrl(`Produtos?categoria=${category.id}`)}>
                  <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                    {/* Background Image */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        variants={scaleOnHover}
                      />
                      
                      {/* Overlay gradiente */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent`}></div>
                      
                      {/* Badge Popular */}
                      {category.popular && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className="absolute top-4 right-4"
                        >
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow-lg">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        </motion.div>
                      )}

                      {/* Trend Badge */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                        className="absolute top-4 left-4"
                      >
                        <Badge className="bg-green-500 text-white font-semibold shadow-lg">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {category.trend}
                        </Badge>
                      </motion.div>

                      {/* Icon flutuante */}
                      <motion.div
                        className={`absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {category.name}
                        </h3>
                        <motion.div
                          animate={{ x: hoveredCategory === category.id ? 5 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        </motion.div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 bg-gradient-to-r ${category.color} rounded-full`}></div>
                          <span className="text-sm font-semibold text-gray-700">
                            {category.count} produtos
                          </span>
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`px-3 py-1 ${category.bgColor} ${category.textColor} rounded-full text-xs font-semibold`}
                        >
                          Ver todos
                        </motion.div>
                      </div>
                    </CardContent>

                    {/* Hover Effect Border */}
                    <motion.div
                      className="absolute inset-0 border-2 border-transparent group-hover:border-purple-300 rounded-lg transition-colors duration-300"
                      initial={false}
                    />
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-3xl p-8">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Não encontrou o que procura?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Explore nosso catálogo completo com centenas de peças únicas ou entre em contato 
                para encontrarmos exatamente o que você está buscando.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("Produtos")}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Ver Todos os Produtos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to={createPageUrl("Sobre")}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Fale Conosco
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection; 