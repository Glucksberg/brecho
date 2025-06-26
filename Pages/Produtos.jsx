
import React, { useState, useEffect } from "react";
import { Produto } from "@/entities/Produto";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Heart, ShoppingBag, Grid, List } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/CartContext";

import ProductGrid from "../components/produtos/ProductGrid";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categoria: "all",
    tamanho: "all",
    priceRange: "all"
  });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadProdutos();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [produtos, searchTerm, filters, sortBy]);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      const data = await Produto.filter({ disponivel: true }, '-created_date');
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let tempProdutos = [...produtos];

    if (searchTerm) {
      tempProdutos = tempProdutos.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.marca?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.categoria !== "all") {
      tempProdutos = tempProdutos.filter(p => p.categoria === filters.categoria);
    }
    
    // NOTE: Filtering by tamanho and priceRange would require more complex logic
    // For now, these are UI placeholders.

    switch (sortBy) {
      case "price-asc":
        tempProdutos.sort((a, b) => a.preco_venda - b.preco_venda);
        break;
      case "price-desc":
        tempProdutos.sort((a, b) => b.preco_venda - a.preco_venda);
        break;
      case "newest":
      default:
        tempProdutos.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        break;
    }

    setFilteredProdutos(tempProdutos);
  };

  const uniqueCategories = [...new Set(produtos.map(p => p.categoria))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">Nossa Coleção</h1>
        <p className="mt-4 text-lg text-gray-600">Peças únicas com histórias para contar. Encontre a sua.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-sage-100/50 sticky top-24">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Filter className="w-5 h-5" /> Filtros</h3>
            
            <div className="space-y-6">
              <div>
                <label className="font-semibold block mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Nome do produto..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="font-semibold block mb-2">Categoria</label>
                <Select value={filters.categoria} onValueChange={(v) => setFilters(f => ({...f, categoria: v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="font-semibold block mb-2">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mais Recentes</SelectItem>
                    <SelectItem value="price-asc">Menor Preço</SelectItem>
                    <SelectItem value="price-desc">Maior Preço</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {loading ? (
             <div className="text-center p-12">
                <p>Carregando produtos...</p>
             </div>
          ) : (
            <ProductGrid produtos={filteredProdutos} />
          )}
        </main>
      </div>
    </div>
  )
}
