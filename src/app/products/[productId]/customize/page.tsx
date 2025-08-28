

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import ProductCustomizationClient from './ProductCustomizationClient';

interface ProductCustomizationPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductCustomizationPage({ params }: ProductCustomizationPageProps) {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variations: true,
      complements: {
        include: {
          complement: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductCustomizationClient product={product} />
    </>
  );
}
