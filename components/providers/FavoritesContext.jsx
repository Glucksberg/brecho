import React, { createContext, useContext, useState, useEffect } from 'react';

// Criar contexto
const FavoritesContext = createContext(null);

// Hook para usar favoritos
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
}

// Provider dos favoritos
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Carregar favoritos do localStorage na inicialização
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('brechoFavorites');
      if (savedFavorites) {
        const favoritesData = JSON.parse(savedFavorites);
        setFavorites(favoritesData);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  }, []);

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem('brechoFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, [favorites]);

  // Adicionar produto aos favoritos
  const addToFavorites = (product) => {
    setFavorites(prev => {
      // Verificar se já está nos favoritos
      if (prev.some(item => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  // Remover produto dos favoritos
  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
  };

  // Toggle favorito (adiciona se não existe, remove se existe)
  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Verificar se produto está nos favoritos
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  // Limpar todos os favoritos
  const clearFavorites = () => {
    setFavorites([]);
  };

  // Contar favoritos
  const favoritesCount = favorites.length;

  // Valor do contexto
  const value = {
    favorites,
    favoritesCount,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
} 