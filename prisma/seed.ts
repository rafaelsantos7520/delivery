import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar admin padrão
  const adminExists = await prisma.admin.findUnique({
    where: { login: 'admin' }
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
      data: {
        name: 'Administrador',
        login: 'admin',
        passwordHash: hashedPassword,
        active: true
      }
    });
    console.log('✅ Admin criado: login=admin, senha=admin123');
  }

  // Criar categorias padrão
  const categories = [
    { name: 'AÇAÍ', description: 'Açaí tradicional e especiais' },
    { name: 'BATIDA', description: 'Batidas e vitaminas' },
    { name: 'SORVETE', description: 'Sorvetes artesanais' },
    { name: 'BEBIDA', description: 'Bebidas diversas' },
    { name: 'LANCHE', description: 'Lanches e petiscos' }
  ];

  for (const category of categories) {
    const exists = await prisma.category.findUnique({
      where: { name: category.name }
    });

    if (!exists) {
      await prisma.category.create({
        data: category
      });
      console.log(`✅ Categoria criada: ${category.name}`);
    }
  }

  // Criar complementos padrão
  const complements = [
    // Frutas
    { name: 'Banana', type: 'FRUTA', extraPrice: 0, included: true },
    { name: 'Morango', type: 'FRUTA', extraPrice: 2, included: false },
    { name: 'Kiwi', type: 'FRUTA', extraPrice: 3, included: false },
    { name: 'Manga', type: 'FRUTA', extraPrice: 2, included: false },
    { name: 'Abacaxi', type: 'FRUTA', extraPrice: 1.5, included: false },
    
    // Coberturas
    { name: 'Leite Condensado', type: 'COBERTURA', extraPrice: 0, included: true },
    { name: 'Chocolate', type: 'COBERTURA', extraPrice: 1, included: false },
    { name: 'Mel', type: 'COBERTURA', extraPrice: 1.5, included: false },
    { name: 'Nutella', type: 'COBERTURA', extraPrice: 3, included: false },
    
    // Acompanhamentos
    { name: 'Granola', type: 'ACOMPANHAMENTO', extraPrice: 1, included: false },
    { name: 'Castanha', type: 'ACOMPANHAMENTO', extraPrice: 2, included: false },
    { name: 'Amendoim', type: 'ACOMPANHAMENTO', extraPrice: 1, included: false },
    { name: 'Coco Ralado', type: 'ACOMPANHAMENTO', extraPrice: 1, included: false },
    { name: 'Paçoca', type: 'ACOMPANHAMENTO', extraPrice: 2, included: false }
  ];

  for (const complement of complements) {
    const exists = await prisma.complement.findFirst({
      where: { name: complement.name }
    });

    if (!exists) {
      await prisma.complement.create({
        data: {
          name: complement.name,
          type: complement.type as any,
          extraPrice: complement.extraPrice,
          included: complement.included,
          active: true
        }
      });
      console.log(`✅ Complemento criado: ${complement.name}`);
    }
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });