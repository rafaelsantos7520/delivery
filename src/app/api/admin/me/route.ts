
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    console.log('Checking admin me...');
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    console.log('Token:', token);

    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, login: true, active: true },
    });

    if (!admin) {
      return new NextResponse(JSON.stringify({ message: 'Admin não encontrado' }), { status: 404 });
    }

    return NextResponse.json(admin);

  } catch {
    return new NextResponse(JSON.stringify({ message: 'Token inválido ou expirado' }), { status: 401 });
  }
}
