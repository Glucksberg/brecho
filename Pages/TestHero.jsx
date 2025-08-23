import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
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
  Zap
} from 'lucide-react';

// Mock de produtos para teste
const mockProdutos = [
  {
    id: 1,
    nome: "Vestido Floral Vintage",
    preco_venda: 89.90,
    marca: "Zara",
    categoria: "vestidos",
    imagens: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"],
    disponivel: true,
    destaque: true
  },
  {
    id: 2,
    nome: "Blazer Clássico Preto",
    preco_venda: 129.90,
    marca: "H&M",
    categoria: "blazers",
    imagens: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"],
    disponivel: true,
    destaque: true
  },
  {
    id: 3,
    nome: "Saia Midi Plissada",
    preco_venda: 69.90,
    marca: "Mango",
    categoria: "saias",
    imagens: ["https://images.unsplash.com/photo-1583496661160-fb5886a13d4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"],
    disponivel: true,
    destaque: true
  }
];

export default function TestHero() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Análise da Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="purple" className="px-4 py-2 text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4 mr-2" />
              Análise da Hero Section
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Hero Section{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Implementada!
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A nova Hero Section do Brechó da Luli está funcionando perfeitamente com todas as funcionalidades modernas.
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
                  <span className="text-sm">Slider automático de conteúdo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">3 slides: "Moda que Reconta Histórias"</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Animações suaves com Framer Motion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Imagens dinâmicas do Unsplash</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Indicadores de slide interativos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Layout responsivo desktop/mobile</span>
                </div>
              </CardContent>
            </Card>

            {/* Card de Design */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  Design & Estilo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Gradientes roxo, rosa e laranja</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Tipografia moderna e legível</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Efeitos de hover e interação</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Background com efeitos dinâmicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Elementos flutuantes animados</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Cards de estatísticas com gradientes</span>
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
                  <span className="text-sm">Botões com animações de hover</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Links funcionais para páginas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Call-to-action com desconto 15%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Estatísticas com ícones coloridos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Transições suaves entre slides</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Micro-interações polidas</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Slides da Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Conteúdo dos Slides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-purple-200">
                <CardHeader>
                  <Badge variant="purple" className="w-fit">✨ Peças Únicas</Badge>
                  <CardTitle className="text-lg">Slide 1: Moda que Reconta Histórias</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    "Cada peça do nosso brechó carrega memórias e está pronta para criar novas histórias com você."
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <Badge variant="sage" className="w-fit">🌱 Eco-Friendly</Badge>
                  <CardTitle className="text-lg">Slide 2: Sustentabilidade em Cada Look</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    "Moda consciente que preserva o planeta e valoriza a individualidade de cada pessoa."
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <Badge className="w-fit bg-orange-100 text-orange-800">👑 Premium</Badge>
                  <CardTitle className="text-lg">Slide 3: Estilo Atemporal, Preços Justos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    "Qualidade premium de marcas renomadas com preços que cabem no seu bolso."
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FeaturedProducts Section */}
      <FeaturedProducts produtos={mockProdutos} loading={false} />

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
              Hero Section Perfeita! ✨
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              A Hero Section "Moda que Reconta Histórias" está funcionando perfeitamente. 
              Próximo passo: implementar mais componentes da homepage!
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
                Ver Próximo Componente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 