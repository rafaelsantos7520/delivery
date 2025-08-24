
'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '@/types';
import { ProductVariation } from '@prisma/client';

interface ComplementSelection {
  complementId: string;
  name: string;
  type: string;
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
  updateItemQuantity: (itemId: string, quantity: number) => void; // This might be complex with current structure
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCartItems(prevItems => [...prevItems, { ...item, id: new Date().toISOString() }]);
    // In a real app, you might want to merge items if they are identical
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
