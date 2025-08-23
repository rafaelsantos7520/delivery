
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewComplementPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [extraPrice, setExtraPrice] = useState(0);
  const [included, setIncluded] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/complements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, extraPrice, included, imageUrl }),
      });

      if (response.ok) {
        router.push('/admin/complements');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create complement');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Novo Complemento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Input id="type" value={type} onChange={(e) => setType(e.target.value)} required placeholder="Ex: topping, fruta, cobertura" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="extraPrice">Preço Extra</Label>
            <Input id="extraPrice" type="number" value={extraPrice} onChange={(e) => setExtraPrice(parseFloat(e.target.value))} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="included" checked={included} onCheckedChange={setIncluded} />
            <Label htmlFor="included">Incluso na contagem do tamanho</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
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
