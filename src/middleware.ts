import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  // Only redirect devoperations.ca (without www) to www.devoperations.ca
  // This prevents CSRF issues by ensuring consistent domain usage
  if (host === 'devoperations.ca') {
    const url = request.nextUrl.clone();
    url.host = 'www.devoperations.ca';
    return NextResponse.redirect(url, 301);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only match the root domain, not any subpaths or API routes
    '/',
  ],
};
