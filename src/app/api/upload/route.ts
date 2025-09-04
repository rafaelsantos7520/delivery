import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;
    const folder = formData.get('folder') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      );
    }

    if (!bucket) {
      return NextResponse.json(
        { success: false, error: 'Bucket é obrigatório' },
        { status: 400 }
      );
    }

    if (!folder) {
      return NextResponse.json(
        { success: false, error: 'Pasta é obrigatória' },
        { status: 400 }
      );
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${folder}/${fileName}`;

    console.log('📤 API: Fazendo upload:', { bucket, filePath, fileSize: file.size });

    const result = await uploadImage(file, bucket, filePath);

    if (result.success) {
      return NextResponse.json({
        success: true,
        url: result.url,
        path: result.path
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ API: Erro no upload:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}