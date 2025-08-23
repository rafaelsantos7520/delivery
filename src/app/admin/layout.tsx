
'use client';

'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <div>
          <h1 className="text-2xl font-bold mb-8">Admin</h1>
          <nav>
            <ul>
              <li className="mb-4"><Link href="/admin/products" className="hover:text-gray-300">Produtos</Link></li>
              <li className="mb-4"><Link href="/admin/complements" className="hover:text-gray-300">Complementos</Link></li>
              <li className="mb-4"><Link href="/admin/orders" className="hover:text-gray-300">Pedidos</Link></li>
            </ul>
          </nav>
        </div>
        <div className="mt-auto">
          <Button onClick={handleLogout} variant="destructive" className="w-full">Sair</Button>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
