'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, Users, Package, LogOut } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/products', label: 'Produtos', icon: Package },
  { href: '/admin/complements', label: 'Complementos', icon: Package },
  { href: '/admin/customers', label: 'Clientes', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold">
        <Link href="/" className="text-white">Açaí Prime</Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-700'
                }`}>
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-700">
         <Link href="/admin/logout">
            <div className="flex items-center px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700">
                <LogOut className="w-5 h-5 mr-3" />
                <span>Sair</span>
            </div>
        </Link>
      </div>
    </aside>
  );
}
