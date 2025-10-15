/**
 * Middleware Module
 * 
 * Central export point for all middleware functionality.
 * Import from this file to access middleware features.
 * 
 * @module middleware
 * 
 * @example
 * // In middleware.ts:
 * import { handleAuthMiddleware } from '@/lib/middleware'
 * 
 * export async function middleware(request: NextRequest) {
 *   return handleAuthMiddleware(request)
 * }
 */

// Main handler
export { handleAuthMiddleware } from './handler'

// Utilities
export {
  isPublicRoute,
  shouldSkipMiddleware,
  validateToken,
  getRedirectDecision,
  createLoginRedirect,
} from './utils'

// Configuration
export {
  ROUTE_ACCESS_RULES,
  PUBLIC_ROUTES,
  API_CONFIG,
  STATUS_REDIRECTS,
  type AdminRole,
  type AdminStatus,
} from './config'

// Types
export type {
  UserData,
  UserApiResponse,
  TokenValidationResult,
  RedirectDecision,
} from './types'
