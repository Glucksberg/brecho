import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const localData = localStorage.getItem('brechoLuliFavorites');
      if (localData) {
        setFavorites(JSON.parse(localData));
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('brechoLuliFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product) => {
    setFavorites(prevItems => [...prevItems, product]);
  };

  const removeFromFavorites = (productId) => {
    setFavorites(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };
  
  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };
  
  const favoritesCount = favorites.length;

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    favoritesCount
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};