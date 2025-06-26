import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function PerformanceMetrics({ data }) {
  const { vendas, produtos, clientes } = data;

  const calculateMetrics = () => {
    const totalReceita = vendas.reduce((sum, v) => sum + v.valor_venda, 0);
    const totalItensVendidos = vendas.length;
    const ticketMedio = totalItensVendidos > 0 ? totalReceita / totalItensVendidos : 0;
    
    const produtosDisponiveis = produtos.filter(p => p.status === 'disponivel').length;
    const produtosVendidos = produtos.filter(p => p.status === 'vendido').length;
    const taxaVenda = produtos.length > 0 ? (produtosVendidos / produtos.length) * 100 : 0;
    
    const categorias = produtos.reduce((acc, p) => {
      acc[p.categoria] = (acc[p.categoria] || 0) + 1;
      return acc;
    }, {});
    
    const categoriaMaisVendida = Object.entries(categorias).sort(([,a], [,b]) => b - a)[0];
    
    const clientesAtivos = new Set(vendas.filter(v => v.cliente_id).map(v => v.cliente_id)).size;
    
    return {
      receita: totalReceita,
      itensVendidos: totalItensVendidos,
      ticketMedio,
      produtosDisponiveis,
      taxaVenda,
      categoriaMaisVendida: categoriaMaisVendida?.[0] || 'N/A',
      clientesAtivos
    };
  };

  const metrics = calculateMetrics();

  const metricCards = [
    {
      title: "Receita Total",
      value: `R$ ${metrics.receita.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "+12% vs período anterior"
    },
    {
      title: "Itens Vendidos",
      value: metrics.itensVendidos,
      icon: Package,
      color: "text-blue-600", 
      bgColor: "bg-blue-100",
      trend: `${metrics.produtosDisponiveis} disponíveis`
    },
    {
      title: "Ticket Médio",
      value: `R$ ${metrics.ticketMedio.toFixed(2)}`,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "Por item vendido"
    },
    {
      title: "Taxa de Venda",
      value: `${metrics.taxaVenda.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "Do estoque total"
    },
    {
      title: "Categoria Top",
      value: metrics.categoriaMaisVendida.replace(/_/g, ' '),
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      trend: "Mais popular"
    },
    {
      title: "Clientes Ativos",
      value: metrics.clientesAtivos,
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      trend: "Com compras no período"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metricCards.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{metric.trend}</p>
                </div>
                <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}