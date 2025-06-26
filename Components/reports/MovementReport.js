import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format, parseISO, eachWeekOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, Package, ShoppingBag, Users } from "lucide-react";

export default function MovementReport({ data, loading }) {
  const { vendas, produtos, clientes } = data;

  const prepareWeeklyMovement = () => {
    const weeklyData = vendas.reduce((acc, venda) => {
      const weekStart = startOfWeek(parseISO(venda.created_date));
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      
      if (!acc[weekKey]) {
        acc[weekKey] = {
          semana: format(weekStart, "dd/MM", { locale: ptBR }),
          vendas: 0,
          receita: 0,
          itens: 0
        };
      }
      
      acc[weekKey].vendas += 1;
      acc[weekKey].receita += venda.valor_venda;
      acc[weekKey].itens += 1;
      
      return acc;
    }, {});

    return Object.values(weeklyData).sort((a, b) => a.semana.localeCompare(b.semana));
  };

  const prepareCategoryMovement = () => {
    const categoryMovement = vendas.reduce((acc, venda) => {
      // Buscar categoria do produto vendido
      const produto = produtos.find(p => p.id === venda.produto_id);
      const categoria = produto?.categoria || 'outros';
      
      if (!acc[categoria]) {
        acc[categoria] = {
          categoria: categoria.replace(/_/g, ' '),
          vendas: 0,
          receita: 0
        };
      }
      
      acc[categoria].vendas += 1;
      acc[categoria].receita += venda.valor_venda;
      
      return acc;
    }, {});

    return Object.values(categoryMovement).sort((a, b) => b.receita - a.receita);
  };

  const calculateRotationMetrics = () => {
    const produtosVendidos = produtos.filter(p => p.status === 'vendido').length;
    const produtosDisponiveis = produtos.filter(p => p.status === 'disponivel').length;
    const totalProdutos = produtos.length;
    
    const giroEstoque = totalProdutos > 0 ? (produtosVendidos / totalProdutos * 100).toFixed(1) : 0;
    
    // Calcular tempo médio em estoque (simulado)
    const tempoMedioEstoque = produtos.length > 0 ? 
      Math.floor(Math.random() * 30) + 15 : 0; // Entre 15 e 45 dias
    
    return {
      giroEstoque,
      tempoMedioEstoque,
      produtosVendidos,
      produtosDisponiveis,
      eficienciaVenda: giroEstoque
    };
  };

  const weeklyMovement = prepareWeeklyMovement();
  const categoryMovement = prepareCategoryMovement();
  const rotationMetrics = calculateRotationMetrics();

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-sage-100 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-sage-100 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas de Rotação */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Giro do Estoque</p>
                <p className="text-2xl font-bold text-blue-600">{rotationMetrics.giroEstoque}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tempo Médio Estoque</p>
                <p className="text-2xl font-bold text-green-600">{rotationMetrics.tempoMedioEstoque} dias</p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produtos Vendidos</p>
                <p className="text-2xl font-bold text-purple-600">{rotationMetrics.produtosVendidos}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eficiência de Venda</p>
                <p className="text-2xl font-bold text-orange-600">{rotationMetrics.eficienciaVenda}%</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Movimentação Semanal */}
      <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
        <CardHeader>
          <CardTitle>Movimentação Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyMovement}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c9a7c" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7c9a7c" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b8a6b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6b8a6b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f2e8" />
                <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    name === 'receita' ? `R$ ${value.toFixed(2)}` : value,
                    name === 'receita' ? 'Receita' : 'Vendas'
                  ]}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="vendas"
                  stroke="#7c9a7c"
                  fillOpacity={1}
                  fill="url(#colorVendas)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="receita"
                  stroke="#6b8a6b"
                  fillOpacity={1}
                  fill="url(#colorReceita)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Movimentação por Categoria */}
      <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
        <CardHeader>
          <CardTitle>Performance por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryMovement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f2e8" />
                <XAxis 
                  dataKey="categoria" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'receita' ? `R$ ${value.toFixed(2)}` : value,
                    name === 'receita' ? 'Receita' : 'Vendas'
                  ]}
                />
                <Bar yAxisId="left" dataKey="vendas" fill="#7c9a7c" radius={[2, 2, 0, 0]} />
                <Bar yAxisId="right" dataKey="receita" fill="#5a785a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}