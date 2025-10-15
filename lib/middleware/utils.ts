/**
 * Middleware Utilities
 * 
 * Helper functions for middleware logic.
 * These functions handle specific tasks like token validation,
 * access control, and redirect logic.
 * 
 * @module middleware/utils
 */

import { API_CONFIG, PUBLIC_ROUTES, STATUS_REDIRECTS, type AdminStatus } from './config'
import type { TokenValidationResult, RedirectDecision, UserApiResponse, UserData } from './types'

/**
 * Check if a route is public (doesn't require authentication)
 * 
 * @param pathname - The path to check
 * @returns True if the route is public
 * 
 * @example
 * isPublicRoute('/login') // true
 * isPublicRoute('/dashboard') // false
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname)
}

/**
 * Check if a path should skip middleware
 * (static files, API routes, etc.)
 * 
 * @param pathname - The path to check
 * @returns True if middleware should be skipped
 * 
 * @example
 * shouldSkipMiddleware('/_next/static/...') // true
 * shouldSkipMiddleware('/dashboard') // false
 */
export function shouldSkipMiddleware(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') || // Static files (images, fonts, etc.)
    isPublicRoute(pathname)
  )
}

/**
 * Validate authentication token and fetch user data
 * 
 * @param token - Bearer token to validate
 * @returns Validation result with user data or error
 * 
 * @example
 * const result = await validateToken('abc123...')
 * if (result.valid) {
 *   console.log('User:', result.user)
 * }
 */
export async function validateToken(token: string): Promise<TokenValidationResult> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.userEndpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache user data
    })

    // Token is invalid or expired
    if (response.status === 401) {
      return {
        valid: false,
        error: 'Token invalid or expired',
      }
    }

    // Other API errors
    if (!response.ok) {
      return {
        valid: false,
        error: `API error: ${response.status}`,
      }
    }

    const data: UserApiResponse = await response.json()
    const user = data.user || (data as any as UserData)

    // Validate user data structure
    if (!user || !user.status || !user.role) {
      return {
        valid: false,
        error: 'Invalid user data structure',
      }
    }

    return {
      valid: true,
      user: user as UserData,
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Determine if user should be redirected based on their status and current path
 * 
 * This implements the core access control logic:
 * - Banned users → /banned
 * - Pending users → /verification
 * - Verified users → /dashboard (if trying to access /verification)
 * 
 * @param userStatus - User's verification status
 * @param currentPath - Current path user is trying to access
 * @returns Redirect decision with URL if redirect is needed
 * 
 * @example
 * const decision = getRedirectDecision('pending', '/dashboard')
 * if (decision.shouldRedirect) {
 *   // Redirect to decision.redirectUrl
 * }
 */
export function getRedirectDecision(
  userStatus: AdminStatus,
  currentPath: string
): RedirectDecision {
  // Banned users can only access /banned
  if (userStatus === 'banned') {
    if (currentPath !== '/banned') {
      return {
        shouldRedirect: true,
        redirectUrl: '/banned',
        reason: 'User is banned',
      }
    }
    return { shouldRedirect: false }
  }

  // Verified users should not access verification page
  if (userStatus === 'verified') {
    if (currentPath === '/verification') {
      return {
        shouldRedirect: true,
        redirectUrl: '/dashboard',
        reason: 'User already verified',
      }
    }
    if (currentPath === '/banned') {
      return {
        shouldRedirect: true,
        redirectUrl: '/dashboard',
        reason: 'Verified users cannot access banned page',
      }
    }
    return { shouldRedirect: false }
  }

  // Pending users can only access verification page
  if (userStatus === 'pending') {
    if (currentPath !== '/verification' && currentPath !== '/banned') {
      return {
        shouldRedirect: true,
        redirectUrl: '/verification',
        reason: 'User pending verification',
      }
    }
    if (currentPath === '/banned') {
      return {
        shouldRedirect: true,
        redirectUrl: '/verification',
        reason: 'Pending users cannot access banned page',
      }
    }
    return { shouldRedirect: false }
  }

  // No redirect needed
  return { shouldRedirect: false }
}

/**
 * Create a login redirect URL with optional return path
 * 
 * @param currentPath - Current path to return to after login
 * @param baseUrl - Base URL for the application
 * @returns URL object for login page
 * 
 * @example
 * const url = createLoginRedirect('/dashboard', 'https://example.com')
 * // Returns URL to: /login?redirect=/dashboard
 */
export function createLoginRedirect(currentPath: string, baseUrl: string): URL {
  const loginUrl = new URL('/login', baseUrl)
  if (currentPath !== '/') {
    loginUrl.searchParams.set('redirect', currentPath)
  }
  return loginUrl
}
