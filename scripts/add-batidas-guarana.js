const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🥤 Adicionando Batidas de Guaraná...');

  // Criar produto Batida de Guaraná sem fruta
  const batidaGuaranaSemFruta = await prisma.product.create({
    data: {
      name: 'Batida de Guaraná sem Fruta',
      description: 'Batida de guaraná sem fruta',
      category: 'batida',
      active: true
    }
  });

  // Criar variações da Batida de Guaraná sem fruta
  const batidaGuaranaSemFrutaVariations = await Promise.all([
    prisma.productVariation.create({
      data: {
        productId: batidaGuaranaSemFruta.id,
        name: '330ml',
        basePrice: 8.00,
        includedComplements: 3,
        includedFruits: 1
      }
    }),
    prisma.productVariation.create({
      data: {
        productId: batidaGuaranaSemFruta.id,
        name: '500ml',
        basePrice: 10.00,
        includedComplements: 4,
        includedFruits: 1
      }
    })
  ]);

  // Criar produto Batida de Guaraná com fruta
  const batidaGuaranaComFruta = await prisma.product.create({
    data: {
      name: 'Batida de Guaraná com Fruta',
      description: 'Batida de guaraná com fruta',
      category: 'batida',
      active: true
    }
  });

  // Criar variações da Batida de Guaraná com fruta (preço base + R$2)
  const batidaGuaranaComFrutaVariations = await Promise.all([
    prisma.productVariation.create({
      data: {
        productId: batidaGuaranaComFruta.id,
        name: '330ml',
        basePrice: 10.00, // 8 + 2
        includedComplements: 3,
        includedFruits: 1
      }
    }),
    prisma.productVariation.create({
      data: {
        productId: batidaGuaranaComFruta.id,
        name: '500ml',
        basePrice: 12.00, // 10 + 2
        includedComplements: 4,
        includedFruits: 1
      }
    })
  ]);

  console.log('✅ Produtos Batida de Guaraná criados');

  // Buscar todos os complementos existentes
  const allComplements = await prisma.complement.findMany();

  // Associar complementos aos novos produtos
  const newProducts = [batidaGuaranaSemFruta, batidaGuaranaComFruta];

  for (const product of newProducts) {
    for (const complement of allComplements) {
      await prisma.productComplement.create({
        data: {
          productId: product.id,
          complementId: complement.id,
          active: true
        }
      });
    }
  }

  console.log('✅ Associações produto-complemento criadas para Batidas de Guaraná');

  console.log('🎉 Batidas de Guaraná adicionadas com sucesso!');
  console.log(`📊 Resumo:`);
  console.log(`   - 2 novos produtos (Batida de Guaraná sem/com fruta)`);
  console.log(`   - 4 novas variações`);
  console.log(`   - Preços: sem fruta R$8/R$10, com fruta R$10/R$12`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao adicionar Batidas de Guaraná:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });