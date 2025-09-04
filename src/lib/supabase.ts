import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para fazer upload de imagem
export const uploadImage = async (file: File, bucket: string, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Construir URL pública manualmente para garantir formato correto
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${data.path}`;

    return {
      success: true,
      url: publicUrl,
      path: data.path
    };
  } catch (error) {
    console.error('Erro no upload:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

// Função para obter URL pública de uma imagem
export const getPublicImageUrl = (bucket: string, path: string) => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return publicUrl;
};

// Função para verificar se uma URL de imagem é válida
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('supabase.co') && 
           urlObj.pathname.includes('/storage/v1/object/public/');
  } catch {
    return false;
  }
};

// Função para deletar imagem
export async function deleteImage(bucket: string, path: string): Promise<{ success: boolean; error?: string; details?: any }> {
  try {
    console.log('🗑️ Tentando deletar imagem:', { bucket, path });
    
    // Verificar se o arquivo existe primeiro
    const folderPath = path.split('/').slice(0, -1).join('/');
    const fileName = path.split('/').pop();
    
    console.log('📁 Verificando pasta:', folderPath);
    console.log('📄 Nome do arquivo:', fileName);
    
    const { data: fileList, error: listError } = await supabase.storage
      .from(bucket)
      .list(folderPath);
    
    console.log('📋 Lista de arquivos na pasta:', fileList);
    console.log('❌ Erro na listagem:', listError);
    
    const fileExists = fileList?.some(file => file.name === fileName);
    console.log('✅ Arquivo existe?', fileExists);
    
    if (!fileExists && !listError) {
      console.log('⚠️ Arquivo não encontrado na pasta');
      return { success: false, error: 'Arquivo não encontrado', details: { fileList, fileName } };
    }
    
    // Tentar deletar
    console.log('🔥 Executando deleção...');
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    console.log('📊 Resultado da deleção:', { data, error });
    
    if (error) {
      console.error('❌ Erro ao deletar imagem:', error);
      return { success: false, error: error.message, details: { data, error } };
    }
    
    console.log('✅ Imagem deletada com sucesso!');
    return { success: true, details: { data } };
  } catch (error) {
    console.error('💥 Erro inesperado ao deletar imagem:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      details: { error }
    };
  }
}