// ROUTE FILE PURPOSE: Settings and configuration routes (requires Super Admin role)
//
// ROUTE DEFINITIONS:
// All system settings and configuration management routes
//
// ROUTES INCLUDED:
// - /settings - Settings overview/hub
// - /settings/system - System-wide settings
// - /settings/admins - Admin account management
// - /settings/roles - Role and permission configuration
// - /settings/notifications - Notification settings
// - /settings/payment - Payment gateway configuration
// - /settings/backup - Backup and recovery
//
// META PROPERTIES:
// - requiresAuth: true (must be logged in)
// - roles: ['super_admin'] (Super Admin only for most settings)
// - permissions: ['settings.*'] (settings management permissions)
// - layout: 'default' (use main layout)

import type { RouteRecordRaw } from 'vue-router'

const settingsRoutes: RouteRecordRaw[] = [
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/settings/SettingsPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'], // Operations Manager can view some settings
      permissions: ['settings.view'],
      layout: 'default',
      title: 'Settings',
      breadcrumb: 'Settings',
      icon: 'settings',
      showInMenu: true,
      order: 70
    }
    // IMPLEMENTATION NOTES:
    // - Display settings navigation hub
    // - Show quick access to common settings
    // - Display system health indicators
    // - Show recent configuration changes
  },
  {
    path: '/settings/system',
    name: 'settings-system',
    component: () => import('@/pages/settings/SystemSettings.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin'],
      permissions: ['settings.system'],
      layout: 'default',
      title: 'System Settings',
      breadcrumb: 'Settings > System',
      icon: 'server',
      showInMenu: true,
      menuGroup: 'settings',
      order: 71
    }
    // IMPLEMENTATION NOTES:
    // - Configure platform-wide settings
    // - Set marketplace rules and policies
    // - Configure email/SMS providers
    // - Manage API integrations
    // - Set timezone and localization
  },
  {
    path: '/settings/admins',
    name: 'settings-admins',
    component: () => import('@/pages/settings/AdminManagement.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin'],
      permissions: ['admins.manage'],
      layout: 'default',
      title: 'Admin Management',
      breadcrumb: 'Settings > Admins',
      icon: 'admin-users',
      showInMenu: true,
      menuGroup: 'settings',
      order: 72
    }
    // IMPLEMENTATION NOTES:
    // - List all admin accounts
    // - Create new admin accounts
    // - Edit admin roles and permissions
    // - Suspend/delete admin accounts
    // - View admin activity logs
  },
  {
    path: '/settings/roles',
    name: 'settings-roles',
    component: () => import('@/pages/settings/RolesPermissions.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin'],
      permissions: ['roles.manage'],
      layout: 'default',
      title: 'Roles & Permissions',
      breadcrumb: 'Settings > Roles',
      icon: 'shield-key',
      showInMenu: true,
      menuGroup: 'settings',
      order: 73
    }
    // IMPLEMENTATION NOTES:
    // - Define custom admin roles
    // - Configure permissions per role
    // - Set role hierarchy
    // - Assign roles to admins
    // - Preview role capabilities
  },
  {
    path: '/settings/notifications',
    name: 'settings-notifications',
    component: () => import('@/pages/settings/NotificationSettings.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'],
      permissions: ['settings.notifications'],
      layout: 'default',
      title: 'Notification Settings',
      breadcrumb: 'Settings > Notifications',
      icon: 'bell-settings',
      showInMenu: true,
      menuGroup: 'settings',
      order: 74
    }
    // IMPLEMENTATION NOTES:
    // - Configure admin notification preferences
    // - Set up notification templates
    // - Configure alert thresholds
    // - Manage notification channels (email, SMS, push)
    // - Test notification delivery
  },
  {
    path: '/settings/payment',
    name: 'settings-payment',
    component: () => import('@/pages/settings/PaymentGatewaySettings.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin'],
      permissions: ['settings.payment'],
      layout: 'default',
      title: 'Payment Settings',
      breadcrumb: 'Settings > Payment',
      icon: 'payment-settings',
      showInMenu: true,
      menuGroup: 'settings',
      order: 75
    }
    // IMPLEMENTATION NOTES:
    // - Configure payment gateways (Stripe, PayPal, etc.)
    // - Set payment processing fees
    // - Configure refund policies
    // - Manage payout schedules
    // - Test payment integration
  },
  {
    path: '/settings/backup',
    name: 'settings-backup',
    component: () => import('@/pages/settings/BackupRecovery.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin'],
      permissions: ['settings.backup'],
      layout: 'default',
      title: 'Backup & Recovery',
      breadcrumb: 'Settings > Backup',
      icon: 'database-backup',
      showInMenu: true,
      menuGroup: 'settings',
      order: 76
    }
    // IMPLEMENTATION NOTES:
    // - Schedule automated backups
    // - Initiate manual backup
    // - Download backup files
    // - Restore from backup
    // - Monitor backup health
  },
  {
    path: '/settings/profile',
    name: 'settings-profile',
    component: () => import('@/pages/settings/ProfileSettings.vue'),
    meta: {
      requiresAuth: true,
      // All authenticated admins can access own profile
      permissions: ['profile.edit'],
      layout: 'default',
      title: 'Profile Settings',
      breadcrumb: 'Settings > Profile',
      icon: 'user-settings',
      showInMenu: true,
      menuGroup: 'settings',
      order: 77
    }
    // IMPLEMENTATION NOTES:
    // - Edit own admin profile
    // - Update password
    // - Configure 2FA settings
    // - Set notification preferences
    // - Manage session security
  }
]

// SETTINGS ROUTE GUARDS:
//
// SUPER ADMIN REQUIREMENT:
// - Most settings require Super Admin role
// - Redirect other roles to /unauthorized
// - Profile settings accessible to all admins
//
// PERMISSION CHECKS:
// - settings.view: View settings pages
// - settings.system: Modify system settings
// - settings.payment: Configure payment gateways
// - settings.backup: Access backup and recovery
// - admins.manage: Manage admin accounts
// - roles.manage: Configure roles and permissions
// - profile.edit: Edit own profile (all admins)
//
// CHANGE CONFIRMATION:
// - Require confirmation for critical settings changes
// - Show preview of changes before applying
// - Implement rollback for failed changes
// - Log all settings modifications
//
// SENSITIVE SETTINGS:
// - Payment gateway credentials: Encrypted storage
// - API keys: Masked display, reveal on demand
// - SMTP credentials: Secure storage
// - Backup encryption keys: Super Admin only
//
// AUDIT LOGGING:
// - Log all settings changes
// - Track who made each change
// - Record timestamp and IP address
// - Store before/after values
// - Alert on critical setting changes
//
// VALIDATION:
// - Validate settings before saving
// - Test integrations (payment, email) before enabling
// - Prevent invalid configurations
// - Show warning for risky changes
//
// NAVIGATION PATTERNS:
// - Settings Hub → Select Category → Edit Settings → Save
// - System Settings → Change Config → Confirm → Apply
// - Admin Management → Create Admin → Assign Role → Send Invite
// - Payment Settings → Configure Gateway → Test → Enable
// - Backup → Schedule → Configure → Activate
//
// BACKUP BEFORE CHANGES:
// - Auto-backup before critical settings changes
// - Allow restoration if changes cause issues
// - Store configuration version history

export default settingsRoutes
