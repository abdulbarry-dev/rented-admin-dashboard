// PAGE PURPOSE: Comprehensive transaction log displaying purchases and rentals with filtering and sorting
//
// MAIN FUNCTIONALITY:
// - Display all platform transactions (purchases and rentals)
// - Filter by transaction type, status, date range, amount, users
// - Sort by date, amount, status
// - Search by transaction ID, user names, item name
// - Quick actions (view details, refund, cancel, resolve dispute)
// - Export transaction data for accounting and analysis
// - Track transaction metrics and revenue
//
// UI COMPONENTS:
// - Transaction statistics summary (total transactions, completed, pending, revenue)
// - Filter panel (type, status, date range, amount range, buyer/seller filter)
// - Search bar (transaction ID, user names, item name)
// - Sort dropdown (newest first, oldest first, amount high-low, amount low-high)
// - Transactions table with columns: ID, date, type, item, buyer, seller, amount, status, actions
// - Pagination controls
// - Export button (CSV, Excel)
// - Quick action menu per transaction
//
// DATA REQUIREMENTS:
// - API: GET /api/admin/transactions
// - Query params: page, limit, type, status, dateFrom, dateTo, minAmount, maxAmount, buyerId, sellerId, itemId
// - Response: { transactions, total, stats: { totalRevenue, completedCount, pendingCount, cancelledCount } }
//
// WORKFLOW:
// 1. Load transactions with filters
// 2. Display in table/list format
// 3. Apply search and filters
// 4. Click transaction to view details
// 5. Perform quick actions (refund, cancel, etc.)
// 6. Export data for reports
//
// TRANSACTION TYPES:
// - Purchase: One-time sale transaction
// - Rental: Rental transaction with start/end dates
//
// TRANSACTION STATUSES:
// - Completed: Transaction successfully finished
// - Pending: Payment or delivery in progress
// - Cancelled: Transaction cancelled
// - Refunded: Money returned to buyer
// - Disputed: Dispute filed by buyer/seller
//
// INTEGRATION POINTS:
// - Navigate to TransactionDetail.vue, ItemDetail.vue, UserDetail.vue
// - Export service, refund processing
// - Dispute resolution workflow
