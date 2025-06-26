
import React, { useState, useEffect } from "react";
import { Produto } from "@/entities/Produto";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, ArrowRight, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/CartContext";

import HeroSection from "../components/home/HeroSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import CategorySection from "../components/home/CategorySection";
import AboutSection from "../components/home/AboutSection";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    try {
      const data = await Produto.filter({ disponivel: true }, '-created_date', 8);
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        <FeaturedProducts produtos={produtos} loading={loading} />
        <CategorySection />
        <AboutSection />
        
        {/* Call to Action Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-4xl font-bold mb-4">
              Descubra Seu Estilo Único
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Cada peça conta uma história. Encontre a sua na nossa coleção cuidadosamente selecionada.
            </p>
            <Link to={createPageUrl("Produtos")}>
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 py-4">
                Ver Toda Coleção
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
