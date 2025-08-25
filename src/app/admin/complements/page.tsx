
'use client';

import { Complement } from "@prisma/client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loading } from "@/components/ui/loading";

export default function ComplementsPage() {
  const [complements, setComplements] = useState<Complement[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchComplements = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/complements');
      const data = await response.json();
      setComplements(data);
    } catch (error) {
      console.error("Failed to fetch complements", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplements();
  }, []);

  const handleDelete = async (complementId: string) => {
    try {
      const response = await fetch(`/api/complements/${complementId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchComplements(); // Refresh the list
      } else {
        console.error("Failed to delete complement");
      }
    } catch (error) {
      console.error("An unexpected error occurred", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Complementos</h1>
        <Button onClick={() => router.push('/admin/complements/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Complemento
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Preço Extra</TableHead>
              <TableHead>Incluso</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complements.map((complement) => (
              <TableRow key={complement.id}>
                <TableCell>{complement.name}</TableCell>
                <TableCell>{complement.type}</TableCell>
                <TableCell>R$ {complement.extraPrice.toFixed(2)}</TableCell>
                <TableCell>{complement.included ? 'Sim' : 'Não'}</TableCell>
                <TableCell>{complement.active ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => router.push(`/admin/complements/${complement.id}/edit`)}>Editar</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">Excluir</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Essa ação não pode ser desfeita. Isso irá deletar permanentemente o complemento.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(complement.id)}>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
