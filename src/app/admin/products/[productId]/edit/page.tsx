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
            <Label htmlFor="name">Nome do Produto</Label>
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Variações de Tamanho e Preço</h3>
            {variations.map((variation, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`var-name-${index}`}>Nome (ex: 500ml)</Label>
                        <Input id={`var-name-${index}`} value={variation.name} onChange={(e) => handleVariationChange(index, 'name', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`var-price-${index}`}>Preço Base (R$)</Label>
                        <Input id={`var-price-${index}`} type="number" value={variation.basePrice} onChange={(e) => handleVariationChange(index, 'basePrice', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`var-comp-${index}`}>Complementos Inclusos</Label>
                        <Input id={`var-comp-${index}`} type="number" value={variation.includedComplements} onChange={(e) => handleVariationChange(index, 'includedComplements', parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`var-fruit-${index}`}>Frutas Inclusas</Label>
                        <Input id={`var-fruit-${index}`} type="number" value={variation.includedFruits} onChange={(e) => handleVariationChange(index, 'includedFruits', parseInt(e.target.value) || 0)} />
                    </div>
                </div>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeVariation(index)}>Remover Variação</Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addVariation}>Adicionar Variação</Button>
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