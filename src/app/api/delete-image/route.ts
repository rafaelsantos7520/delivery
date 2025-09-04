import { NextRequest, NextResponse } from 'next/server';
import { deleteImage } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'URL da imagem é obrigatória' },
        { status: 400 }
      );
    }

    // Extrair o caminho da imagem da URL do Supabase
    const urlParts = imageUrl.split('/storage/v1/object/public/');
    if (urlParts.length !== 2) {
      return NextResponse.json(
        { success: false, error: 'URL da imagem inválida' },
        { status: 400 }
      );
    }

    const fullPath = urlParts[1];
    const pathParts = fullPath.split('/');
    const bucket = pathParts[0];
    const imagePath = pathParts.slice(1).join('/');

    console.log('🗑️ API: Deletando imagem:', { bucket, imagePath });

    const result = await deleteImage(bucket, imagePath);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ API: Erro ao deletar imagem:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}