import React from "react";
import { motion } from "framer-motion";
import StatsCard from "../dashboard/StatsCard";
import { TrendingUp, ShoppingCart, DollarSign, Calendar } from "lucide-react";

export default function SalesStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total de Vendas"
        value={stats.totalVendas}
        icon={ShoppingCart}
        gradient="from-blue-500 to-blue-600"
        trend="Desde o início"
      />
      <StatsCard
        title="Vendas do Mês"
        value={stats.vendasMes}
        icon={Calendar}
        gradient="from-green-500 to-green-600"
        trend="Mês atual"
      />
      <StatsCard
        title="Receita Total"
        value={`R$ ${stats.receitaTotal.toFixed(2)}`}
        icon={DollarSign}
        gradient="from-purple-500 to-purple-600"
        trend="Todas as vendas"
      />
      <StatsCard
        title="Receita do Mês"
        value={`R$ ${stats.receitaMes.toFixed(2)}`}
        icon={TrendingUp}
        gradient="from-orange-500 to-orange-600"
        trend="Mês atual"
      />
    </div>
  );
}