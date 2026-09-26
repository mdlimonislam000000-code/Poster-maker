import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

  const sessionCookie = request.cookies.get('better-auth.session_token') || request.cookies.get('__Secure-better-auth.session_token');

  const { pathname } = request.nextUrl;
  const protectedPaths = ['/create-poster', '/dashboard', '/templates'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create-poster/:path*', '/dashboard/:path*', '/templates'],
};