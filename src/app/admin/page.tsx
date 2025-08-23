'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <Button onClick={handleLogout} variant="outline">
          Sair
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>Gerenciar produtos do cardápio</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/admin/products')}
              className="w-full"
            >
              Gerenciar Produtos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complementos</CardTitle>
            <CardDescription>Gerenciar acompanhamentos, coberturas e frutas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/admin/complements')}
              className="w-full"
            >
              Gerenciar Complementos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos</CardTitle>
            <CardDescription>Visualizar e gerenciar pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/admin/orders')}
              className="w-full"
            >
              Ver Pedidos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}