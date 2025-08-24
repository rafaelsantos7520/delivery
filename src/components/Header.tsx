'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Phone, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export function Header() {
  const { cartCount } = useCart();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        <Link href="/" className="text-2xl font-bold text-purple-800">
          Açaí Prime
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-lg">
          <Link href="#cardapio" className="text-gray-600 hover:text-purple-600 transition-colors">Cardápio</Link>
          <Link href="#como-pedir" className="text-gray-600 hover:text-purple-600 transition-colors">Como Pedir</Link>
          <Link href="#depoimentos" className="text-gray-600 hover:text-purple-600 transition-colors">Depoimentos</Link>
        </nav>
        <div className="flex items-center gap-4">
            <Link href="/checkout">
                <Button variant="ghost" className="relative">
                    <ShoppingCart className="h-6 w-6 text-purple-700" />
                    {hasMounted && cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-yellow-500 text-purple-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
                    )}
                </Button>
            </Link>
            <Button className="hidden sm:flex bg-green-500 hover:bg-green-600">
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp
            </Button>
        </div>
      </div>
    </header>
  );
}