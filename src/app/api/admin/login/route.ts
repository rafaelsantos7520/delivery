
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { login, password } = await req.json();

    const admin = await prisma.admin.findUnique({
      where: { login },
    });

    if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
      return new NextResponse(JSON.stringify({ message: 'Credenciais inválidas' }), { status: 401 });
    }

    const token = jwt.sign({ id: admin.id, login: admin.login }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '1d',
    });

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return new NextResponse(JSON.stringify({ message: 'Login bem-sucedido' }), { status: 200 });

  } catch (error) {
    console.error('[ADMIN_LOGIN_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
