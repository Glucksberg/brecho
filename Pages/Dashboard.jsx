import React, { useState, useEffect } from "react";
import { Produto } from "@/entities/Produto";
import { Venda } from "@/entities/Venda";
import { User } from "@/entities/User";
import { TrendingUp, Package, DollarSign, ShoppingCart, AlertCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

import StatsCard from "../components/dashboard/StatsCard";
import RecentSales from "../components/dashboard/RecentSales";
import ProductsOverview from "../components/dashboard/ProductsOverview";
import CategoryChart from "../components/dashboard/CategoryChart";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      if (currentUser.role !== 'admin') {
        window.location.href = '/';
        return;
      }
      setUser(currentUser);
      loadData();
    } catch (error) {
      // Usuário não autenticado, redirecionar para home
      window.location.href = '/';
    }
  };

  const loadData = async () => {
    try {
      const [produtosData, vendasData] = await Promise.all([
        Produto.list('-created_date'),
        Venda.list('-created_date', 10)
      ]);
      setProdutos(produtosData);
      setVendas(vendasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const stats = {
    totalProdutos: produtos.length,
    produtosDisponiveis: produtos.filter(p => p.status === 'disponivel').length,
    totalVendas: vendas.length,
    receitaTotal: vendas.reduce((sum, v) => sum + (v.valor_venda || 0), 0),
    produtosBaixoEstoque: produtos.filter(p => p.status === 'disponivel').length < 5,
  };

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{ background: 'linear-gradient(135deg, #f8faf8 0%, #faf9f7 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Dashboard - Brechó da Luli
          </h1>
          <p className="text-sage-600 text-lg">Visão geral do seu negócio</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Produtos"
            value={stats.totalProdutos}
            icon={Package}
            gradient="from-blue-500 to-blue-600"
            trend={`${stats.produtosDisponiveis} disponíveis`}
          />
          <StatsCard
            title="Vendas do Mês"
            value={stats.totalVendas}
            icon={ShoppingCart}
            gradient="from-green-500 to-green-600"
            trend="Este mês"
          />
          <StatsCard
            title="Receita Total"
            value={`R$ ${stats.receitaTotal.toFixed(2)}`}
            icon={DollarSign}
            gradient="from-purple-500 to-purple-600"
            trend="Todas as vendas"
          />
          <StatsCard
            title="Estoque Baixo"
            value={stats.produtosBaixoEstoque ? "Atenção" : "OK"}
            icon={AlertCircle}
            gradient={stats.produtosBaixoEstoque ? "from-red-500 to-red-600" : "from-sage-500 to-sage-600"}
            trend={`${stats.produtosDisponiveis} itens`}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <RecentSales vendas={vendas} loading={loading} />
            <CategoryChart produtos={produtos} />
          </div>
          
          <div>
            <ProductsOverview produtos={produtos} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}