// ROUTE FILE PURPOSE: User management routes (requires Operations Manager+ role)
//
// ROUTE DEFINITIONS:
// All user management and administration routes
//
// ROUTES INCLUDED:
// - /users - User list with search and filters
// - /users/:id - Individual user detail page
// - /users/:id/transactions - User's transaction history
// - /users/bulk-actions - Bulk user operations
//
// META PROPERTIES:
// - requiresAuth: true (must be logged in)
// - roles: ['super_admin', 'operations_manager', 'support_agent'] (minimum role required)
// - permissions: ['users.*'] (user management permissions)
// - layout: 'default' (use main layout)

import type { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/users/UserList.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'support_agent'],
      permissions: ['users.view'],
      layout: 'default',
      title: 'Users',
      breadcrumb: 'Users',
      icon: 'users',
      showInMenu: true,
      order: 30
    }
    // IMPLEMENTATION NOTES:
    // - Display all registered users with search and filters
    // - Support pagination (50-100 users per page)
    // - Advanced filtering by verification status, account status, date
    // - Export user data to CSV/Excel
    // - Quick actions: view profile, suspend, message
  },
  {
    path: '/users/:id',
    name: 'user-detail',
    component: () => import('@/pages/users/UserDetails.vue'),
    props: true, // Pass :id as prop
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'support_agent'],
      permissions: ['users.view'],
      layout: 'default',
      title: 'User Details',
      breadcrumb: 'Users > Details',
      showInMenu: false
    },
    beforeEnter: (to, from, next) => {
      // VALIDATION:
      // 1. Verify :id parameter is valid
      // 2. Check if user exists in system
      // 3. If user not found, redirect to users list with error
      // 4. Load user data before navigation

      // PERMISSION CHECK:
      // 1. Verify admin has permission to view this user's data
      // 2. Some sensitive data requires additional permissions
      // 3. Track user profile access in audit log

      next()
    }
    // IMPLEMENTATION NOTES:
    // - Display complete user profile information
    // - Show verification status and history
    // - Display account activity and statistics
    // - Provide admin actions: edit, suspend, verify, delete
    // - Show tabs: Overview, Transactions, Activity, Notes
  },
  {
    path: '/users/:id/transactions',
    name: 'user-transactions',
    component: () => import('@/pages/users/UserTransactions.vue'),
    props: true,
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'financial_admin'],
      permissions: ['users.view', 'transactions.view'],
      layout: 'default',
      title: 'User Transactions',
      breadcrumb: 'Users > Transactions',
      showInMenu: false
    }
    // IMPLEMENTATION NOTES:
    // - Display all transactions for specific user
    // - Show both purchases and sales
    // - Calculate financial metrics (total spent, total earned)
    // - Filter by transaction type and status
    // - Export transaction history
  }
]

// USER MANAGEMENT ROUTE GUARDS:
//
// ROLE-BASED ACCESS:
// - Super Admin: Full access to all user management features
// - Operations Manager: User management, suspend/activate users
// - Support Agent: View users, communicate, basic actions (no suspend/delete)
// - Other roles: No access to user management
//
// PERMISSION CHECKS:
// - users.view: View user list and profiles
// - users.edit: Edit user information
// - users.manage: Suspend, activate, delete users
// - users.communicate: Send messages to users
// - users.bulk: Perform bulk operations
// - transactions.view: View user transactions (for financial data)
//
// SENSITIVE DATA ACCESS:
// - Phone numbers, addresses: Requires additional permission
// - Payment information: Financial Admin or Super Admin only
// - Verification documents: Operations Manager or Super Admin only
// - Communication history: Support Agent or higher
//
// AUDIT LOGGING:
// - Log all user profile accesses
// - Track user data modifications
// - Record suspension/activation actions
// - Monitor bulk operations
// - Audit message communications
//
// NAVIGATION PATTERNS:
// - User List → User Detail → Edit/Suspend/Message
// - User Detail → Transactions → Transaction Detail
// - User Detail → Communication → Send Message
// - User List → Bulk Actions → Select Users → Execute
//
// DATA PRIVACY:
// - Mask sensitive data by default (show last 4 digits of phone)
// - Require explicit action to reveal full data
// - Track who accessed sensitive information
// - Comply with GDPR and privacy regulations

export default userRoutes
