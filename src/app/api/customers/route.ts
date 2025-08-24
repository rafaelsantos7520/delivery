
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        orders: true,
      }
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error('[CUSTOMERS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
