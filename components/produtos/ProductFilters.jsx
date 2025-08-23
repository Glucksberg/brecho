import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProductFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    categoria: initialFilters.categoria || '',
    precoMin: initialFilters.precoMin || '',
    precoMax: initialFilters.precoMax || '',
    tamanhos: initialFilters.tamanhos || [],
    cores: initialFilters.cores || [],
    marcas: initialFilters.marcas || [],
    condicao: initialFilters.condicao || '',
    genero: initialFilters.genero || '',
    ordenacao: initialFilters.ordenacao || 'mais-recentes'
  });

  // Opções disponíveis
  const categorias = [
    'Roupas',
    'Acessórios', 
    'Calçados',
    'Bolsas',
    'Joias',
    'Perfumes'
  ];

  const tamanhos = ['PP', 'P', 'M', 'G', 'GG', 'XGG', '36', '38', '40', '42', '44', '46'];
  
  const cores = [
    'Azul', 'Preto', 'Branco', 'Vermelho', 'Verde', 'Rosa', 
    'Amarelo', 'Roxo', 'Marrom', 'Cinza', 'Bege', 'Laranja'
  ];

  const marcas = [
    'Farm', 'Zara', 'H&M', 'Renner', 'C&A', 'Riachuelo',
    'Forever 21', 'Shoulder', 'Amissima', 'Hering'
  ];

  const condicoes = [
    { value: 'novo', label: 'Novo' },
    { value: 'seminovo', label: 'Semi-novo' },
    { value: 'usado', label: 'Usado' }
  ];

  const generos = [
    { value: 'feminino', label: 'Feminino' },
    { value: 'masculino', label: 'Masculino' },
    { value: 'unissex', label: 'Unissex' },
    { value: 'infantil', label: 'Infantil' }
  ];

  const ordenacaoOpcoes = [
    { value: 'mais-recentes', label: 'Mais Recentes' },
    { value: 'menor-preco', label: 'Menor Preço' },
    { value: 'maior-preco', label: 'Maior Preço' },
    { value: 'a-z', label: 'A-Z' },
    { value: 'z-a', label: 'Z-A' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleArrayFilterChange = (key, value, checked) => {
    let newArray;
    if (checked) {
      newArray = [...filters[key], value];
    } else {
      newArray = filters[key].filter(item => item !== value);
    }
    
    const newFilters = { ...filters, [key]: newArray };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
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
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.categoria ||
      filters.precoMin ||
      filters.precoMax ||
      filters.tamanhos.length > 0 ||
      filters.cores.length > 0 ||
      filters.marcas.length > 0 ||
      filters.condicao ||
      filters.genero ||
      filters.ordenacao !== 'mais-recentes'
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                Limpar filtros
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-6">
              {/* Busca */}
              <div>
                <Label htmlFor="search">Buscar produtos</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Digite o nome do produto..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Ordenação */}
                <div>
                  <Label htmlFor="ordenacao">Ordenar por</Label>
                  <Select
                    value={filters.ordenacao}
                    onChange={(e) => handleFilterChange('ordenacao', e.target.value)}
                    className="mt-2"
                  >
                    {ordenacaoOpcoes.map(opcao => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Categoria */}
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={filters.categoria}
                    onChange={(e) => handleFilterChange('categoria', e.target.value)}
                    className="mt-2"
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Condição */}
                <div>
                  <Label htmlFor="condicao">Condição</Label>
                  <Select
                    value={filters.condicao}
                    onChange={(e) => handleFilterChange('condicao', e.target.value)}
                    className="mt-2"
                  >
                    <option value="">Todas as condições</option>
                    {condicoes.map(condicao => (
                      <option key={condicao.value} value={condicao.value}>
                        {condicao.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Gênero */}
                <div>
                  <Label htmlFor="genero">Gênero</Label>
                  <Select
                    value={filters.genero}
                    onChange={(e) => handleFilterChange('genero', e.target.value)}
                    className="mt-2"
                  >
                    <option value="">Todos os gêneros</option>
                    {generos.map(genero => (
                      <option key={genero.value} value={genero.value}>
                        {genero.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Preço Mínimo */}
                <div>
                  <Label htmlFor="precoMin">Preço mínimo</Label>
                  <Input
                    id="precoMin"
                    type="number"
                    placeholder="R$ 0,00"
                    value={filters.precoMin}
                    onChange={(e) => handleFilterChange('precoMin', e.target.value)}
                    className="mt-2"
                  />
                </div>

                {/* Preço Máximo */}
                <div>
                  <Label htmlFor="precoMax">Preço máximo</Label>
                  <Input
                    id="precoMax"
                    type="number"
                    placeholder="R$ 500,00"
                    value={filters.precoMax}
                    onChange={(e) => handleFilterChange('precoMax', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Filtros por Checkbox */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                {/* Tamanhos */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Tamanhos</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {tamanhos.map(tamanho => (
                      <label key={tamanho} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={filters.tamanhos.includes(tamanho)}
                          onChange={(e) => handleArrayFilterChange('tamanhos', tamanho, e.target.checked)}
                        />
                        <span className="text-sm">{tamanho}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cores */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Cores</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {cores.map(cor => (
                      <label key={cor} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={filters.cores.includes(cor)}
                          onChange={(e) => handleArrayFilterChange('cores', cor, e.target.checked)}
                        />
                        <span className="text-sm">{cor}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Marcas */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Marcas</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {marcas.map(marca => (
                      <label key={marca} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={filters.marcas.includes(marca)}
                          onChange={(e) => handleArrayFilterChange('marcas', marca, e.target.checked)}
                        />
                        <span className="text-sm">{marca}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ProductFilters; 