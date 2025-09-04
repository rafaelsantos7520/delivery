'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ComplementType } from "@prisma/client";

export default function NewComplementPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState<ComplementType>(ComplementType.FRUTA);
  const [extraPrice, setExtraPrice] = useState(0);
  const [included, setIncluded] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

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
        formData.append('folder', 'complements');

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

      const response = await fetch('/api/complements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, extraPrice, included, imageUrl: finalImageUrl }),
      });

      if (response.ok) {
        router.push('/admin/complements');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create complement');
      }
    } catch {
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
          <ImageUpload
            label="Imagem do Complemento"
            value={imageUrl}
            onChange={handleImageChange}
          />

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