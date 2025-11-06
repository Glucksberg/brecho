'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

// Types
export interface CartItem {
  id: string
  nome: string
  preco: number
  imagemPrincipal?: string
  tamanho?: string
  cor?: string
  marca?: string
  categoria?: string
  quantity: number
}

interface CartState {
  items: CartItem[]
}

interface CartContextValue {
  items: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string) => number
  isInCart: (productId: string) => boolean
}

// Actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
} as const

type CartAction =
  | { type: typeof CART_ACTIONS.ADD_ITEM; payload: Omit<CartItem, 'quantity'> }
  | { type: typeof CART_ACTIONS.REMOVE_ITEM; payload: { id: string } }
  | { type: typeof CART_ACTIONS.UPDATE_QUANTITY; payload: { id: string; quantity: number } }
  | { type: typeof CART_ACTIONS.CLEAR_CART }
  | { type: typeof CART_ACTIONS.LOAD_CART; payload: CartItem[] | null }

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.id === action.payload.id)

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      }
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      }
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        }
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      }
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: []
      }
    }

    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload || []
      }
    }

    default:
      return state
  }
}

// Initial state
const initialState: CartState = {
  items: []
}

// Create context
const CartContext = createContext<CartContextValue | null>(null)

// Hook to use cart
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Cart Provider
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on initialization
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('brechoCart')
      if (savedCart) {
        const cartData: CartItem[] = JSON.parse(savedCart)
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData })
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('brechoCart', JSON.stringify(state.items))
    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }, [state.items])

  // Cart functions
  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { id: productId } })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART })
  }, [])

  // Derived calculations
  const cartCount = state.items.reduce((total, item) => total + item.quantity, 0)

  const cartTotal = state.items.reduce((total, item) => {
    return total + (item.preco || 0) * item.quantity
  }, 0)

  const getItemQuantity = useCallback((productId: string) => {
    const item = state.items.find(item => item.id === productId)
    return item ? item.quantity : 0
  }, [state.items])

  const isInCart = useCallback((productId: string) => {
    return state.items.some(item => item.id === productId)
  }, [state.items])

  // Context value
  const value: CartContextValue = {
    items: state.items,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
