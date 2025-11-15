// ROUTE FILE PURPOSE: Authentication routes (public and guest-only access)
//
// ROUTE DEFINITIONS:
// All authentication-related routes that don't require user to be logged in
// Some routes should redirect authenticated users away (guest-only)
//
// ROUTES INCLUDED:
// - /login - Admin login page
// - /register - Admin registration (Super Admin only, or public if first admin)
// - /two-factor-auth - 2FA verification step
// - /forgot-password - Password recovery request
// - /reset-password/:token - Password reset with token
// - /confirm-account/:token - Email confirmation
//
// META PROPERTIES:
// - requiresGuest: true (redirect to dashboard if already authenticated)
// - layout: 'auth' (use authentication layout without sidebar/navbar)
// - public: true (no authentication required)

import type { RouteRecordRaw } from 'vue-router'

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: {
      requiresGuest: true, // Only accessible when not logged in
      layout: 'auth', // Use auth layout (centered, no sidebar)
      title: 'Admin Login',
      description: 'Sign in to admin dashboard'
    }
  },
  {
    path: '/two-factor-auth',
    name: 'two-factor-auth',
    component: () => import('@/pages/auth/TwoFactorAuth.vue'),
    meta: {
      requiresGuest: true, // Accessible during login flow only
      requiresSessionId: true, // Must have valid session from login step
      layout: 'auth',
      title: 'Two-Factor Authentication',
      description: 'Enter verification code'
    }
    // IMPLEMENTATION NOTES:
    // - Check for sessionId in route params or session storage
    // - If no sessionId, redirect to /login
    // - After successful 2FA, complete login and redirect to dashboard
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/auth/RegisterPage.vue'),
    meta: {
      requiresGuest: true,
      requiresSuperAdmin: true, // Only Super Admin can create new admin accounts
      // EXCEPTION: If no admins exist in system, allow public registration
      layout: 'auth',
      title: 'Admin Registration',
      description: 'Create new administrator account'
    }
    // IMPLEMENTATION NOTES:
    // - Check if any admins exist in system
    // - If no admins, allow public access (first admin setup)
    // - If admins exist, require Super Admin authentication
    // - Redirect authenticated non-Super-Admin users to dashboard
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/pages/auth/ForgotPassword.vue'),
    meta: {
      requiresGuest: true,
      layout: 'auth',
      title: 'Forgot Password',
      description: 'Request password reset link'
    }
  },
  {
    path: '/reset-password/:token',
    name: 'reset-password',
    component: () => import('@/pages/auth/ResetPassword.vue'),
    props: true, // Pass route params as props to component
    meta: {
      requiresGuest: true,
      layout: 'auth',
      title: 'Reset Password',
      description: 'Set new password'
    }
    // IMPLEMENTATION NOTES:
    // - Extract :token from route params
    // - Pass token to component via props
    // - Component validates token on mount
    // - If token invalid/expired, show error and redirect to forgot-password
  },
  {
    path: '/confirm-account/:token',
    name: 'confirm-account',
    component: () => import('@/pages/auth/ConfirmAccount.vue'),
    props: true,
    meta: {
      requiresGuest: true,
      layout: 'auth',
      title: 'Confirm Account',
      description: 'Verify your email address'
    }
    // IMPLEMENTATION NOTES:
    // - Extract :token from route params
    // - Auto-submit token to verification API on mount
    // - If successful, show success message and redirect to login after 3 seconds
    // - If failed, show error and provide resend option
  },
  {
    path: '/logout',
    name: 'logout',
    redirect: () => {
      // LOGOUT LOGIC:
      // 1. Clear authentication token from storage
      // 2. Clear user data from store/state
      // 3. Invalidate session on backend (call logout API)
      // 4. Redirect to login page
      // 5. Show logout success message

      // Example pseudo-code:
      // store.dispatch('auth/logout')
      // localStorage.removeItem('authToken')
      // sessionStorage.clear()

      return { name: 'login', query: { message: 'logged_out' } }
    },
    meta: {
      requiresAuth: true, // Must be logged in to log out
      title: 'Logout'
    }
  }
]

// NAVIGATION GUARDS FOR AUTH ROUTES:
//
// GUEST MIDDLEWARE:
// - Applied to all auth routes with requiresGuest: true
// - If user is authenticated, redirect to dashboard
// - Allow access if user is not authenticated
//
// SESSION VALIDATION (for 2FA):
// - Check for valid session ID from login step
// - Verify session hasn't expired
// - Redirect to login if invalid
//
// FIRST ADMIN CHECK (for register):
// - Query backend to check if any admins exist
// - If no admins, allow public registration
// - If admins exist, require Super Admin authentication
//
// TOKEN VALIDATION (for reset-password, confirm-account):
// - Extract token from URL params
// - Validate token format before component loads
// - Redirect to error page if token format invalid

export default authRoutes
