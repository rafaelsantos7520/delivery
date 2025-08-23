const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.orderItemComplement.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productComplement.deleteMany();
  await prisma.productVariation.deleteMany();
  await prisma.complement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();

  console.log('🗑️ Dados existentes removidos');

  // Criar complementos (acompanhamentos)
  const acompanhamentos = await Promise.all([
    prisma.complement.create({
      data: {
        name: 'Leite em pó',
        type: 'acompanhamento',
        extraPrice: 0,
        included: true
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Leite condensado',
        type: 'acompanhamento',
        extraPrice: 0,
        included: true
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Granola',
        type: 'acompanhamento',
        extraPrice: 0,
        included: true
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Amendoim granulado',
        type: 'acompanhamento',
        extraPrice: 0,
        included: true
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Ovomaltine em pó',
        type: 'acompanhamento',
        extraPrice: 0,
        included: true
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Jujuba',
        type: 'acompanhamento',
        extraPrice: 0,
        included: true
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Chococookies',
        type: 'acompanhamento',
        extraPrice: 0,
        included: true
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Morango',
        type: 'acompanhamento',
        extraPrice: 0,
        included: true
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Kiwi',
        type: 'acompanhamento',
        extraPrice: 0,
        included: true
      }
    })
  ]);

  // Criar frutas
  const frutas = await Promise.all([
    prisma.complement.create({
      data: {
        name: 'Banana',
        type: 'fruta',
        extraPrice: 0,
        included: true
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Uva',
        type: 'fruta',
        extraPrice: 0,
        included: true
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Abacate',
        type: 'fruta',
        extraPrice: 0,
        included: true
      }
    })
  ]);

  // Criar coberturas pagas
  const coberturas = await Promise.all([
    prisma.complement.create({
      data: {
        name: 'Bis',
        type: 'cobertura',
        extraPrice: 1.99,
        included: false
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Nutella',
        type: 'cobertura',
        extraPrice: 3.99,
        included: false
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Creme de ninho',
        type: 'cobertura',
        extraPrice: 3.99,
        included: false
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Creme de avelã',
        type: 'cobertura',
        extraPrice: 3.99,
        included: false
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Kit Kat',
        type: 'cobertura',
        extraPrice: 1.99,
        included: false
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Serenata de amor',
        type: 'cobertura',
        extraPrice: 2.99,
        included: false
      }
    }),
    prisma.complement.create({
      data: {
        name: 'Gota de chocolate',
        type: 'cobertura',
        extraPrice: 2.99,
        included: false
      }
    }),
    prisma.complement.create({
      data: {
        name: 'M&M',
        type: 'cobertura',
        extraPrice: 2.99,
        included: false
      }
    })
  ]);

  console.log('✅ Complementos criados');

  // Criar produto Açaí Prime
  const acaiPrime = await prisma.product.create({
    data: {
      name: 'Açaí Prime',
      description: 'Açaí Copo prime',
      category: 'acai',
      active: true
    }
  });

  // Criar variações do Açaí Prime
  const acaiPrimeVariations = await Promise.all([
    prisma.productVariation.create({
      data: {
        productId: acaiPrime.id,
        name: '300ml',
        basePrice: 15.00,
        includedComplements: 3,
        includedFruits: 1
      }
    }),
    prisma.productVariation.create({
      data: {
        productId: acaiPrime.id,
        name: '500ml',
        basePrice: 18.00,
        includedComplements: 4,
        includedFruits: 1
      }
    }),
    prisma.productVariation.create({
      data: {
        productId: acaiPrime.id,
        name: '770ml',
        basePrice: 25.00,
        includedComplements: 5,
        includedFruits: 1
      }
    })
  ]);

  // Criar produto Açaí no Copo Trufado
  const acaiTrufado = await prisma.product.create({
    data: {
      name: 'Açaí no Copo Trufado',
      description: 'Açaí no copo trufado sabores (consulte sabores disponíveis)',
      category: 'acai',
      active: true
    }
  });

  // Criar variações do Açaí Trufado
  const acaiTrufadoVariations = await Promise.all([
    prisma.productVariation.create({
      data: {
        productId: acaiTrufado.id,
        name: '300ml',
        basePrice: 18.00,
        includedComplements: 3,
        includedFruits: 1
      }
    }),
    prisma.productVariation.create({
      data: {
        productId: acaiTrufado.id,
        name: '500ml',
        basePrice: 20.00,
        includedComplements: 4,
        includedFruits: 1
      }
    }),
    prisma.productVariation.create({
      data: {
        productId: acaiTrufado.id,
        name: '770ml',
        basePrice: 28.00,
        includedComplements: 5,
        includedFruits: 1
      }
    })
  ]);

  // Criar produto Batida de Açaí
  const batidaAcai = await prisma.product.create({
    data: {
      name: 'Batida de Açaí',
      description: 'Batida de açaí 500ml na garrafa',
      category: 'batida',
      active: true
    }
  });

  // Criar variação da Batida de Açaí
  const batidaAcaiVariation = await prisma.productVariation.create({
    data: {
      productId: batidaAcai.id,
      name: '500ml',
      basePrice: 15.00,
      includedComplements: 3,
      includedFruits: 1
    }
  });

  // Criar produto Açaí na Taça
  const acaiTaca = await prisma.product.create({
    data: {
      name: 'Açaí na Taça',
      description: 'Açaí na taça',
      category: 'acai',
      active: true
    }
  });

  // Criar variação do Açaí na Taça
  const acaiTacaVariation = await prisma.productVariation.create({
    data: {
      productId: acaiTaca.id,
      name: 'Taça',
      basePrice: 20.00,
      includedComplements: 3,
      includedFruits: 1
    }
  });

  // Criar produto Açaí no KG
  const acaiKg = await prisma.product.create({
    data: {
      name: 'Açaí no KG',
      description: 'Açaí vendido por quilograma',
      category: 'acai',
      active: true
    }
  });

  // Criar variação do Açaí no KG
  const acaiKgVariation = await prisma.productVariation.create({
    data: {
      productId: acaiKg.id,
      name: '1KG',
      basePrice: 65.00,
      includedComplements: 0,
      includedFruits: 0
    }
  });

  console.log('✅ Produtos e variações criados');

  // Associar complementos aos produtos
  const allProducts = [acaiPrime, acaiTrufado, batidaAcai, acaiTaca, acaiKg];
  const allComplements = [...acompanhamentos, ...frutas, ...coberturas];

  for (const product of allProducts) {
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

  console.log('✅ Associações produto-complemento criadas');

  // Criar um cliente de exemplo
  const customer = await prisma.customer.create({
    data: {
      name: 'Cliente Exemplo',
      phone: '(98) 98426-7957',
      address: 'Endereço de exemplo'
    }
  });

  console.log('✅ Cliente de exemplo criado');

  console.log('🎉 Seed concluído com sucesso!');
  console.log(`📊 Resumo:`);
  console.log(`   - ${acompanhamentos.length} acompanhamentos`);
  console.log(`   - ${frutas.length} frutas`);
  console.log(`   - ${coberturas.length} coberturas`);
  console.log(`   - ${allProducts.length} produtos`);
  console.log(`   - ${acaiPrimeVariations.length + acaiTrufadoVariations.length + 3} variações`);
  console.log(`   - 1 cliente de exemplo`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });