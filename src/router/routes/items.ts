// ROUTE FILE PURPOSE: Item management routes (requires Content Moderator+ role)
//
// ROUTE DEFINITIONS:
// All marketplace item/listing management routes
//
// ROUTES INCLUDED:
// - /items - Item list with search and filters
// - /items/:id - Individual item detail page
// - /items/:id/edit - Item editor page
// - /items/moderation - Moderation queue for pending items
// - /items/featured - Featured items management
// - /items/reported - User-reported items
// - /items/categories - Category management
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
    // - Provide admin actions: edit, approve, reject, feature, delete
  },
  {
    path: '/items/:id/edit',
    name: 'item-edit',
    component: () => import('@/pages/items/ItemEditor.vue'),
    props: true,
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'content_moderator'],
      permissions: ['items.edit'],
      layout: 'default',
      title: 'Edit Item',
      breadcrumb: 'Items > Edit',
      showInMenu: false
    },
    beforeEnter: (to, from, next) => {
      // VALIDATION:
      // 1. Verify item exists and can be edited
      // 2. Check if item is locked by another admin
      // 3. Prevent editing items in active transactions

      // PERMISSION CHECK:
      // 1. Verify admin has edit permission
      // 2. Log item edit access in audit trail

      next()
    }
    // IMPLEMENTATION NOTES:
    // - Load existing item data into editor
    // - Support editing all item fields
    // - Upload/delete/reorder photos
    // - Validate inputs before saving
    // - Track edit history and reason
    // - Notify seller of admin edits
  },
  {
    path: '/items/moderation',
    name: 'items-moderation',
    component: () => import('@/pages/items/ModerationQueue.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'content_moderator'],
      permissions: ['items.moderate'],
      layout: 'default',
      title: 'Moderation Queue',
      breadcrumb: 'Items > Moderation',
      icon: 'shield-check',
      showInMenu: true,
      menuGroup: 'items',
      order: 41,
      badge: 'pending-items-count' // Show count of pending items
    }
    // IMPLEMENTATION NOTES:
    // - Display pending items awaiting approval
    // - Show automated policy check results
    // - Support approve/reject with reasons
    // - Batch approval for compliant items
    // - Flag items for escalation
  },
  {
    path: '/items/featured',
    name: 'items-featured',
    component: () => import('@/pages/items/FeaturedListings.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'],
      permissions: ['items.feature'],
      layout: 'default',
      title: 'Featured Items',
      breadcrumb: 'Items > Featured',
      icon: 'star',
      showInMenu: true,
      menuGroup: 'items',
      order: 42
    }
    // IMPLEMENTATION NOTES:
    // - Manage featured/promoted items
    // - Set featured duration and placement
    // - Track featured item performance
    // - Schedule featuring campaigns
    // - Monitor feature slot availability
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
  },
  {
    path: '/items/categories',
    name: 'items-categories',
    component: () => import('@/pages/items/CategoryManagement.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin'], // Only Super Admin can manage categories
      permissions: ['categories.manage'],
      layout: 'default',
      title: 'Categories',
      breadcrumb: 'Items > Categories',
      icon: 'folder-tree',
      showInMenu: true,
      menuGroup: 'items',
      order: 44
    }
    // IMPLEMENTATION NOTES:
    // - Manage category hierarchy
    // - Create, edit, delete categories
    // - Set category-specific attributes
    // - Configure commission rates per category
    // - Reorder categories via drag-and-drop
  }
]

// ITEM MANAGEMENT ROUTE GUARDS:
//
// ROLE-BASED ACCESS:
// - Super Admin: Full access to all item management features
// - Operations Manager: View, edit, approve, feature items
// - Content Moderator: View, moderate, approve/reject items (no edit)
// - Other roles: No access to item management
//
// PERMISSION CHECKS:
// - items.view: View item list and details
// - items.edit: Edit item information
// - items.moderate: Approve/reject pending items
// - items.feature: Manage featured items
// - items.reports: Handle user reports
// - items.delete: Delete items (Super Admin only)
// - categories.manage: Manage categories (Super Admin only)
//
// CONTENT MODERATION WORKFLOW:
// - New items → Moderation Queue
// - Automated checks → Flag violations
// - Admin review → Approve or Reject
// - Approved → Live on marketplace
// - Rejected → Seller notified with reason
//
// ITEM LOCKING:
// - Lock item when admin opens editor
// - Prevent concurrent edits by multiple admins
// - Auto-release lock after timeout (15 minutes)
// - Show warning if already locked
//
// NAVIGATION PATTERNS:
// - Items List → Item Detail → Edit/Approve/Feature
// - Moderation Queue → Item Detail → Approve/Reject
// - Reported Items → Item Detail → Investigate → Remove/Dismiss
// - Featured Items → Select Item → Set Duration → Publish
// - Categories → Edit Category → Update Attributes → Save
//
// AUDIT LOGGING:
// - Log all item modifications
// - Track approval/rejection decisions
// - Record feature campaign changes
// - Monitor report resolutions
// - Audit category changes
//
// PERFORMANCE CONSIDERATIONS:
// - Lazy load item images in list view
// - Paginate large item lists
// - Cache category tree structure
// - Optimize search queries with filters

export default itemRoutes
