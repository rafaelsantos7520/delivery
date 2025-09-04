
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

// Desabilitar cache para esta rota
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        variations: true,
        categoryRelation: true,
        complements: {
          where: {
            active: true,
          },
          include: {
            complement: true,
          },
        },
      },
    });
    
    console.log(product);
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
    const { name, description, categoryId, imageUrl, variations, complementIds } = body;

    if (!name || !categoryId || !variations || variations.length === 0) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const updatedProduct = await prisma.$transaction(async (tx) => {
      await tx.productVariation.deleteMany({
        where: { productId },
      });

      // Remover associações de complementos existentes
      await tx.productComplement.deleteMany({
        where: { productId },
      });

      const product = await tx.product.update({
        where: { id: productId },
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
          // Criar novas associações com complementos se fornecidos
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

    revalidateTag('products');
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
