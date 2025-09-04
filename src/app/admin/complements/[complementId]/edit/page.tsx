'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { Complement, ComplementType } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditComplementPage() {
  const [complement, setComplement] = useState<Complement | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<ComplementType>(ComplementType.FRUTA);
  const [extraPrice, setExtraPrice] = useState(0);
  const [included, setIncluded] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);
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

  const handleImageChange = (data: { file: File | null; currentUrl: string; shouldDelete: boolean }) => {
    setImageFile(data.file);
    setShouldDeleteImage(data.shouldDelete);
    
    if (data.file) {
      // Se há um novo arquivo, não alterar a URL atual ainda
      // A URL será atualizada após o upload no submit
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

      // Se deve deletar a imagem atual
      if (shouldDeleteImage && imageUrl) {
        try {
          const deleteResponse = await fetch('/api/delete-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl }),
          });
          
          if (deleteResponse.ok) {
            finalImageUrl = '';
          }
        } catch (deleteErr) {
          console.warn('Erro ao deletar imagem anterior:', deleteErr);
        }
      }

      // Se há um arquivo para upload, fazer o upload
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

      const response = await fetch(`/api/complements/${params.complementId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, extraPrice, included, imageUrl: finalImageUrl }),
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
          <ImageUpload
            label="Imagem do Complemento"
            value={imageUrl}
            onChange={handleImageChange}
          />

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