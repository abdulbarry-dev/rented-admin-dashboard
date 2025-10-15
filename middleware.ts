/**
 * Next.js Middleware Entry Point
 * 
 * This file uses the middleware module from lib/middleware for all logic.
 * See lib/middleware/README.md for documentation.
 * 
 * @see lib/middleware
 */

import { handleAuthMiddleware } from '@/lib/middleware'
import type { NextRequest } from 'next/server'

/**
 * Main middleware function
 * Delegates to handleAuthMiddleware from lib/middleware
 */
export async function middleware(request: NextRequest) {
  return handleAuthMiddleware(request)
}

/**
 * Configure which paths the middleware runs on
 * Runs on all routes except static files and images
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
