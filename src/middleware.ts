import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  // Only handle devoperations.ca (without www)
  if (host === 'devoperations.ca') {
    // Redirect to www version for consistency
    const url = request.nextUrl.clone();
    url.host = 'www.devoperations.ca';
    return NextResponse.redirect(url, 301); // Permanent redirect
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
