/**
 * Client-side authentication utilities
 * 
 * Provides hooks and HOCs for protecting routes and components
 * based on user authentication status and role.
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export type AdminRole = 'super' | 'moderator'
export type AdminStatus = 'verified' | 'pending' | 'banned'

export interface AdminUser {
  id: string
  name: string
  email: string
  phone?: string
  role: AdminRole
  status: AdminStatus
  [key: string]: any
}

/**
 * Fetch current authenticated admin from Laravel API
 */
export async function fetchAuthenticatedAdmin(): Promise<AdminUser | null> {
  try {
    const response = await api.get('/user')
    return response.data.user || response.data
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return null
  }
}

/**
 * Hook to check authentication and redirect based on status
 * 
 * @param allowedStatuses - Array of statuses that can access this page
 * @param redirectMap - Custom redirect URLs for different statuses
 */
export function useAuthGuard(
  allowedStatuses: AdminStatus[] = ['verified'],
  redirectMap?: Partial<Record<AdminStatus, string>>
) {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const adminUser = await fetchAuthenticatedAdmin()

      if (!adminUser) {
        // Not authenticated - redirect to login
        router.push('/login')
        return
      }

      // Check if user status is allowed
      if (!allowedStatuses.includes(adminUser.status)) {
        // User status not allowed - redirect based on status
        const defaultRedirects: Record<AdminStatus, string> = {
          verified: '/dashboard',
          pending: '/verification',
          banned: '/banned',
        }

        const redirectUrl = redirectMap?.[adminUser.status] || defaultRedirects[adminUser.status]
        router.push(redirectUrl)
        return
      }

      // User is authorized
      setUser(adminUser)
      setAuthorized(true)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, authorized }
}

/**
 * Hook specifically for the verification page
 * Only allows pending users
 */
export function useVerificationGuard() {
  return useAuthGuard(['pending'], {
    verified: '/dashboard',
    banned: '/banned',
  })
}

/**
 * Hook specifically for the dashboard
 * Only allows verified users
 */
export function useDashboardGuard() {
  return useAuthGuard(['verified'], {
    pending: '/verification',
    banned: '/banned',
  })
}

/**
 * Hook to get current admin without redirects
 * Useful for components that need user data but don't control access
 */
export function useCurrentAdmin() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    try {
      const adminUser = await fetchAuthenticatedAdmin()
      setUser(adminUser)
    } catch (error) {
      console.error('Failed to load user:', error)
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, refetch: loadUser }
}

/**
 * Higher-Order Component to protect pages based on status
 * 
 * @example
 * export default withAuthGuard(VerificationPage, ['pending'])
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  allowedStatuses: AdminStatus[] = ['verified'],
  redirectMap?: Partial<Record<AdminStatus, string>>
) {
  return function AuthGuardedComponent(props: P) {
    const { user, loading, authorized } = useAuthGuard(allowedStatuses, redirectMap)

    if (loading) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Verifying access...</p>
          </div>
        </div>
      )
    }

    if (!authorized) {
      return null // Router will handle redirect
    }

    return <Component {...props} user={user} />
  }
}

/**
 * HOC specifically for verification page
 */
export function withVerificationGuard<P extends object>(
  Component: React.ComponentType<P>
) {
  return withAuthGuard(Component, ['pending'], {
    verified: '/dashboard',
    banned: '/banned',
  })
}

/**
 * HOC specifically for dashboard pages
 */
export function withDashboardGuard<P extends object>(
  Component: React.ComponentType<P>
) {
  return withAuthGuard(Component, ['verified'], {
    pending: '/verification',
    banned: '/banned',
  })
}

/**
 * Check if user has specific role
 */
export function hasRole(user: AdminUser | null, roles: AdminRole[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

/**
 * Check if user has specific status
 */
export function hasStatus(user: AdminUser | null, statuses: AdminStatus[]): boolean {
  if (!user) return false
  return statuses.includes(user.status)
}
