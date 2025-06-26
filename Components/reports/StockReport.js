import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingUp } from "lucide-react";

const COLORS = ['#7c9a7c', '#6b8a6b', '#5a785a', '#4a6a4a', '#3a5a3a'];

export default function StockReport({ produtos, loading }) {
  const prepareCategoryData = () => {
    const categoryData = produtos.reduce((acc, produto) => {
      const categoria = produto.categoria || 'outros';
      if (!acc[categoria]) {
        acc[categoria] = {
          categoria,
          nome: categoria.replace(/_/g, ' '),
          total: 0,
          disponivel: 0,
          vendido: 0,
          reservado: 0
        };
      }
      acc[categoria].total += 1;
      acc[categoria][produto.status] += 1;
      return acc;
    }, {});

    return Object.values(categoryData);
  };

  const prepareConditionData = () => {
    const conditionData = produtos.reduce((acc, produto) => {
      const condicao = produto.condicao || 'não_informado';
      if (!acc[condicao]) {
        acc[condicao] = { name: condicao, value: 0 };
      }
      acc[condicao].value += 1;
      return acc;
    }, {});

    const labels = {
      excelente: 'Excelente',
      muito_bom: 'Muito Bom',
      bom: 'Bom',
      regular: 'Regular',
      não_informado: 'Não Informado'
    };

    return Object.values(conditionData).map(item => ({
      ...item,
      name: labels[item.name] || item.name
    }));
  };

  const calculateMargins = () => {
    return produtos
      .filter(p => p.preco_compra && p.preco_venda)
      .map(p => ({
        nome: p.nome,
        margem: ((p.preco_venda - p.preco_compra) / p.preco_compra * 100).toFixed(1),
        valor_margem: p.preco_venda - p.preco_compra
      }))
      .sort((a, b) => b.margem - a.margem)
      .slice(0, 10);
  };

  const getStockStats = () => {
    const total = produtos.length;
    const disponivel = produtos.filter(p => p.status === 'disponivel').length;
    const vendido = produtos.filter(p => p.status === 'vendido').length;
    const reservado = produtos.filter(p => p.status === 'reservado').length;
    
    const valorEstoque = produtos
      .filter(p => p.status === 'disponivel')
      .reduce((sum, p) => sum + (p.preco_venda || 0), 0);
    
    const investimento = produtos
      .reduce((sum, p) => sum + (p.preco_compra || 0), 0);

    return { total, disponivel, vendido, reservado, valorEstoque, investimento };
  };

  const categoryData = prepareCategoryData();
  const conditionData = prepareConditionData();
  const marginData = calculateMargins();
  const stockStats = getStockStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-sage-100 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-sage-100 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold text-gray-900">{stockStats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponíveis</p>
                <p className="text-2xl font-bold text-green-600">{stockStats.disponivel}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor do Estoque</p>
                <p className="text-2xl font-bold text-purple-600">R$ {stockStats.valorEstoque.toFixed(2)}</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Investimento Total</p>
                <p className="text-2xl font-bold text-orange-600">R$ {stockStats.investimento.toFixed(2)}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
          <CardHeader>
            <CardTitle>Produtos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8f2e8" />
                  <XAxis 
                    dataKey="nome" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#7c9a7c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
          <CardHeader>
            <CardTitle>Condição dos Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conditionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {conditionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Margens */}
      <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
        <CardHeader>
          <CardTitle>Top 10 - Maiores Margens de Lucro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {marginData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-sage-50/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.nome}</p>
                  <p className="text-sm text-gray-600">Margem: R$ {item.valor_margem.toFixed(2)}</p>
                </div>
                <Badge 
                  className={`${
                    parseFloat(item.margem) > 100 ? 'bg-green-100 text-green-800' :
                    parseFloat(item.margem) > 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {item.margem}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}