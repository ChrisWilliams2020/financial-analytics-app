import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple middleware - no auth required for demo
export function middleware(request: NextRequest) {
  // Just pass through all requests
  return NextResponse.next()
}

// Optional: Only run middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
