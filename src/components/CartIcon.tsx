'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function CartIcon() {
  const { cartCount, totalPrice } = useCart();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || cartCount === 0) {
    return null;
  }

  return (
    <Link href="/checkout">
      <div className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors cursor-pointer flex items-center gap-3 animate-fade-in-up">
        <ShoppingCart size={24} />
        <div className="flex flex-col items-start">
            <span className="font-bold">
            {cartCount} {cartCount === 1 ? 'item' : 'itens'}
            </span>
            <span className="text-sm">
                R$ {totalPrice.toFixed(2)}
            </span>
        </div>
      </div>
    </Link>
  );
}