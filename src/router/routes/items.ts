// ROUTE FILE PURPOSE: Item management routes (requires Content Moderator+ role)
//
// ROUTE DEFINITIONS:
// All marketplace item/listing management routes
//
// ROUTES INCLUDED:
// - /items - Item list with search and filters
// - /items/:id - Individual item detail page
// - /items/reported - User-reported items
//
// META PROPERTIES:
// - requiresAuth: true (must be logged in)
// - roles: ['super_admin', 'operations_manager', 'content_moderator'] (minimum role required)
// - permissions: ['items.*'] (item management permissions)
// - layout: 'default' (use main layout)

import type { RouteRecordRaw } from 'vue-router'

const itemRoutes: RouteRecordRaw[] = [
  {
    path: '/items',
    name: 'items',
    component: () => import('@/pages/items/ItemList.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'content_moderator'],
      permissions: ['items.view'],
      layout: 'default',
      title: 'Items',
      breadcrumb: 'Items',
      icon: 'shopping-bag',
      showInMenu: true,
      order: 40
    }
    // IMPLEMENTATION NOTES:
    // - Display all marketplace items/listings
    // - Support search by title, description, seller
    // - Filter by category, status, price range
    // - Sort by date, price, popularity
    // - Bulk status updates (approve, reject, feature)
  },
  {
    path: '/items/:id',
    name: 'item-detail',
    component: () => import('@/pages/items/ItemDetail.vue'),
    props: true,
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'content_moderator'],
      permissions: ['items.view'],
      layout: 'default',
      title: 'Item Details',
      breadcrumb: 'Items > Details',
      showInMenu: false
    },
    beforeEnter: (to, from, next) => {
      // VALIDATION:
      // 1. Verify :id parameter is valid
      // 2. Check if item exists
      // 3. If not found, redirect to items list with error

      // PERMISSION CHECK:
      // 1. Verify admin can view this item
      // 2. Some items may be restricted (e.g., deleted items)

      next()
    }
    // IMPLEMENTATION NOTES:
    // - Display complete item information
    // - Show all photos in gallery
    // - Display seller information
    // - Show performance metrics (views, saves)
    // - Provide admin actions: approve, reject, feature, delete
  },
  {
    path: '/items/reported',
    name: 'items-reported',
    component: () => import('@/pages/items/ReportedItems.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'content_moderator'],
      permissions: ['items.reports'],
      layout: 'default',
      title: 'Reported Items',
      breadcrumb: 'Items > Reported',
      icon: 'flag',
      showInMenu: true,
      menuGroup: 'items',
      order: 43,
      badge: 'reported-items-count'
    }
    // IMPLEMENTATION NOTES:
    // - Display user-reported items
    // - Review report details and evidence
    // - Investigate policy violations
    // - Take action: remove, warn seller, dismiss
    // - Track reporter credibility
  }
]

// ITEM MANAGEMENT ROUTE GUARDS:
//
// ROLE-BASED ACCESS:
// - Super Admin: Full access to all item management features
// - Operations Manager: View, edit, approve items
// - Content Moderator: View, moderate, approve/reject items (no edit)
// - Other roles: No access to item management
//
// PERMISSION CHECKS:
// - items.view: View item list and details
// - items.edit: Edit item information
// - items.reports: Handle user reports
// - items.delete: Delete items (Super Admin only)
//
// AUDIT LOGGING:
// - Log all item modifications
// - Track approval/rejection decisions
// - Monitor report resolutions
//
// PERFORMANCE CONSIDERATIONS:
// - Lazy load item images in list view
// - Paginate large item lists
// - Optimize search queries with filters

export default itemRoutes
