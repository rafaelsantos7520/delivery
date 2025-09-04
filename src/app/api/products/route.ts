
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Desabilitar cache para esta rota
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const products = await prisma.product.findMany({
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
    return NextResponse.json(products);
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, categoryId, imageUrl, variations, complementIds } = body;

    if (!name || !categoryId || !variations || variations.length === 0) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        imageUrl,
        variations: {
          create: variations.map((v: { name: string; basePrice: number; includedComplements: number; includedFruits: number; includedCoverages: number; }) => ({
            name: v.name,
            basePrice: v.basePrice,
            includedComplements: v.includedComplements,
            includedFruits: v.includedFruits,
            includedCoverages: v.includedCoverages || 0,
          })),
        },
        ...(complementIds && complementIds.length > 0 && {
          complements: {
            create: complementIds.map((complementId: string) => ({
              complementId,
            })),
          },
        }),
      },
      include: {
        variations: true,
        complements: {
          include: {
            complement: true,
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
