import React, { useState, useEffect } from "react";
import { Venda } from "@/entities/Venda";
import { Produto } from "@/entities/Produto";
import { Cliente } from "@/entities/Cliente";
import { Plus, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import SaleForm from "../components/sales/SaleForm";
import SalesList from "../components/sales/SalesList";
import SalesStats from "../components/sales/SalesStats";

export default function Vendas() {
  const [vendas, setVendas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preSelectedProduct, setPreSelectedProduct] = useState(null);

  useEffect(() => {
    loadData();
    
    // Verificar se há produto pré-selecionado na URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('produto');
    if (productId) {
      setPreSelectedProduct(productId);
      setShowForm(true);
    }
  }, []);

  const loadData = async () => {
    try {
      const [vendasData, produtosData, clientesData] = await Promise.all([
        Venda.list('-created_date'),
        Produto.filter({ status: 'disponivel' }, '-created_date'),
        Cliente.list()
      ]);
      setVendas(vendasData);
      setProdutos(produtosData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSale = async (saleData) => {
    try {
      await Venda.create(saleData);
      await Produto.update(saleData.produto_id, { status: 'vendido' });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
    }
  };

  const calculateStats = () => {
    const today = new Date();
    const thisMonth = vendas.filter(v => {
      const saleDate = new Date(v.created_date);
      return saleDate.getMonth() === today.getMonth() && 
             saleDate.getFullYear() === today.getFullYear();
    });

    return {
      totalVendas: vendas.length,
      vendasMes: thisMonth.length,
      receitaTotal: vendas.reduce((sum, v) => sum + (v.valor_venda || 0), 0),
      receitaMes: thisMonth.reduce((sum, v) => sum + (v.valor_venda || 0), 0),
    };
  };

  const stats = calculateStats();

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{ background: 'linear-gradient(135deg, #f8faf8 0%, #faf9f7 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Vendas
            </h1>
            <p className="text-sage-600">
              Registre vendas e acompanhe o desempenho
            </p>
            {preSelectedProduct && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-700 text-sm">
                  ✨ Produto pré-selecionado para venda rápida
                </p>
              </div>
            )}
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md"
            disabled={produtos.length === 0}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Venda
          </Button>
        </motion.div>

        <SalesStats stats={stats} />

        <AnimatePresence>
          {showForm && (
            <SaleForm
              produtos={produtos}
              clientes={clientes}
              preSelectedProductId={preSelectedProduct}
              onSubmit={handleSale}
              onCancel={() => {
                setShowForm(false);
                setPreSelectedProduct(null);
                window.history.replaceState({}, '', window.location.pathname);
              }}
            />
          )}
        </AnimatePresence>

        <SalesList vendas={vendas} loading={loading} />
      </div>
    </div>
  );
}