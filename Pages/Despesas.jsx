import React, { useState, useEffect } from "react";
import { Despesa } from "@/entities/Despesa";
import { Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

import DespesaForm from "../components/despesas/DespesaForm";
import DespesasList from "../components/despesas/DespesasList";
import DespesasStats from "../components/despesas/DespesasStats";

export default function Despesas() {
  const [despesas, setDespesas] = useState([]);
  const [filteredDespesas, setFilteredDespesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDespesa, setEditingDespesa] = useState(null);
  
  const [filters, setFilters] = useState({
    status: "todos",
    tipo: "todos",
    searchTerm: ""
  });

  useEffect(() => {
    loadDespesas();
  }, []);

  useEffect(() => {
    let filtered = despesas;

    if (filters.status !== "todos") {
      filtered = filtered.filter(d => d.status === filters.status);
    }
    if (filters.tipo !== "todos") {
      filtered = filtered.filter(d => d.tipo === filters.tipo);
    }
    if (filters.searchTerm) {
      filtered = filtered.filter(d => 
        d.descricao.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredDespesas(filtered);
  }, [despesas, filters]);

  const loadDespesas = async () => {
    setLoading(true);
    try {
      const data = await Despesa.list('-data_vencimento');
      setDespesas(data);
    } catch (error) {
      console.error("Erro ao carregar despesas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingDespesa) {
        await Despesa.update(editingDespesa.id, data);
      } else {
        await Despesa.create(data);
      }
      setShowForm(false);
      setEditingDespesa(null);
      loadDespesas();
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
    }
  };

  const handleEdit = (despesa) => {
    setEditingDespesa(despesa);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta despesa?")) {
      try {
        await Despesa.delete(id);
        loadDespesas();
      } catch (error) {
        console.error("Erro ao excluir despesa:", error);
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await Despesa.update(id, { status });
      loadDespesas();
    } catch (error) {
      console.error("Erro ao alterar status da despesa:", error);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

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
              Controle de Despesas
            </h1>
            <p className="text-sage-600">
              Acompanhe os custos fixos e variáveis do seu negócio.
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Despesa
          </Button>
        </motion.div>

        <DespesasStats despesas={despesas} />

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por descrição..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="paga">Pagas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.tipo} onValueChange={(v) => handleFilterChange('tipo', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="fixa">Fixas</SelectItem>
                <SelectItem value="variavel">Variáveis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <DespesaForm
              despesa={editingDespesa}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingDespesa(null);
              }}
            />
          )}
        </AnimatePresence>

        <DespesasList
          despesas={filteredDespesas}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}