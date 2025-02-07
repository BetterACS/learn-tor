import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { CustomMiddleware } from './chain';

export function verificationCode(middleware: CustomMiddleware): CustomMiddleware {
   return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
 
     const url = request.nextUrl;
     const params = url.searchParams;
 
     const email = params.get('email');

     if (url.pathname === '/verification' && !email) {
       return NextResponse.redirect(new URL('/forget', request.url));
     }
 
     return middleware(request, event, response);
   };
 }
 