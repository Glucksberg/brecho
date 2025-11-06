'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Types
export interface FavoriteProduct {
  id: string
  nome: string
  preco: number
  imagemPrincipal?: string
  tamanho?: string
  cor?: string
  marca?: string
  categoria?: string
  descricao?: string
}

interface FavoritesContextValue {
  favorites: FavoriteProduct[]
  favoritesCount: number
  addToFavorites: (product: FavoriteProduct) => void
  removeFromFavorites: (productId: string) => void
  toggleFavorite: (product: FavoriteProduct) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
}

// Create context
const FavoritesContext = createContext<FavoritesContextValue | null>(null)

// Hook to use favorites
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

// Favorites Provider
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])

  // Load favorites from localStorage on initialization
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('brechoFavorites')
      if (savedFavorites) {
        const favoritesData: FavoriteProduct[] = JSON.parse(savedFavorites)
        setFavorites(favoritesData)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('brechoFavorites', JSON.stringify(favorites))
    } catch (error) {
      console.error('Error saving favorites:', error)
    }
  }, [favorites])

  // Add product to favorites
  const addToFavorites = useCallback((product: FavoriteProduct) => {
    setFavorites(prev => {
      // Check if already in favorites
      if (prev.some(item => item.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }, [])

  // Remove product from favorites
  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites(prev => prev.filter(item => item.id !== productId))
  }, [])

  // Toggle favorite (add if doesn't exist, remove if exists)
  const toggleFavorite = useCallback((product: FavoriteProduct) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.id === product.id)
      if (exists) {
        return prev.filter(item => item.id !== product.id)
      } else {
        return [...prev, product]
      }
    })
  }, [])

  // Check if product is in favorites
  const isFavorite = useCallback((productId: string) => {
    return favorites.some(item => item.id === productId)
  }, [favorites])

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  // Count favorites
  const favoritesCount = favorites.length

  // Context value
  const value: FavoritesContextValue = {
    favorites,
    favoritesCount,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
