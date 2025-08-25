
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: -1, // Expire the cookie immediately
      path: '/',
    });

    return new NextResponse(JSON.stringify({ message: 'Logout bem-sucedido' }), { status: 200 });

  } catch (error) {
    console.error('[ADMIN_LOGOUT_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
