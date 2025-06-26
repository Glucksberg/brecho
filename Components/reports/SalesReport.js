import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

const COLORS = ['#7c9a7c', '#e8f2e8', '#6b8a6b', '#5a785a', '#4a6a4a'];

export default function SalesReport({ vendas, loading }) {
  const prepareDailyData = () => {
    const dailyData = vendas.reduce((acc, venda) => {
      const date = format(parseISO(venda.created_date), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { date, vendas: 0, receita: 0 };
      }
      acc[date].vendas += 1;
      acc[date].receita += venda.valor_venda;
      return acc;
    }, {});

    return Object.values(dailyData)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(item => ({
        ...item,
        dataFormatada: format(new Date(item.date), 'dd/MM', { locale: ptBR })
      }));
  };

  const preparePaymentData = () => {
    const paymentData = vendas.reduce((acc, venda) => {
      const method = venda.forma_pagamento;
      if (!acc[method]) {
        acc[method] = { name: method, value: 0, count: 0 };
      }
      acc[method].value += venda.valor_venda;
      acc[method].count += 1;
      return acc;
    }, {});

    const labels = {
      dinheiro: 'Dinheiro',
      pix: 'PIX',
      cartao_debito: 'Cartão Débito',
      cartao_credito: 'Cartão Crédito'
    };

    return Object.values(paymentData).map(item => ({
      ...item,
      name: labels[item.name] || item.name
    }));
  };

  const prepareHourlyData = () => {
    const hourlyData = vendas.reduce((acc, venda) => {
      const hour = new Date(venda.created_date).getHours();
      if (!acc[hour]) {
        acc[hour] = { hora: `${hour}:00`, vendas: 0 };
      }
      acc[hour].vendas += 1;
      return acc;
    }, {});

    return Array.from({ length: 24 }, (_, i) => 
      hourlyData[i] || { hora: `${i}:00`, vendas: 0 }
    );
  };

  const dailyData = prepareDailyData();
  const paymentData = preparePaymentData();
  const hourlyData = prepareHourlyData();

  if (loading) {
    return (
      <div className="grid lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
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
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
        <CardHeader>
          <CardTitle>Vendas por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f2e8" />
                <XAxis dataKey="dataFormatada" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="vendas" fill="#7c9a7c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
        <CardHeader>
          <CardTitle>Receita Diária</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f2e8" />
                <XAxis dataKey="dataFormatada" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Receita']}
                />
                <Line 
                  type="monotone" 
                  dataKey="receita" 
                  stroke="#6b8a6b" 
                  strokeWidth={3}
                  dot={{ fill: '#6b8a6b', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
        <CardHeader>
          <CardTitle>Formas de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Valor']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50">
        <CardHeader>
          <CardTitle>Vendas por Horário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f2e8" />
                <XAxis 
                  dataKey="hora" 
                  tick={{ fontSize: 10 }}
                  interval={2}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="vendas" fill="#5a785a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}