
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const complements = await prisma.complement.findMany();
    return NextResponse.json(complements);
  } catch (error) {
    console.error('[COMPLEMENTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, extraPrice, included, imageUrl } = body;

    if (!name || !type) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const complement = await prisma.complement.create({
      data: {
        name,
        type,
        extraPrice,
        included,
        imageUrl,
      },
    });

    return NextResponse.json(complement, { status: 201 });
  } catch (error) {
    console.error('[COMPLEMENTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
