import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Criando produtos de exemplo...');

  // Buscar categorias
  const acaiCategory = await prisma.category.findUnique({ where: { name: 'AÇAÍ' } });
  const batidaCategory = await prisma.category.findUnique({ where: { name: 'BATIDA' } });
  const sorveteCategory = await prisma.category.findUnique({ where: { name: 'SORVETE' } });
  const bebidaCategory = await prisma.category.findUnique({ where: { name: 'BEBIDA' } });
  const lancheCategory = await prisma.category.findUnique({ where: { name: 'LANCHE' } });

  // Buscar complementos
  const complements = await prisma.complement.findMany();
  const allComplementIds = complements.map(c => c.id);

  // Produtos de Açaí
  if (acaiCategory) {
    const acaiProducts = [
      {
        name: 'Açaí Tradicional',
        description: 'Açaí puro batido na hora com banana e granola',
        categoryId: acaiCategory.id,
        imageUrl: '/acai.jpg',
        variations: [
          { name: '300ml', basePrice: 12.90, includedComplements: 2, includedFruits: 1, includedCoverages: 1 },
          { name: '500ml', basePrice: 18.90, includedComplements: 3, includedFruits: 2, includedCoverages: 2 },
          { name: '700ml', basePrice: 24.90, includedComplements: 4, includedFruits: 3, includedCoverages: 2 }
        ]
      },
      {
        name: 'Açaí Premium',
        description: 'Açaí especial com frutas selecionadas e coberturas gourmet',
        categoryId: acaiCategory.id,
        variations: [
          { name: '300ml', basePrice: 16.90, includedComplements: 3, includedFruits: 2, includedCoverages: 2 },
          { name: '500ml', basePrice: 22.90, includedComplements: 4, includedFruits: 3, includedCoverages: 3 }
        ]
      }
    ];

    for (const productData of acaiProducts) {
      const exists = await prisma.product.findFirst({ where: { name: productData.name } });
      if (!exists) {
        const product = await prisma.product.create({
          data: {
            name: productData.name,
            description: productData.description,
            categoryId: productData.categoryId,
            imageUrl: productData.imageUrl || null
          }
        });

        // Criar variações
        for (const variation of productData.variations) {
          await prisma.productVariation.create({
            data: {
              productId: product.id,
              name: variation.name,
              basePrice: variation.basePrice,
              includedComplements: variation.includedComplements,
              includedFruits: variation.includedFruits,
              includedCoverages: variation.includedCoverages
            }
          });
        }

        // Vincular todos os complementos ao produto
        for (const complementId of allComplementIds) {
          await prisma.productComplement.create({
            data: {
              productId: product.id,
              complementId: complementId
            }
          });
        }

        console.log(`✅ Produto criado: ${product.name}`);
      }
    }
  }

  // Produtos de Batida
  if (batidaCategory) {
    const batidaProducts = [
      {
        name: 'Batida de Açaí com Morango',
        description: 'Deliciosa batida cremosa de açaí com morango',
        categoryId: batidaCategory.id,
        variations: [
          { name: '300ml', basePrice: 10.90, includedComplements: 1, includedFruits: 1, includedCoverages: 1 },
          { name: '500ml', basePrice: 15.90, includedComplements: 2, includedFruits: 2, includedCoverages: 1 }
        ]
      },
      {
        name: 'Vitamina de Banana',
        description: 'Vitamina nutritiva de banana com leite',
        categoryId: batidaCategory.id,
        variations: [
          { name: '300ml', basePrice: 8.90, includedComplements: 1, includedFruits: 1, includedCoverages: 0 },
          { name: '500ml', basePrice: 12.90, includedComplements: 2, includedFruits: 1, includedCoverages: 1 }
        ]
      }
    ];

    for (const productData of batidaProducts) {
      const exists = await prisma.product.findFirst({ where: { name: productData.name } });
      if (!exists) {
        const product = await prisma.product.create({
          data: {
            name: productData.name,
            description: productData.description,
            categoryId: productData.categoryId
          }
        });

        // Criar variações
        for (const variation of productData.variations) {
          await prisma.productVariation.create({
            data: {
              productId: product.id,
              name: variation.name,
              basePrice: variation.basePrice,
              includedComplements: variation.includedComplements,
              includedFruits: variation.includedFruits,
              includedCoverages: variation.includedCoverages
            }
          });
        }

        // Vincular complementos relevantes
        const relevantComplements = complements.filter(c => 
          ['Banana', 'Morango', 'Leite Condensado', 'Mel'].includes(c.name)
        );
        for (const complement of relevantComplements) {
          await prisma.productComplement.create({
            data: {
              productId: product.id,
              complementId: complement.id
            }
          });
        }

        console.log(`✅ Produto criado: ${product.name}`);
      }
    }
  }

  // Produtos de Sorvete
  if (sorveteCategory) {
    const sorveteProducts = [
      {
        name: 'Sorvete de Açaí',
        description: 'Sorvete cremoso de açaí artesanal',
        categoryId: sorveteCategory.id,
        variations: [
          { name: '1 Bola', basePrice: 6.90, includedComplements: 1, includedFruits: 0, includedCoverages: 1 },
          { name: '2 Bolas', basePrice: 11.90, includedComplements: 2, includedFruits: 1, includedCoverages: 1 },
          { name: '3 Bolas', basePrice: 16.90, includedComplements: 3, includedFruits: 2, includedCoverages: 2 }
        ]
      }
    ];

    for (const productData of sorveteProducts) {
      const exists = await prisma.product.findFirst({ where: { name: productData.name } });
      if (!exists) {
        const product = await prisma.product.create({
          data: {
            name: productData.name,
            description: productData.description,
            categoryId: productData.categoryId
          }
        });

        // Criar variações
        for (const variation of productData.variations) {
          await prisma.productVariation.create({
            data: {
              productId: product.id,
              name: variation.name,
              basePrice: variation.basePrice,
              includedComplements: variation.includedComplements,
              includedFruits: variation.includedFruits,
              includedCoverages: variation.includedCoverages
            }
          });
        }

        // Vincular complementos de cobertura e frutas
        const relevantComplements = complements.filter(c => 
          c.type === 'COBERTURA' || c.type === 'FRUTA'
        );
        for (const complement of relevantComplements) {
          await prisma.productComplement.create({
            data: {
              productId: product.id,
              complementId: complement.id
            }
          });
        }

        console.log(`✅ Produto criado: ${product.name}`);
      }
    }
  }

  console.log('🎉 Produtos criados com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar produtos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });