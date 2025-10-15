/**
 * Authentication Middleware Handler
 * 
 * Main middleware logic that orchestrates token validation,
 * access control, and redirects.
 * 
 * This is used by the root middleware.ts file.
 * 
 * @module middleware/handler
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  shouldSkipMiddleware,
  validateToken,
  getRedirectDecision,
  createLoginRedirect,
} from './utils'

/**
 * Main middleware handler function
 * 
 * This function:
 * 1. Checks if middleware should run on this route
 * 2. Validates authentication token
 * 3. Fetches user data from API
 * 4. Applies access control rules
 * 5. Redirects or allows access
 * 
 * @param request - Next.js request object
 * @returns Response (redirect or allow)
 * 
 * @example
 * // In middleware.ts:
 * export async function middleware(request: NextRequest) {
 *   return handleAuthMiddleware(request)
 * }
 */
export async function handleAuthMiddleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes and static files
  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next()
  }

  // Get authentication token from cookies
  const token = request.cookies.get('auth_token')?.value

  // No token = not authenticated → redirect to login
  if (!token) {
    console.log('🔒 [Middleware] No token found for:', pathname)
    const loginUrl = createLoginRedirect(pathname, request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Validate token and fetch user data
  const validation = await validateToken(token)

  // Token validation failed → redirect to login
  if (!validation.valid || !validation.user) {
    console.log('🔒 [Middleware] Token validation failed:', validation.error)
    const loginUrl = createLoginRedirect(pathname, request.url)
    const response = NextResponse.redirect(loginUrl)
    
    // Clear invalid token
    response.cookies.delete('auth_token')
    
    return response
  }

  const user = validation.user

  // Check if user should be redirected based on status
  const redirectDecision = getRedirectDecision(user.status, pathname)

  if (redirectDecision.shouldRedirect && redirectDecision.redirectUrl) {
    console.log(
      `🚦 [Middleware] Redirecting ${user.status} user from ${pathname} to ${redirectDecision.redirectUrl}`,
      `(${redirectDecision.reason})`
    )
    return NextResponse.redirect(new URL(redirectDecision.redirectUrl, request.url))
  }

  // Access granted
  console.log(`✅ [Middleware] Access granted to ${pathname} for ${user.status} user (${user.email})`)
  return NextResponse.next()
}
