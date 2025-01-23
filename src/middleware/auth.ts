import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { CustomMiddleware } from './chain';

export function auth(middleware: CustomMiddleware): CustomMiddleware {

 return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
 const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
 const pathname = request.nextUrl.pathname;
 if (!token && (pathname !== '/forget' && pathname !== '/verification' && pathname !== '/update-password')) {
    return NextResponse.redirect(new URL('/login', request.url));
 }

return middleware(request, event, response);
 };

}