'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Complement {
  id: string;
  name: string;
  type: 'FRUTA' | 'COBERTURA' | 'ACOMPANHAMENTO';
  price: number;
  included: boolean;
  active: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export default function NewProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [variations, setVariations] = useState([{ name: '', basePrice: 0, includedComplements: 0, includedFruits: 0, includedCoverages: 0 }]);
  const [selectedComplements, setSelectedComplements] = useState<string[]>([]);
  const [complements, setComplements] = useState<Complement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complementsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/complements'),
          fetch('/api/categories')
        ]);
        
        if (complementsResponse.ok) {
          const complementsData = await complementsResponse.json();
          setComplements(complementsData.filter((c: Complement) => c.active));
        }
        
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVariationChange = (index: number, field: string, value: string | number) => {
    const newVariations = [...variations];
    newVariations[index] = { ...newVariations[index], [field]: value };
    setVariations(newVariations);
  };

  const addVariation = () => {
    setVariations([...variations, { name: '', basePrice: 0, includedComplements: 0, includedFruits: 0, includedCoverages: 0 }]);
  };

  const removeVariation = (index: number) => {
    const newVariations = variations.filter((_, i) => i !== index);
    setVariations(newVariations);
  };

  const handleImageChange = (data: { file: File | null; currentUrl: string; shouldDelete: boolean }) => {
    setImageFile(data.file);
    if (data.file) {
      // Se há um novo arquivo, limpar a URL atual
      setImageUrl('');
    } else if (data.shouldDelete) {
      // Se deve deletar, limpar a URL
      setImageUrl('');
    }
  };

  const handleComplementToggle = (complementId: string) => {
    setSelectedComplements(prev => 
      prev.includes(complementId)
        ? prev.filter(id => id !== complementId)
        : [...prev, complementId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let finalImageUrl = imageUrl;

      // Se há um arquivo para upload, fazer o upload primeiro
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('bucket', 'acai-prime');
        formData.append('folder', 'products');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          finalImageUrl = uploadData.url;
        } else {
          setError('Erro no upload da imagem');
          return;
        }
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          description, 
          categoryId, 
          imageUrl: finalImageUrl, 
          variations,
          complementIds: selectedComplements
        }),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create product');
      }
    } catch {
      setError('An unexpected error occurred');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Novo Produto</CardTitle>
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
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ImageUpload
            label="Imagem do Produto"
            value={imageUrl}
            onChange={handleImageChange}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Complementos Disponíveis</h3>
            {loading ? (
              <p>Carregando complementos...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
                {['FRUTA', 'COBERTURA', 'ACOMPANHAMENTO'].map(type => (
                  <div key={type} className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">{type === 'ACOMPANHAMENTO' ? 'ACOMPANHAMENTOS' : type + 'S'}</h4>
                    <div className="space-y-2">
                      {complements
                        .filter(complement => complement.type === type)
                        .map(complement => (
                          <div key={complement.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={complement.id}
                              checked={selectedComplements.includes(complement.id)}
                              onCheckedChange={() => handleComplementToggle(complement.id)}
                            />
                            <Label 
                              htmlFor={complement.id} 
                              className="text-sm cursor-pointer flex-1"
                            >
                              {complement.name} 
                               <span className="text-gray-500">
                                 (R$ {(complement.price || 0).toFixed(2)})
                               </span>
                            </Label>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                    <div className="space-y-2">
                        <Label htmlFor={`var-coverage-${index}`}>Coberturas Inclusas</Label>
                        <Input id={`var-coverage-${index}`} type="number" value={variation.includedCoverages} onChange={(e) => handleVariationChange(index, 'includedCoverages', parseInt(e.target.value) || 0)} />
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
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}