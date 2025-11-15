// ROUTE FILE PURPOSE: Verification management routes (requires Operations Manager+ role)
//
// ROUTE DEFINITIONS:
// All ID verification-related routes for admin review and management
//
// ROUTES INCLUDED:
// - /verification/queue - Pending verification submissions
// - /verification/:id - Individual verification review detail
// - /verification/history - Complete verification history
// - /verification/bulk - Batch verification processing
// - /verification/fraud - Fraud detection dashboard
//
// META PROPERTIES:
// - requiresAuth: true (must be logged in)
// - roles: ['super_admin', 'operations_manager'] (minimum role required)
// - permissions: ['verification.*'] (verification management permissions)
// - layout: 'default' (use main layout)

import type { RouteRecordRaw } from 'vue-router'

const verificationRoutes: RouteRecordRaw[] = [
  {
    path: '/verification',
    redirect: '/verification/queue', // Default to queue view
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'],
      showInMenu: false
    }
  },
  {
    path: '/verification/queue',
    name: 'verification-queue',
    component: () => import('@/pages/verification/VerificationQueue.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'],
      permissions: ['verification.view', 'verification.review'],
      layout: 'default',
      title: 'Verification Queue',
      breadcrumb: 'Verification > Queue',
      icon: 'verified-user',
      showInMenu: true,
      menuGroup: 'verification',
      order: 20
    }
    // IMPLEMENTATION NOTES:
    // - Load pending verification queue
    // - Support filtering by date, document type, risk score
    // - Real-time updates for new submissions
    // - Lock verification when admin opens detail view
  },
  {
    path: '/verification/:id',
    name: 'verification-detail',
    component: () => import('@/pages/verification/VerificationDetail.vue'),
    props: true, // Pass :id as prop
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'],
      permissions: ['verification.view', 'verification.review'],
      layout: 'default',
      title: 'Verification Details',
      breadcrumb: 'Verification > Details',
      showInMenu: false // Don't show in menu (accessed from queue)
    },
    beforeEnter: (to, from, next) => {
      // VERIFICATION LOCKING:
      // 1. Check if verification is already locked by another admin
      // 2. If locked, show warning and ask to override or go back
      // 3. If unlocked, lock verification to current admin
      // 4. Store lock in backend with timeout (auto-release after 15 minutes)

      // VALIDATION:
      // 1. Verify :id parameter is valid UUID/number
      // 2. Check if verification exists
      // 3. Check if verification is still pending (not already processed)
      // 4. If any validation fails, redirect to queue with error message

      next()
    }
    // IMPLEMENTATION NOTES:
    // - Display full verification details with document viewer
    // - Support zoom, rotate, full-screen for document images
    // - Show AI fraud detection indicators
    // - Provide approve/reject actions
    // - Release lock when leaving page or on timeout
  },
  {
    path: '/verification/history',
    name: 'verification-history',
    component: () => import('@/pages/verification/VerificationHistory.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'],
      permissions: ['verification.view', 'verification.history'],
      layout: 'default',
      title: 'Verification History',
      breadcrumb: 'Verification > History',
      icon: 'history',
      showInMenu: true,
      menuGroup: 'verification',
      order: 21
    }
    // IMPLEMENTATION NOTES:
    // - Display all verification attempts (approved, rejected, pending)
    // - Advanced filtering by status, admin, date range
    // - Export history for compliance reporting
    // - Track admin performance metrics
  },
  {
    path: '/verification/bulk',
    name: 'verification-bulk',
    component: () => import('@/pages/verification/BulkVerification.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'],
      permissions: ['verification.bulk', 'verification.approve', 'verification.reject'],
      layout: 'default',
      title: 'Bulk Verification',
      breadcrumb: 'Verification > Bulk Processing',
      icon: 'batch',
      showInMenu: true,
      menuGroup: 'verification',
      order: 22
    }
    // IMPLEMENTATION NOTES:
    // - Display low-risk verifications eligible for bulk approval
    // - Support batch selection and approval
    // - Prevent bulk approval of high-risk submissions
    // - Track bulk operation progress
    // - Require confirmation before processing
  },
  {
    path: '/verification/fraud',
    name: 'verification-fraud',
    component: () => import('@/pages/verification/FraudAlerts.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'],
      permissions: ['verification.fraud', 'fraud.investigate'],
      layout: 'default',
      title: 'Fraud Detection',
      breadcrumb: 'Verification > Fraud Alerts',
      icon: 'shield-alert',
      showInMenu: true,
      menuGroup: 'verification',
      order: 23,
      badge: 'fraud-count' // Show count of active fraud alerts
    }
    // IMPLEMENTATION NOTES:
    // - Display AI-flagged fraud alerts
    // - Show duplicate documents, manipulation detection
    // - Provide investigation tools (reverse image search, etc.)
    // - Support blacklist management
    // - Track fraud resolution outcomes
  }
]

// VERIFICATION ROUTE GUARDS:
//
// ROLE VERIFICATION:
// - Only Super Admin and Operations Manager can access
// - Redirect other roles to /unauthorized
//
// PERMISSION CHECKS:
// - verification.view: View verification queue and details
// - verification.review: Approve/reject verifications
// - verification.bulk: Access bulk processing
// - verification.fraud: Access fraud detection tools
// - verification.history: View historical data
//
// VERIFICATION LOCKING:
// - When admin opens verification detail, lock it
// - Prevent other admins from processing same verification
// - Show warning if already locked
// - Auto-release lock after timeout or when admin leaves page
//
// DATA ACCESS CONTROL:
// - Admins can only see verifications assigned to them or unassigned
// - Super Admin can see all verifications
// - Track which admin processed each verification
//
// NAVIGATION FLOW:
// - Queue → Detail → Approve/Reject → Next in Queue
// - Queue → Detail → Flag for Review → Fraud Dashboard
// - Bulk → Select Multiple → Approve Batch → Results Summary
//
// REAL-TIME UPDATES:
// - WebSocket connection for new verification submissions
// - Update queue in real-time when new submissions arrive
// - Show notification badge on menu icon
// - Audio/visual alert for high-priority submissions

export default verificationRoutes
