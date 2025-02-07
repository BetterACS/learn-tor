import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { CustomMiddleware } from './chain';
import verifyJWT from '@/utils/verifyJWT';

export function updatePassword(middleware: CustomMiddleware): CustomMiddleware {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const url = request.nextUrl;
    const params = url.searchParams;

    if (url.pathname !== '/update-password') {
      return middleware(request, event, response);
    }

    const token = params.get('token');
    console.log("Token:", token);

    if (!token) {
      return NextResponse.redirect(new URL('/verification', request.url));
    }

    try {
      const data = await verifyJWT(token);
      console.log("Response Data:", data);

      // Ensure the structure of `data` is properly checked
      if (!data || !data.result || !data.result.data || !data.result.data.status) {
        console.error("Invalid response structure:", data);
        return NextResponse.redirect(new URL('/verification', request.url));
      }

      const status = data.result.data.status;
      console.log("data.result.data.status:", status);

      if (status !== 200) {
        return NextResponse.redirect(new URL('/verification', request.url));
      }

      return middleware(request, event, response);
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.redirect(new URL('/verification', request.url));
    }
  };
}
