import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const SearchBar = ({ 
  onSearch, 
  onFilterToggle,
  placeholder = "Buscar produtos...",
  showFilters = true,
  loading = false,
  results = [],
  showResults = false,
  onResultClick,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0 && showResults);
    onSearch?.(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    onSearch?.('');
    inputRef.current?.focus();
  };

  const handleResultClick = (result) => {
    setQuery('');
    setIsOpen(false);
    onResultClick?.(result);
  };

  const highlightMatch = (text, searchQuery) => {
    if (!searchQuery) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  return (
    <div className={`relative w-full max-w-2xl ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="pl-12 pr-20 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
            onFocus={() => setIsOpen(query.length > 0 && showResults)}
          />

          <div className="absolute right-2 flex items-center gap-2">
            {loading && (
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
            )}
            
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            )}

            {showFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onFilterToggle}
                className="px-3 py-1.5"
              >
                <Filter className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Botão de busca invisível para submit */}
        <button type="submit" className="sr-only">Buscar</button>
      </form>

      {/* Resultados da busca */}
      <AnimatePresence>
        {isOpen && showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-3 border-b border-gray-100">
              <p className="text-sm text-gray-600">
                {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="py-2">
              {results.map((result, index) => (
                <motion.div
                  key={result.id || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center gap-4">
                    {result.image && (
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="font-medium text-gray-900 truncate"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightMatch(result.title || result.nome, query) 
                        }}
                      />
                      
                      {result.description && (
                        <p 
                          className="text-sm text-gray-600 truncate mt-1"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightMatch(result.description || result.descricao, query) 
                          }}
                        />
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        {result.category && (
                          <Badge variant="outline" className="text-xs">
                            {result.category || result.categoria}
                          </Badge>
                        )}
                        
                        {result.price && (
                          <Badge variant="secondary" className="text-xs">
                            {typeof result.price === 'function' 
                              ? result.price() 
                              : new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(result.price || result.preco)
                            }
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {results.length > 10 && (
              <div className="p-3 border-t border-gray-100 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearch?.(query)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Ver todos os resultados
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estado vazio */}
      <AnimatePresence>
        {isOpen && showResults && query && results.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-sm text-gray-600">
                Tente buscar com outras palavras ou verifique a ortografia
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Variações específicas do SearchBar
export const ProductSearchBar = ({ onSearch, products = [], ...props }) => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    if (query.length > 2) {
      const filtered = products
        .filter(product => 
          product.nome.toLowerCase().includes(query.toLowerCase()) ||
          product.descricao.toLowerCase().includes(query.toLowerCase()) ||
          product.categoria.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10)
        .map(product => ({
          id: product.id,
          title: product.nome,
          description: product.descricao,
          category: product.categoria,
          price: product.getFormattedPrice ? product.getFormattedPrice() : product.preco,
          image: product.imagemPrincipal || product.imagens?.[0]
        }));
      
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
    
    onSearch?.(query);
  };

  return (
    <SearchBar
      {...props}
      onSearch={handleSearch}
      results={searchResults}
      showResults={true}
      placeholder="Buscar produtos por nome, categoria..."
    />
  );
};

export const AdminSearchBar = ({ onSearch, ...props }) => {
  return (
    <SearchBar
      {...props}
      onSearch={onSearch}
      placeholder="Buscar em produtos, clientes, vendas..."
      showFilters={true}
    />
  );
};

export default SearchBar; 