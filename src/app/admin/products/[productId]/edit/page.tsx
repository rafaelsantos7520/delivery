
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [variations, setVariations] = useState([{ name: '', basePrice: 0, includedComplements: 0, includedFruits: 0 }]);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setName(data.name);
          setDescription(data.description || '');
          setCategory(data.category);
          setImageUrl(data.imageUrl || '');
          setVariations(data.variations.length > 0 ? data.variations : [{ name: '', basePrice: 0, includedComplements: 0, includedFruits: 0 }]);
        } else {
          setError('Failed to fetch product');
        }
      } catch (error) {
        setError('An unexpected error occurred');
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleVariationChange = (index: number, field: string, value: any) => {
    const newVariations = [...variations];
    newVariations[index] = { ...newVariations[index], [field]: value };
    setVariations(newVariations);
  };

  const addVariation = () => {
    setVariations([...variations, { name: '', basePrice: 0, includedComplements: 0, includedFruits: 0 }]);
  };

  const removeVariation = (index: number) => {
    const newVariations = variations.filter((_, i) => i !== index);
    setVariations(newVariations);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, category, imageUrl, variations }),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update product');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  if (!product) {
    return <p>Carregando...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Variações</h3>
            {variations.map((variation, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 mb-4 p-4 border rounded-md">
                <Input placeholder="Nome (ex: 500ml)" value={variation.name} onChange={(e) => handleVariationChange(index, 'name', e.target.value)} />
                <Input type="number" placeholder="Preço Base" value={variation.basePrice} onChange={(e) => handleVariationChange(index, 'basePrice', parseFloat(e.target.value))} />
                <Input type="number" placeholder="Compl. Inclusos" value={variation.includedComplements} onChange={(e) => handleVariationChange(index, 'includedComplements', parseInt(e.target.value))} />
                <Input type="number" placeholder="Frutas Inclusas" value={variation.includedFruits} onChange={(e) => handleVariationChange(index, 'includedFruits', parseInt(e.target.value))} />
                <Button type="button" variant="destructive" onClick={() => removeVariation(index)}>Remover</Button>
              </div>
            ))}
            <Button type="button" onClick={addVariation}>Adicionar Variação</Button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
