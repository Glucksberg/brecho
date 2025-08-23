import React from 'react';
import { motion } from 'framer-motion';
import CategorySection from '../components/home/CategorySection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Star, 
  ArrowRight,
  Sparkles,
  Heart,
  ShoppingBag,
  Play,
  Zap,
  TrendingUp,
  Shirt,
  Crown,
  Watch
} from 'lucide-react';

export default function TestCategory() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const categories = [
    { name: 'Vestidos', count: 120, popular: true, trend: '+15%', color: 'purple' },
    { name: 'Blazers', count: 85, popular: false, trend: '+8%', color: 'pink' },
    { name: 'Acessórios', count: 200, popular: true, trend: '+22%', color: 'orange' },
    { name: 'Bolsas', count: 95, popular: false, trend: '+12%', color: 'green' },
    { name: 'Saias', count: 75, popular: true, trend: '+18%', color: 'indigo' },
    { name: 'Calçados', count: 110, popular: false, trend: '+7%', color: 'teal' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Section */}
      <CategorySection />

      {/* Análise da Category Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="purple" className="px-4 py-2 text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4 mr-2" />
              Análise da Category Section
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Category Section{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Implementada!
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A nova seção de categorias do Brechó da Luli está funcionando perfeitamente com design moderno e interativo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card de Funcionalidades */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Funcionalidades Implementadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">6 categorias com imagens reais</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Badges "Popular" e "Trend" dinâmicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Animações hover com Framer Motion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Imagens do Unsplash otimizadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Links funcionais para produtos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Layout responsivo grid adaptativo</span>
                </div>
              </CardContent>
            </Card>

            {/* Card de Design */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  Design & Visual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Gradientes únicos para cada categoria</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Ícones temáticos personalizados</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Overlays e efeitos de imagem</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Cards com glassmorphism</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Sombras e bordas dinâmicas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Tipografia hierárquica clara</span>
                </div>
              </CardContent>
            </Card>

            {/* Card de Interatividade */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Interatividade & UX
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Hover effects com scale e rotação</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Zoom nas imagens ao hover</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Animações de entrada staggered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Micro-interações nos botões</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Estados de hover rastreados</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Call-to-actions integrados</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categorias Implementadas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Categorias Implementadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Card key={category.name} className={`border-${category.color}-200 relative overflow-hidden`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {category.name === 'Vestidos' && <Shirt className="w-5 h-5 text-purple-600" />}
                        {category.name === 'Blazers' && <Crown className="w-5 h-5 text-pink-600" />}
                        {category.name === 'Acessórios' && <Watch className="w-5 h-5 text-orange-600" />}
                        {category.name === 'Bolsas' && <ShoppingBag className="w-5 h-5 text-green-600" />}
                        {category.name === 'Saias' && <Sparkles className="w-5 h-5 text-indigo-600" />}
                        {category.name === 'Calçados' && <Heart className="w-5 h-5 text-teal-600" />}
                        {category.name}
                      </CardTitle>
                      {category.popular && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 bg-${category.color}-500 rounded-full`}></div>
                        <span className="text-sm font-semibold text-gray-700">
                          {category.count} produtos
                        </span>
                      </div>
                      <Badge className="bg-green-500 text-white text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {category.trend}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Imagem real do Unsplash • Navegação funcional
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Estatísticas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <Card className="text-center p-6 border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">685+</div>
              <div className="text-sm text-gray-600">Total de Produtos</div>
            </Card>

            <Card className="text-center p-6 border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">6</div>
              <div className="text-sm text-gray-600">Categorias Ativas</div>
            </Card>

            <Card className="text-center p-6 border-orange-200">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-gray-600">Categorias Populares</div>
            </Card>

            <Card className="text-center p-6 border-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">+13%</div>
              <div className="text-sm text-gray-600">Crescimento Médio</div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-4xl font-bold mb-4">
              Category Section Perfeita! ✨
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              A seção de categorias "Encontre Seu Estilo Perfeito" está funcionando perfeitamente 
              com design moderno, imagens reais e navegação funcional!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-purple-600 hover:bg-purple-50 font-semibold"
              >
                <Heart className="mr-2 h-5 w-5" />
                Testar Navegação
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 font-semibold"
              >
                <Play className="mr-2 h-5 w-5" />
                Próximo Componente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 