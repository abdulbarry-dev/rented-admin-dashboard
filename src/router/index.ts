// MAIN ROUTER INDEX FILE
//
// PURPOSE:
// Central router configuration that imports and combines all modular route files
// Sets up navigation guards and router instance
//
// IMPLEMENTATION NOTES:

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import all route modules
import authRoutes from './routes/auth'
import dashboardRoutes from './routes/dashboard'
import verificationRoutes from './routes/verification'
import userRoutes from './routes/users'
import itemRoutes from './routes/items'
import transactionRoutes from './routes/transactions'
import analyticsRoutes from './routes/analytics'
import settingsRoutes from './routes/settings'
import auditRoutes from './routes/audit'

// Import navigation guards
// import { authGuard } from './guards/auth.guard'
// import { roleGuard } from './guards/role.guard'
// import { permissionGuard } from './guards/permission.guard'

// COMBINE ALL ROUTES:
// Merge all route arrays into single routes configuration
const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...verificationRoutes,
  ...userRoutes,
  ...itemRoutes,
  ...transactionRoutes,
  ...analyticsRoutes,
  ...settingsRoutes,
  ...auditRoutes,

  // ERROR ROUTES:
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/pages/errors/UnauthorizedError.vue'),
    meta: {
      layout: 'auth',
      title: 'Unauthorized Access'
    }
    // IMPLEMENTATION NOTES:
    // - Show when user lacks required role or permission
    // - Display current role and required role/permission
    // - Provide contact information for access request
    // - Show link to return to previous page
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('@/pages/errors/NotFoundError.vue'), // Ensure this file exists at the specified path
    meta: {
      layout: 'auth',
      title: 'Page Not Found'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
    // Catch-all route for 404 errors
  }
]

// CREATE ROUTER INSTANCE:
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // SCROLL BEHAVIOR:
    // - Return to saved scroll position when using browser back/forward
    // - Scroll to top on new navigation
    // - Scroll to anchor if hash present in URL

    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0 }
    }
  }
})

// NAVIGATION GUARDS:
//
// GUARD EXECUTION ORDER:
// 1. authGuard - Check authentication
// 2. roleGuard - Check role requirements
// 3. permissionGuard - Check fine-grained permissions
//
// IMPLEMENTATION:
// router.beforeEach(authGuard)
// router.beforeEach(roleGuard)
// router.beforeEach(permissionGuard)
//
// GUARD LOGIC FLOW:
// 1. Check if route requires authentication (meta.requiresAuth)
// 2. If yes, verify user is logged in (authGuard)
// 3. Check if route requires specific roles (meta.roles)
// 4. If yes, verify user has required role (roleGuard)
// 5. Check if route requires specific permissions (meta.permissions)
// 6. If yes, verify user has required permissions (permissionGuard)
// 7. If all checks pass, allow navigation
// 8. If any check fails, redirect to appropriate error page
//
// SPECIAL ROUTE HANDLING:
// - Guest routes (meta.requiresGuest): Redirect authenticated users to dashboard
// - Public routes: No authentication required
// - ID verification required (meta.requiresIdVerification): Check if admin has uploaded ID
//
// LOADING STATES:
// - Show loading spinner during route navigation
// - Handle async route components with loading component
// - Timeout after 10 seconds if route fails to load
//
// ERROR HANDLING:
// - Catch navigation errors
// - Handle duplicate navigation (navigating to same route)
// - Handle navigation cancellation
// - Show error message for failed navigation

// NAVIGATION PROGRESS BAR:
// router.beforeEach((to, from, next) => {
//   // Start progress bar
//   // NProgress.start()
//   next()
// })
//
// router.afterEach(() => {
//   // Complete progress bar
//   // NProgress.done()
// })

// ROUTE CHANGE TRACKING:
// router.afterEach((to, from) => {
//   // Track page views in analytics
//   // analytics.track('page_view', { path: to.path, title: to.meta.title })
//
//   // Update page title
//   document.title = `${to.meta.title || 'Admin'} - Rented Admin Dashboard`
// })

// MIDDLEWARE SYSTEM:
// Support for custom middleware functions in route meta
// router.beforeEach((to, from, next) => {
//   const middleware = to.meta.middleware
//   if (middleware) {
//     // Execute middleware functions
//     // executeMiddleware(middleware, to, from, next)
//   } else {
//     next()
//   }
// })

export default router
