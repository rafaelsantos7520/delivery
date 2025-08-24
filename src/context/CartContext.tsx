'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '@/types';
import { ProductVariation, ComplementType } from '@prisma/client';

interface ComplementSelection {
  complementId: string;
  name: string;
  type: ComplementType;
  isSelected: boolean;
  extraQuantity: number;
  unitPrice: number;
}

export interface CartItem {
  id: string; // Unique ID for the cart item
  product: Product;
  selectedVariation: ProductVariation;
  complementSelections: ComplementSelection[];
  totalPrice: number;
  notes?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const isClient = typeof window !== 'undefined';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (!isClient) return [];
    try {
      const item = window.localStorage.getItem('acai-prime-cart');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    if (!isClient) return;
    try {
      window.localStorage.setItem('acai-prime-cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCartItems(prevItems => [...prevItems, { ...item, id: new Date().toISOString() }]);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;
  const totalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};