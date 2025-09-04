'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Phone, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { comerceData } from '@/utils/comerceData';
import { usePathname } from 'next/navigation';

export function Header() {
  const { cartCount } = useCart();
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Não renderiza o header se estiver em páginas administrativas
  if (pathname.startsWith('/admin')) {
    return null;
  }



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
                <Button variant="ghost" className="relative p-3 hover:bg-purple-100 transition-all duration-200 transform hover:scale-105 rounded-xl">
                    <ShoppingCart className="h-8 w-8 text-purple-700 hover:text-purple-800" />
                    {hasMounted && cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-lg animate-pulse">{cartCount}</span>
                    )}
                </Button>
            </Link>
            <Link href={`https://api.whatsapp.com/send?phone=${comerceData.whatsapp}`} target="_blank" className="hidden sm:flex items-center px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 transition-colors">
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp
            </Link>
        </div>
      </div>
    </header>
  );
}