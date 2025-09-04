
import prisma from '@/lib/prisma';
import { unstable_cache as cache } from 'next/cache';

/**
 * Fetches all active products from the database.
 * The result is cached for 15 minutes and tagged with 'products'.
 * The cache is automatically revalidated when `revalidateTag('products')` is called.
 */
export const getProducts = cache(
  async () => {
    return prisma.product.findMany({
      where: { active: true },
      include: {
        variations: true,
        categoryRelation: true,
        complements: {
          include: {
            complement: true,
          },
        },
      },
    });
  },
  ['products'], // Chave do cache
  { 
    revalidate: 900, // 15 minutos
    tags: ['products'] // Tag para revalidação sob demanda
  }
);

/**
 * Fetches all categories from the database.
 * The result is cached for 1 hour.
 */
export const getCategories = cache(
  async () => {
    return prisma.category.findMany();
  },
  ['categories'], // Chave do cache
  { 
    revalidate: 3600 // 1 hora
  }
);
