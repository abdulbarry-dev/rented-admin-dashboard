// ROUTE FILE PURPOSE: Dashboard route (requires authentication)
//
// ROUTE DEFINITIONS:
// Main dashboard overview with real-time metrics and KPIs
//
// ROUTES INCLUDED:
// - / (root) - Dashboard overview page
// - /dashboard - Alias to root
//
// META PROPERTIES:
// - requiresAuth: true (must be logged in)
// - permissions: ['dashboard.view'] (basic permission for all admins)
// - layout: 'default' (use main layout with sidebar and navbar)

import type { RouteRecordRaw } from 'vue-router'

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/DashboardOverview.vue'),
    meta: {
      requiresAuth: true, // User must be authenticated
      permissions: ['dashboard.view'], // Required permission
      layout: 'default', // Use main layout with sidebar/navbar
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
      icon: 'dashboard', // Icon for navigation menu
      order: 1, // Menu order (first item)
      showInMenu: true // Display in navigation menu
    }
  },
  {
    path: '/dashboard',
    redirect: '/', // Redirect /dashboard to root /
    meta: {
      showInMenu: false // Don't show duplicate in menu
    }
  }
]

// DASHBOARD ACCESS CONTROL:
//
// AUTHENTICATION REQUIREMENT:
// - All admins must be authenticated to access dashboard
// - Redirect unauthenticated users to /login
//
// PERMISSION CHECK:
// - Verify user has 'dashboard.view' permission
// - This is a basic permission granted to all admin roles
// - If permission denied, redirect to /unauthorized
//
// ROLE-BASED DATA VISIBILITY:
// - Different admin roles see different dashboard metrics
// - Super Admin: All metrics, all data
// - Operations Manager: User metrics, verification metrics, transaction metrics
// - Content Moderator: Item metrics, moderation queue metrics
// - Support Agent: User support metrics, communication metrics
// - Financial Admin: Revenue metrics, transaction metrics, financial KPIs
//
// REAL-TIME UPDATES:
// - Dashboard connects to WebSocket for real-time metric updates
// - Establish WebSocket connection after route navigation
// - Disconnect WebSocket when leaving dashboard
//
// DATA LOADING STRATEGY:
// - Load critical KPIs immediately (skeleton loading state)
// - Lazy load charts and detailed metrics
// - Cache dashboard data for 30 seconds to reduce API calls
// - Auto-refresh metrics every 30-60 seconds
//
// NAVIGATION FROM DASHBOARD:
// - KPI cards clickable to navigate to detail pages:
//   * Users card → /users
//   * Verifications card → /verification/queue
//   * Items card → /items
//   * Transactions card → /transactions
//   * Revenue card → /analytics/revenue
// - Quick action buttons for common tasks

export default dashboardRoutes
