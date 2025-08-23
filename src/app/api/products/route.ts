
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: {
        variations: true,
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
    const { name, description, category, imageUrl, variations } = body;

    if (!name || !category || !variations || variations.length === 0) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        imageUrl,
        variations: {
          create: variations.map((v: any) => ({
            name: v.name,
            basePrice: v.basePrice,
            includedComplements: v.includedComplements,
            includedFruits: v.includedFruits,
          })),
        },
      },
      include: {
        variations: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
