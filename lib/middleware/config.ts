/**
 * Middleware Configuration
 * 
 * Centralized configuration for authentication middleware.
 * Update these constants to modify access control rules.
 * 
 * @module middleware/config
 */

/**
 * Admin roles in the system
 */
export type AdminRole = 'super' | 'moderator'

/**
 * Admin verification statuses
 */
export type AdminStatus = 'verified' | 'pending' | 'banned'

/**
 * Route access configuration
 * Maps routes to allowed user statuses
 */
export const ROUTE_ACCESS_RULES: Record<string, { allowedStatuses: AdminStatus[] }> = {
  '/verification': { 
    allowedStatuses: ['pending'] 
  },
  '/dashboard': { 
    allowedStatuses: ['verified'] 
  },
  '/banned': { 
    allowedStatuses: ['banned'] 
  },
}

/**
 * Public routes that don't require authentication
 * These routes are accessible without a token
 */
export const PUBLIC_ROUTES = [
  '/login',
  '/register',
]

/**
 * API configuration
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  userEndpoint: '/user',
}

/**
 * Redirect rules based on user status
 * When a user with a certain status tries to access a page,
 * redirect them to the appropriate location
 */
export const STATUS_REDIRECTS: Record<AdminStatus, string> = {
  verified: '/dashboard',
  pending: '/verification',
  banned: '/banned',
}
