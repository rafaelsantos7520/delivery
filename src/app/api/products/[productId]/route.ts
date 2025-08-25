
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        variations: true,
      },
    });

    if (!product) {
      return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;
    const body = await req.json();
    const { name, description, category, imageUrl, variations } = body;

    if (!name || !category || !variations || variations.length === 0) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const updatedProduct = await prisma.$transaction(async (tx) => {
      await tx.productVariation.deleteMany({
        where: { productId },
      });

      const product = await tx.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          category,
          imageUrl,
          variations: {
            create: variations.map((v: { name: string; basePrice: number; includedComplements: number; includedFruits: number; }) => ({
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

      return product;
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('[PRODUCT_PUT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
