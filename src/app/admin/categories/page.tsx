'use client';

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loading } from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCategories(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("An unexpected error occurred", error);
      alert("Erro inesperado ao deletar categoria");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categorias</h1>
        <Button onClick={() => router.push('/admin/categories/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Categoria
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  {category.description || (
                    <span className="text-gray-400 italic">Sem descrição</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {category._count.products} produto{category._count.products !== 1 ? 's' : ''}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mr-2" 
                    onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                  >
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={category._count.products > 0}
                      >
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Essa ação não pode ser desfeita. Isso irá deletar permanentemente a categoria "{category.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(category.id)}>
                          Continuar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma categoria encontrada. Clique em "Adicionar Categoria" para criar a primeira.
          </div>
        )}
      </div>
    </div>
  );
}