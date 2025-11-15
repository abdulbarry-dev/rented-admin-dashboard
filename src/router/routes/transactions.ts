// ROUTE FILE PURPOSE: Transaction management routes (requires Operations Manager+ role)
//
// ROUTE DEFINITIONS:
// All payment and transaction management routes
//
// ROUTES INCLUDED:
// - /transactions - All transactions list
// - /transactions/:id - Individual transaction detail
// - /transactions/purchases - Purchase transactions only
// - /transactions/rentals - Rental transactions only
// - /transactions/disputes - Dispute resolution center
// - /transactions/refunds - Refund processing
// - /transactions/shipping - Shipping management
//
// META PROPERTIES:
// - requiresAuth: true (must be logged in)
// - roles: ['super_admin', 'operations_manager', 'financial_admin'] (minimum role required)
// - permissions: ['transactions.*'] (transaction management permissions)
// - layout: 'default' (use main layout)

import type { RouteRecordRaw } from 'vue-router'

const transactionRoutes: RouteRecordRaw[] = [
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('@/pages/transactions/TransactionList.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'financial_admin'],
      permissions: ['transactions.view'],
      layout: 'default',
      title: 'Transactions',
      breadcrumb: 'Transactions',
      icon: 'payment',
      showInMenu: true,
      order: 50
    }
    // IMPLEMENTATION NOTES:
    // - Display all transactions (purchases and rentals)
    // - Filter by status, type, date range, amount
    // - Search by transaction ID, user, item
    // - Export transaction data for accounting
    // - Quick filters: pending, completed, failed, disputed
  },
  {
    path: '/transactions/:id',
    name: 'transaction-detail',
    component: () => import('@/pages/transactions/TransactionDetail.vue'),
    props: true,
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'financial_admin'],
      permissions: ['transactions.view'],
      layout: 'default',
      title: 'Transaction Details',
      breadcrumb: 'Transactions > Details',
      showInMenu: false
    },
    beforeEnter: (to, from, next) => {
      // VALIDATION:
      // 1. Verify transaction ID is valid
      // 2. Check if transaction exists
      // 3. Verify admin has access to transaction data

      // SENSITIVE DATA:
      // 1. Payment details visible to Financial Admin and Super Admin only
      // 2. Full transaction history requires additional permission

      next()
    }
    // IMPLEMENTATION NOTES:
    // - Display complete transaction details
    // - Show payment information (masked for security)
    // - Display buyer and seller information
    // - Show transaction timeline and status updates
    // - Provide admin actions: refund, cancel, mark as completed
  },
  {
    path: '/transactions/purchases',
    name: 'transactions-purchases',
    component: () => import('@/pages/transactions/PurchaseTransactions.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'financial_admin'],
      permissions: ['transactions.view'],
      layout: 'default',
      title: 'Purchase Transactions',
      breadcrumb: 'Transactions > Purchases',
      icon: 'shopping-cart',
      showInMenu: true,
      menuGroup: 'transactions',
      order: 51
    }
    // IMPLEMENTATION NOTES:
    // - Display only purchase/sale transactions
    // - Show purchase-specific metrics
    // - Track fulfillment and delivery status
    // - Monitor purchase disputes
  },
  {
    path: '/transactions/rentals',
    name: 'transactions-rentals',
    component: () => import('@/pages/transactions/RentalTransactions.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'financial_admin'],
      permissions: ['transactions.view'],
      layout: 'default',
      title: 'Rental Transactions',
      breadcrumb: 'Transactions > Rentals',
      icon: 'calendar-clock',
      showInMenu: true,
      menuGroup: 'transactions',
      order: 52
    }
    // IMPLEMENTATION NOTES:
    // - Display rental-specific transactions
    // - Show rental periods and return dates
    // - Track late returns and extensions
    // - Calculate rental revenue
  },
  {
    path: '/transactions/disputes',
    name: 'transactions-disputes',
    component: () => import('@/pages/transactions/DisputeResolution.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'],
      permissions: ['disputes.manage'],
      layout: 'default',
      title: 'Dispute Resolution',
      breadcrumb: 'Transactions > Disputes',
      icon: 'gavel',
      showInMenu: true,
      menuGroup: 'transactions',
      order: 53,
      badge: 'active-disputes-count'
    }
    // IMPLEMENTATION NOTES:
    // - Display active transaction disputes
    // - Review evidence from both parties
    // - Mediate between buyer and seller
    // - Make resolution decisions
    // - Process dispute refunds
  },
  {
    path: '/transactions/refunds',
    name: 'transactions-refunds',
    component: () => import('@/pages/transactions/RefundProcessing.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'financial_admin'],
      permissions: ['refunds.process'],
      layout: 'default',
      title: 'Refund Processing',
      breadcrumb: 'Transactions > Refunds',
      icon: 'refund',
      showInMenu: true,
      menuGroup: 'transactions',
      order: 54
    }
    // IMPLEMENTATION NOTES:
    // - Display pending refund requests
    // - Review refund eligibility
    // - Process full or partial refunds
    // - Track refund status and completion
    // - Monitor refund analytics
  },
  {
    path: '/transactions/shipping',
    name: 'transactions-shipping',
    component: () => import('@/pages/transactions/ShippingManagement.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'],
      permissions: ['shipping.manage'],
      layout: 'default',
      title: 'Shipping Management',
      breadcrumb: 'Transactions > Shipping',
      icon: 'truck',
      showInMenu: true,
      menuGroup: 'transactions',
      order: 55
    }
    // IMPLEMENTATION NOTES:
    // - Track shipping status for all orders
    // - Monitor delivery times and issues
    // - Manage shipping disputes
    // - Generate shipping labels if applicable
    // - Track carrier performance
  }
]

// TRANSACTION ROUTE GUARDS:
//
// ROLE-BASED ACCESS:
// - Super Admin: Full access to all transactions and financial data
// - Operations Manager: View transactions, manage disputes, shipping
// - Financial Admin: View transactions, process refunds, financial reports
// - Other roles: No access to transaction management
//
// PERMISSION CHECKS:
// - transactions.view: View transaction list and details
// - transactions.manage: Edit transaction status
// - disputes.manage: Handle transaction disputes
// - refunds.process: Process refund requests
// - shipping.manage: Manage shipping and tracking
// - financial.view: Access sensitive payment data
//
// SENSITIVE DATA ACCESS:
// - Payment card details: Masked by default, visible to Financial Admin only
// - Bank account info: Super Admin and Financial Admin only
// - Full transaction amounts: All authorized roles
// - User personal data: Comply with privacy regulations
//
// TRANSACTION LOCKING:
// - Lock transaction when admin opens for processing
// - Prevent concurrent modifications
// - Auto-release lock after timeout
//
// AUDIT LOGGING:
// - Log all transaction data access
// - Track refund processing
// - Record dispute resolution decisions
// - Monitor shipping status updates
// - Audit payment information views
//
// NAVIGATION PATTERNS:
// - Transactions List → Transaction Detail → Refund/Dispute/Ship
// - Disputes → Dispute Detail → Review Evidence → Resolve
// - Refunds → Refund Request → Review → Approve/Deny
// - Shipping → Order Detail → Update Tracking → Mark Delivered
//
// REAL-TIME UPDATES:
// - WebSocket for new transactions
// - Real-time dispute notifications
// - Payment status updates
// - Shipping tracking updates

export default transactionRoutes
