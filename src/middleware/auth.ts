import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { CustomMiddleware } from './chain';

export function auth(middleware: CustomMiddleware): CustomMiddleware {

 return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
 const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
 const pathname = request.nextUrl.pathname;
 if (!token && (pathname !== '/home' && pathname !== '/login' && pathname !== '/register' && pathname !== '/forget' && pathname !== '/verification' && pathname !== '/update-password')) {
   return NextResponse.redirect(new URL('/login', request.url));
 }
 
 if (token && (pathname === '/login' || pathname === '/register')) {
   return NextResponse.redirect(new URL('/', request.url));}

//  if (token && pathname === '/home') {
//    return NextResponse.redirect(new URL('/forum', request.url));
//  }

return middleware(request, event, response);
 };

}