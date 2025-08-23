
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return new NextResponse(JSON.stringify({ message: "Missing status field" }), { status: 400 });
    }

    const order = await prisma.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('[ORDER_PUT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
