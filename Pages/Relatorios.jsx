import React, { useState, useEffect } from "react";
import { Produto } from "@/entities/Produto";
import { Venda } from "@/entities/Venda";
import { Cliente } from "@/entities/Cliente";
import { BarChart3, TrendingUp, Calendar, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

import SalesReport from "../components/reports/SalesReport";
import StockReport from "../components/reports/StockReport";
import MovementReport from "../components/reports/MovementReport";
import PerformanceMetrics from "../components/reports/PerformanceMetrics";

export default function Relatorios() {
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("30");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [produtosData, vendasData, clientesData] = await Promise.all([
        Produto.list('-created_date'),
        Venda.list('-created_date'),
        Cliente.list('-created_date')
      ]);
      setProdutos(produtosData);
      setVendas(vendasData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    const today = new Date();
    const daysAgo = new Date(today.getTime() - (parseInt(dateFilter) * 24 * 60 * 60 * 1000));
    
    return {
      vendas: vendas.filter(v => new Date(v.created_date) >= daysAgo),
      produtos,
      clientes
    };
  };

  const exportData = async (type) => {
    const { vendas: filteredVendas } = getFilteredData();
    
    let exportData = [];
    let filename = '';
    
    switch (type) {
      case 'vendas':
        exportData = filteredVendas.map(venda => ({
          'Data': new Date(venda.created_date).toLocaleDateString('pt-BR'),
          'Produto': venda.produto_nome,
          'Cliente': venda.cliente_nome || 'Não informado',
          'Valor': `R$ ${venda.valor_venda.toFixed(2)}`,
          'Desconto': `R$ ${venda.desconto.toFixed(2)}`,
          'Pagamento': venda.forma_pagamento,
          'Observações': venda.observacoes || ''
        }));
        filename = `vendas_${dateFilter}dias.csv`;
        break;
      case 'estoque':
        exportData = produtos.map(produto => ({
          'Nome': produto.nome,
          'Categoria': produto.categoria?.replace(/_/g, ' '),
          'Status': produto.status,
          'Preço Venda': `R$ ${produto.preco_venda?.toFixed(2)}`,
          'Preço Compra': `R$ ${produto.preco_compra?.toFixed(2) || '0.00'}`,
          'Margem': produto.preco_compra ? `${(((produto.preco_venda - produto.preco_compra) / produto.preco_compra) * 100).toFixed(1)}%` : 'N/A',
          'Condição': produto.condicao,
          'Código': produto.codigo
        }));
        filename = 'estoque_atual.csv';
        break;
    }

    if (exportData.length > 0) {
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{ background: 'linear-gradient(135deg, #f8faf8 0%, #faf9f7 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Relatórios e Métricas
              </h1>
              <p className="text-sage-600">Análise completa do seu negócio</p>
            </div>
            <div className="flex gap-3">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        <PerformanceMetrics data={filteredData} />

        <Tabs defaultValue="vendas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-sage-100/50">
            <TabsTrigger value="vendas" className="data-[state=active]:bg-sage-100 data-[state=active]:text-sage-700">
              Relatório de Vendas
            </TabsTrigger>
            <TabsTrigger value="estoque" className="data-[state=active]:bg-sage-100 data-[state=active]:text-sage-700">
              Relatório de Estoque
            </TabsTrigger>
            <TabsTrigger value="movimento" className="data-[state=active]:bg-sage-100 data-[state=active]:text-sage-700">
              Movimentação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vendas">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={() => exportData('vendas')}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar Vendas
              </Button>
            </div>
            <SalesReport vendas={filteredData.vendas} loading={loading} />
          </TabsContent>

          <TabsContent value="estoque">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={() => exportData('estoque')}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar Estoque
              </Button>
            </div>
            <StockReport produtos={produtos} loading={loading} />
          </TabsContent>

          <TabsContent value="movimento">
            <MovementReport data={filteredData} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}