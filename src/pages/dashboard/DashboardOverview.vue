// PAGE PURPOSE: Main dashboard with real-time metrics and system overview for admin users
//
// MAIN FUNCTIONALITY:
// - Display key performance indicators (KPIs) at a glance
// - Show real-time statistics for users, verifications, listings, and transactions
// - Present financial metrics including daily revenue and growth trends
// - Monitor system health and platform status
// - Provide quick access links to common admin actions
// - Display recent activity feed and alerts
//
// UI COMPONENTS:
// - KPI cards grid (6-8 primary metrics):
//   * Total users (with growth percentage)
//   * Pending verifications (with priority count)
//   * Active listings (online/approved items)
//   * Ongoing transactions (active purchases/rentals)
//   * Daily revenue (with comparison to previous day)
//   * System health status (API uptime, response time)
// - Revenue trend chart (line chart showing last 30 days)
// - Recent activity timeline (last 10 admin actions)
// - Quick action buttons (New Verification, View Reports, User Search)
// - Alerts/notifications panel (urgent items requiring attention)
// - Category performance mini-chart (top 5 categories)
// - User growth sparkline chart
//
// DATA REQUIREMENTS:
// - State: dashboardMetrics, isLoading, lastUpdated, refreshInterval
// - API endpoints:
//   * GET /api/admin/dashboard/metrics - Overall KPIs
//   * GET /api/admin/dashboard/revenue-trend - Revenue time series
//   * GET /api/admin/dashboard/recent-activity - Activity log
//   * GET /api/admin/dashboard/alerts - Urgent notifications
// - Response structure:
//   {
//     metrics: {
//       totalUsers: number,
//       userGrowth: number (percentage),
//       pendingVerifications: number,
//       priorityVerifications: number,
//       activeListings: number,
//       ongoingTransactions: number,
//       dailyRevenue: number,
//       revenueGrowth: number (percentage),
//       systemHealth: { status: string, uptime: number, responseTime: number }
//     },
//     revenueTrend: [ { date: string, revenue: number } ],
//     recentActivity: [ { id, action, admin, timestamp } ],
//     alerts: [ { id, type, message, severity, timestamp } ]
//   }
//
// WORKFLOW:
// 1. Load dashboard metrics on component mount
// 2. Display loading skeleton while fetching data
// 3. Render KPI cards with metrics
// 4. Initialize real-time updates via WebSocket or polling (every 30 seconds)
// 5. Update metrics automatically without full page refresh
// 6. Show visual indicators for changes (up/down arrows, color changes)
// 7. Handle metric card clicks to navigate to detailed views
// 8. Display alerts prominently if any critical issues exist
//
// REAL-TIME UPDATES:
// - Auto-refresh metrics every 30 seconds
// - WebSocket connection for instant updates on critical metrics
// - Visual notification when data is refreshed (subtle animation)
// - Manual refresh button for immediate update
// - Last updated timestamp display
//
// METRIC CALCULATIONS:
// - Growth percentages: Compare current period vs previous period
// - Daily revenue: Sum of all completed transactions today
// - System health: Aggregate of API health checks
// - Pending verifications: Count of unprocessed ID submissions
// - Priority verifications: Submissions flagged for urgent review
//
// INTERACTIVE ELEMENTS:
// - Click KPI cards to navigate to relevant detail pages:
//   * Users card → UserList.vue
//   * Verifications card → VerificationQueue.vue
//   * Listings card → ItemList.vue
//   * Transactions card → TransactionList.vue
//   * Revenue card → RevenueReports.vue
// - Click chart data points to filter by specific date
// - Click activity items to view full details
// - Hover tooltips on metrics for additional context
//
// PERFORMANCE OPTIMIZATION:
// - Lazy load charts (render after initial KPIs load)
// - Cache metrics data for 30 seconds to reduce API calls
// - Use virtual scrolling for activity feed if >100 items
// - Debounce auto-refresh during active user interaction
//
// SECURITY CONSIDERATIONS:
// - Role-based metric visibility (some metrics only for Super Admin)
// - Audit log all dashboard accesses
// - Secure WebSocket connections with authentication
//
// ERROR HANDLING:
// - Show error message if metrics fail to load
// - Fallback to cached data if real-time update fails
// - Retry logic for failed API calls (max 3 attempts)
// - Display "Data unavailable" in metric cards on error
//
// RESPONSIVE DESIGN:
// - KPI cards in grid layout (4 columns desktop, 2 tablet, 1 mobile)
// - Charts stack vertically on mobile
// - Collapsible activity feed on small screens
//
// INTEGRATION POINTS:
// - Router: Navigate to detail pages from KPI cards
// - Store: Cache dashboard data for quick re-access
// - WebSocket: Real-time metric updates
// - Chart library: Display revenue trends and category performance
// - Notification system: Show alerts and urgent items
