
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
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

export async function PUT(req: Request, { params }: { params: { productId: string } }) {
  try {
    const body = await req.json();
    const { name, description, category, imageUrl, variations } = body;

    if (!name || !category || !variations || variations.length === 0) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const updatedProduct = await prisma.$transaction(async (tx) => {
      await tx.productVariation.deleteMany({
        where: { productId: params.productId },
      });

      const product = await tx.product.update({
        where: { id: params.productId },
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

      return product;
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('[PRODUCT_PUT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { productId: string } }) {
  try {
    await prisma.product.delete({
      where: {
        id: params.productId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
