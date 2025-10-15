/**
 * Middleware Types
 * 
 * Type definitions for middleware functionality.
 * 
 * @module middleware/types
 */

import type { AdminRole, AdminStatus } from './config'

/**
 * User data returned from the API
 */
export interface UserData {
  id: string
  name: string
  email: string
  phone?: string
  role: AdminRole
  status: AdminStatus
  [key: string]: any
}

/**
 * API response structure for user endpoint
 */
export interface UserApiResponse {
  user?: UserData
  [key: string]: any
}

/**
 * Result of token validation
 */
export interface TokenValidationResult {
  valid: boolean
  user?: UserData
  error?: string
}

/**
 * Redirect decision result
 */
export interface RedirectDecision {
  shouldRedirect: boolean
  redirectUrl?: string
  reason?: string
}
