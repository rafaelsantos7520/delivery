'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { isValidImageUrl } from '@/lib/supabase';
import Image from 'next/image';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (data: { file: File | null; currentUrl: string; shouldDelete: boolean }) => void;
  accept?: string;
  maxSize?: number; // em MB
}

export function ImageUpload({
  label,
  value,
  onChange,
  accept = 'image/*',
  maxSize = 5
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(
    value && isValidImageUrl(value) ? value : null
  );
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Atualizar preview quando value mudar
  useEffect(() => {
    if (value && isValidImageUrl(value)) {
      setPreview(value);
      setImageError(false);
    } else {
      setPreview(null);
    }
    // Reset states when value changes
  }, [value]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho do arquivo
    if (file.size > maxSize * 1024 * 1024) {
      setError(`O arquivo deve ter no máximo ${maxSize}MB.`);
      return;
    }

    // Criar preview local do arquivo
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
        setImageError(false);
      }
    };
    reader.readAsDataURL(file);

    // Notificar o componente pai
    onChange({
      file,
      currentUrl: value || '',
      shouldDelete: false
    });

    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setImageError(false);
    setError(null);

    // Se havia uma imagem original, marcar para deleção
    if (value && isValidImageUrl(value)) {
      onChange({
        file: null,
        currentUrl: value,
        shouldDelete: true
      });
    } else {
      // Se era apenas um preview local, apenas limpar
      onChange({
        file: null,
        currentUrl: '',
        shouldDelete: false
      });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {/* Preview da imagem */}
      {preview && (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            {!imageError ? (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes="128px"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <AlertTriangle className="h-6 w-6 mb-1" />
                <span className="text-xs text-center">Erro ao carregar imagem</span>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemove}

          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Botão de upload */}
      {!preview && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">Clique para selecionar uma imagem</p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF até {maxSize}MB</p>
          </div>
        </div>
      )}

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Botões de ação */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {preview ? 'Alterar Imagem' : 'Selecionar Imagem'}
        </Button>
        
        {preview && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemove}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Remover
          </Button>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}