import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Filter, SortAsc, SortDesc, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import ProductCard, { ProductCardList } from './ProductCard';
import ProductFilters from './ProductFilters';

const ProductGrid = ({
  produtos = [],
  loading = false,
  title = "Produtos",
  showFilters = true,
  showSort = true,
  showViewToggle = true,
  itemsPerPage = 12,
  onProductView,
  className = ""
}) => {
  const [view, setView] = useState('grid'); // 'grid' ou 'list'
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    categoria: '',
    precoMin: '',
    precoMax: '',
    tamanhos: [],
    cores: [],
    marcas: [],
    condicao: '',
    genero: '',
    ordenacao: 'mais-recentes'
  });

  // Filtrar produtos baseado nos filtros aplicados
  const produtosFiltrados = useMemo(() => {
    let filtered = [...produtos];

    // Filtro de busca
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(produto =>
        produto.nome.toLowerCase().includes(searchTerm) ||
        produto.descricao.toLowerCase().includes(searchTerm) ||
        produto.marca.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro de categoria
    if (filters.categoria) {
      filtered = filtered.filter(produto => produto.categoria === filters.categoria);
    }

    // Filtro de preço
    if (filters.precoMin) {
      filtered = filtered.filter(produto => produto.preco >= parseFloat(filters.precoMin));
    }
    if (filters.precoMax) {
      filtered = filtered.filter(produto => produto.preco <= parseFloat(filters.precoMax));
    }

    // Filtros de array (tamanhos, cores, marcas)
    if (filters.tamanhos.length > 0) {
      filtered = filtered.filter(produto => filters.tamanhos.includes(produto.tamanho));
    }
    if (filters.cores.length > 0) {
      filtered = filtered.filter(produto => filters.cores.includes(produto.cor));
    }
    if (filters.marcas.length > 0) {
      filtered = filtered.filter(produto => filters.marcas.includes(produto.marca));
    }

    // Filtros de seleção única
    if (filters.condicao) {
      filtered = filtered.filter(produto => produto.condicao === filters.condicao);
    }
    if (filters.genero) {
      filtered = filtered.filter(produto => produto.genero === filters.genero);
    }

    // Ordenação
    switch (filters.ordenacao) {
      case 'menor-preco':
        filtered.sort((a, b) => a.preco - b.preco);
        break;
      case 'maior-preco':
        filtered.sort((a, b) => b.preco - a.preco);
        break;
      case 'a-z':
        filtered.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'z-a':
        filtered.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 'mais-recentes':
      default:
        filtered.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
        break;
    }

    return filtered;
  }, [produtos, filters]);

  // Paginação
  const totalItems = produtosFiltrados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const produtosPaginados = produtosFiltrados.slice(startIndex, startIndex + itemsPerPage);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset para primeira página
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll para o topo da grade
    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getGridClasses = () => {
    switch (view) {
      case 'list':
        return 'grid grid-cols-1 gap-4';
      case 'grid':
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
    }
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Skeleton do cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton dos produtos */}
        <div className={getGridClasses()}>
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="product-grid" className={`space-y-6 ${className}`}>
      {/* Filtros */}
      {showFilters && (
        <AnimatePresence>
          {showFiltersPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductFilters
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-600">
            ({totalItems} {totalItems === 1 ? 'produto' : 'produtos'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filtros Toggle */}
          {showFilters && (
            <Button
              variant="outline"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={showFiltersPanel ? 'bg-purple-50 text-purple-700' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          )}

          {/* Ordenação Rápida */}
          {showSort && (
            <Select
              value={filters.ordenacao}
              onChange={(e) => handleFiltersChange({ ...filters, ordenacao: e.target.value })}
              className="min-w-[140px]"
            >
              <option value="mais-recentes">Mais Recentes</option>
              <option value="menor-preco">Menor Preço</option>
              <option value="maior-preco">Maior Preço</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </Select>
          )}

          {/* Toggle de Vista */}
          {showViewToggle && (
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('grid')}
                className="rounded-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Grade de Produtos */}
      <AnimatePresence mode="wait">
        {produtosPaginados.length > 0 ? (
          <motion.div
            key={`${view}-${currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={getGridClasses()}
          >
            {produtosPaginados.map((produto, index) => (
              <motion.div
                key={produto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {view === 'list' ? (
                  <ProductCardList
                    produto={produto}
                    onView={onProductView}
                  />
                ) : (
                  <ProductCard
                    produto={produto}
                    onView={onProductView}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Filter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros ou remover alguns termos de busca
            </p>
            <Button
              variant="outline"
              onClick={() => setFilters({
                search: '',
                categoria: '',
                precoMin: '',
                precoMax: '',
                tamanhos: [],
                cores: [],
                marcas: [],
                condicao: '',
                genero: '',
                ordenacao: 'mais-recentes'
              })}
            >
              Limpar Filtros
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;
              
              // Mostrar apenas algumas páginas ao redor da atual
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <Button
                    key={page}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={isActive ? 'bg-purple-600' : ''}
                  >
                    {page}
                  </Button>
                );
              } else if (
                page === currentPage - 3 ||
                page === currentPage + 3
              ) {
                return <span key={page} className="px-2 text-gray-400">...</span>;
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
};

// Variações específicas do ProductGrid
export const FeaturedProductGrid = ({ produtos, ...props }) => (
  <ProductGrid
    produtos={produtos.filter(p => p.destaque)}
    title="Produtos em Destaque"
    showFilters={false}
    itemsPerPage={8}
    {...props}
  />
);

export const CategoryProductGrid = ({ produtos, categoria, ...props }) => (
  <ProductGrid
    produtos={produtos.filter(p => p.categoria === categoria)}
    title={`Produtos - ${categoria}`}
    {...props}
  />
);

export const CompactProductGrid = ({ produtos, ...props }) => (
  <ProductGrid
    produtos={produtos}
    showFilters={false}
    showSort={false}
    showViewToggle={false}
    itemsPerPage={6}
    {...props}
  />
);

export default ProductGrid; 