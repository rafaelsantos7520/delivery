import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, context: { params: { complementId: string } }) {
  try {
    const { complementId } = context.params;
    const complement = await prisma.complement.findUnique({
      where: {
        id: complementId,
      },
    });

    if (!complement) {
      return new NextResponse(JSON.stringify({ message: "Complement not found" }), { status: 404 });
    }

    return NextResponse.json(complement);
  } catch (error) {
    console.error('[COMPLEMENT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: { complementId: string } }) {
  try {
    const { complementId } = context.params;
    const body = await req.json();
    const { name, type, extraPrice, included, imageUrl } = body;

    if (!name || !type) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const complement = await prisma.complement.update({
      where: {
        id: complementId,
      },
      data: {
        name,
        type,
        extraPrice,
        included,
        imageUrl,
      },
    });

    return NextResponse.json(complement);
  } catch (error) {
    console.error('[COMPLEMENT_PUT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { complementId: string } }) {
  try {
    const { complementId } = context.params;
    await prisma.complement.delete({
      where: {
        id: complementId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[COMPLEMENT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}