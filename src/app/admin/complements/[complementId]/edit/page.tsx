'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Complement, ComplementType } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditComplementPage() {
  const [complement, setComplement] = useState<Complement | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<ComplementType>(ComplementType.ACOMPANHAMENTO);
  const [extraPrice, setExtraPrice] = useState(0);
  const [included, setIncluded] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const complementId = params.complementId as string;

  useEffect(() => {
    const fetchComplement = async () => {
      try {
        const response = await fetch(`/api/complements/${complementId}`);
        if (response.ok) {
          const data = await response.json();
          setComplement(data);
          setName(data.name);
          setType(data.type);
          setExtraPrice(data.extraPrice);
          setIncluded(data.included);
          setImageUrl(data.imageUrl || '');
        } else {
          setError('Failed to fetch complement');
        }
      } catch {
        setError('An unexpected error occurred');
      }
    };

    if (complementId) {
      fetchComplement();
    }
  }, [complementId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`/api/complements/${complementId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, extraPrice, included, imageUrl }),
      });

      if (response.ok) {
        router.push('/admin/complements');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update complement');
      }
    } catch {
      setError('An unexpected error occurred');
    }
  };

  if (!complement) {
    return <p>Carregando...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Complemento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={(value) => setType(value as ComplementType)}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                    {Object.values(ComplementType).map(typeValue => (
                        <SelectItem key={typeValue} value={typeValue}>{typeValue}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="extraPrice">Preço Extra</Label>
            <Input id="extraPrice" type="number" value={extraPrice} onChange={(e) => setExtraPrice(parseFloat(e.target.value) || 0)} />
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
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}