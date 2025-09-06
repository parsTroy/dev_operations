import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily disable all redirects to fix auth
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Disable middleware for now
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
