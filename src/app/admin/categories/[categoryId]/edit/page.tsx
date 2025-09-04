'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Loading } from "@/components/ui/loading";

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

interface EditCategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const router = useRouter();

  // Resolver os parâmetros assíncronos
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setCategoryId(resolvedParams.categoryId);
    };
    
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (response.ok) {
          const data = await response.json();
          setCategory(data);
          setName(data.name);
          setDescription(data.description || '');
        } else {
          setError('Categoria não encontrada');
        }
      } catch (error) {
        console.error('Erro ao buscar categoria:', error);
        setError('Erro ao carregar categoria');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
        }),
      });

      if (response.ok) {
        router.push('/admin/categories');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao atualizar categoria');
      }
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      setError('Erro inesperado ao atualizar categoria');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !category) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Editar Categoria</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Editar Categoria</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Categoria</CardTitle>
          <CardDescription>
            Edite os dados da categoria. Esta categoria possui {category?._count.products || 0} produto{category?._count.products !== 1 ? 's' : ''} associado{category?._count.products !== 1 ? 's' : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: AÇAÍ, BATIDA, SORVETE..."
                required
                maxLength={255}
              />
              <p className="text-sm text-gray-500">
                Nome da categoria (obrigatório)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição opcional da categoria..."
                rows={3}
              />
              <p className="text-sm text-gray-500">
                Descrição opcional para ajudar a identificar a categoria
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving || !name.trim()}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}