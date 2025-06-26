import React, { useState, useEffect } from "react";
import { Produto } from "@/entities/Produto";
import { User } from "@/entities/User";
import { Plus, Search, Filter, Eye, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

import ProductCard from "../components/admin/products/ProductCard";
import ProductForm from "../components/admin/products/ProductForm";
import ProductFilters from "../components/admin/products/ProductFilters";

export default function AdminProdutos() {
  const [user, setUser] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categoria: "todas",
    status: "todos",
    condicao: "todas"
  });
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
      loadProducts();
    } catch (error) {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    filterProducts();
  }, [produtos, searchTerm, filters]);

  const loadProducts = async () => {
    try {
      const data = await Produto.list('-created_date');
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = produtos;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.categoria !== "todas") {
      filtered = filtered.filter(p => p.categoria === filters.categoria);
    }

    if (filters.status !== "todos") {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.condicao !== "todas") {
      filtered = filtered.filter(p => p.condicao === filters.condicao);
    }

    setFilteredProducts(filtered);
  };

  const handleSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await Produto.update(editingProduct.id, productData);
      } else {
        await Produto.create({
          ...productData,
          codigo: `BR${Date.now()}`,
          disponivel: productData.status === 'disponivel'
        });
      }
      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await Produto.update(productId, { 
        status: newStatus,
        disponivel: newStatus === 'disponivel'
      });
      loadProducts();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
              Gestão de Produtos
            </h1>
            <p className="text-sage-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Produto
          </Button>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100/50 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nome, marca ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-sage-200 focus:border-sage-400"
              />
            </div>
          </div>
          
          <ProductFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        <AnimatePresence>
          {showForm && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-sage-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Tente ajustar os filtros ou adicione um novo produto.
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Primeiro Produto
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}