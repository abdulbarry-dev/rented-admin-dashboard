// ROUTE FILE PURPOSE: Analytics and reporting routes (requires authenticated admin)
//
// ROUTE DEFINITIONS:
// All analytics dashboards and reports
//
// ROUTES INCLUDED:
// - /analytics - Main analytics dashboard
// - /analytics/sales - Sales trends and analysis
// - /analytics/users - User growth and metrics
// - /analytics/revenue - Revenue reports and forecasting
// - /analytics/categories - Category performance analysis
// - /analytics/performance - Platform performance metrics
//
// META PROPERTIES:
// - requiresAuth: true (must be logged in)
// - roles: ['super_admin', 'operations_manager', 'financial_admin'] (minimum role required)
// - permissions: ['analytics.*'] (analytics access permissions)
// - layout: 'default' (use main layout)

import type { RouteRecordRaw } from 'vue-router'

const analyticsRoutes: RouteRecordRaw[] = [
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('@/pages/analytics/AnalyticsDashboard.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'financial_admin'],
      permissions: ['analytics.view'],
      layout: 'default',
      title: 'Analytics',
      breadcrumb: 'Analytics',
      icon: 'chart-line',
      showInMenu: true,
      order: 60
    }
    // IMPLEMENTATION NOTES:
    // - Display overview of all key metrics
    // - Show charts: revenue trends, user growth, transaction volume
    // - Provide date range selector
    // - Compare period-over-period performance
    // - Export analytics data to PDF/Excel
  },
  {
    path: '/analytics/sales-trends',
    name: 'analytics-sales',
    component: () => import('@/pages/analytics/SalesTrends.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager', 'financial_admin'],
      permissions: ['analytics.view'],
      layout: 'default',
      title: 'Sales Trends',
      breadcrumb: 'Analytics > Sales',
      icon: 'trending-up',
      showInMenu: true,
      menuGroup: 'analytics',
      order: 61
    }
    // IMPLEMENTATION NOTES:
    // - Display sales volume over time
    // - Show best-selling items and categories
    // - Track average order value
    // - Analyze sales by day/week/month
    // - Identify sales patterns and seasonality
  },
  {
    path: '/analytics/user-growth',
    name: 'analytics-users',
    component: () => import('@/pages/analytics/UserGrowth.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'],
      permissions: ['analytics.view'],
      layout: 'default',
      title: 'User Growth',
      breadcrumb: 'Analytics > Users',
      icon: 'users-chart',
      showInMenu: true,
      menuGroup: 'analytics',
      order: 62
    }
    // IMPLEMENTATION NOTES:
    // - Display user registration trends
    // - Show active users vs total users
    // - Track user retention rates
    // - Analyze user demographics
    // - Monitor user acquisition channels
  },
  {
    path: '/analytics/revenue-reports',
    name: 'analytics-revenue',
    component: () => import('@/pages/analytics/RevenueReports.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'financial_admin'],
      permissions: ['analytics.financial'],
      layout: 'default',
      title: 'Revenue Reports',
      breadcrumb: 'Analytics > Revenue',
      icon: 'dollar-chart',
      showInMenu: true,
      menuGroup: 'analytics',
      order: 63
    }
    // IMPLEMENTATION NOTES:
    // - Display total revenue and breakdown
    // - Show commission earnings
    // - Track payment gateway fees
    // - Calculate net revenue
    // - Generate financial forecasts
  },
  {
    path: '/analytics/popular-categories',
    name: 'analytics-categories',
    component: () => import('@/pages/analytics/PopularCategories.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin', 'operations_manager'],
      permissions: ['analytics.view'],
      layout: 'default',
      title: 'Category Performance',
      breadcrumb: 'Analytics > Categories',
      icon: 'category-chart',
      showInMenu: true,
      menuGroup: 'analytics',
      order: 64
    }
    // IMPLEMENTATION NOTES:
    // - Show performance by category
    // - Track category growth trends
    // - Identify popular and underperforming categories
    // - Analyze category-specific metrics
    // - Compare categories side-by-side
  },
  {
    path: '/analytics/performance-metrics',
    name: 'analytics-performance',
    component: () => import('@/pages/analytics/PerformanceMetrics.vue'),
    meta: {
      requiresAuth: true,
      roles: ['super_admin'],
      permissions: ['analytics.system'],
      layout: 'default',
      title: 'Performance Metrics',
      breadcrumb: 'Analytics > Performance',
      icon: 'speedometer',
      showInMenu: true,
      menuGroup: 'analytics',
      order: 65
    }
    // IMPLEMENTATION NOTES:
    // - Display platform performance metrics
    // - Track API response times
    // - Monitor database performance
    // - Show server resource usage
    // - Alert on performance degradation
  }
]

// ANALYTICS ROUTE GUARDS:
//
// ROLE-BASED ACCESS:
// - Super Admin: Full access to all analytics including system performance
// - Operations Manager: Business analytics (sales, users, categories)
// - Financial Admin: Revenue and financial analytics
// - Other roles: Limited or no analytics access
//
// PERMISSION CHECKS:
// - analytics.view: View general analytics dashboards
// - analytics.financial: View financial and revenue data
// - analytics.system: View system performance metrics
// - analytics.export: Export analytics data
//
// DATA ACCESS CONTROL:
// - Financial data: Only Financial Admin and Super Admin
// - System metrics: Only Super Admin
// - User analytics: Operations Manager and above
// - Sales data: Operations Manager, Financial Admin, Super Admin
//
// DATE RANGE RESTRICTIONS:
// - Default to last 30 days
// - Allow custom date ranges
// - Limit historical data access based on role
// - Super Admin: unlimited history
// - Other roles: last 12 months
//
// PERFORMANCE OPTIMIZATION:
// - Cache analytics data (refresh every 15-30 minutes)
// - Use aggregated data for large date ranges
// - Lazy load charts on scroll
// - Implement chart data pagination
// - Pre-calculate common metrics
//
// EXPORT FUNCTIONALITY:
// - Export to CSV, Excel, PDF formats
// - Include filters and date ranges in export
// - Track who exported data (audit log)
// - Limit export frequency (prevent abuse)
//
// REAL-TIME VS CACHED:
// - Dashboard overview: Real-time updates
// - Detailed reports: Cached data (5-30 min)
// - Historical analysis: Pre-aggregated data
// - System performance: Real-time monitoring
//
// NAVIGATION PATTERNS:
// - Analytics Dashboard → Drill down to specific metric
// - Sales Trends → Click data point → Detailed breakdown
// - Revenue Reports → Export → Download report
// - Category Performance → Select category → Item-level analytics

export default analyticsRoutes
