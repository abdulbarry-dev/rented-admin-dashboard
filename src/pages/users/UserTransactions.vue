// PAGE PURPOSE: User's complete transaction timeline showing purchases, sales, rentals, returns
//
// MAIN FUNCTIONALITY:
// - Display all transactions for a specific user (purchases and sales)
// - Show transaction details, statuses, and financial summaries
// - Filter transactions by type (purchase, sale, rental, return)
// - Calculate user's financial metrics (total spent, total earned, net value)
// - Provide transaction management actions (refunds, disputes, cancellations)
// - Export user transaction history
//
// UI COMPONENTS:
// - User summary header:
//   * User name and photo
//   * Total transactions count
//   * Total amount spent
//   * Total amount earned
//   * Net transaction value
//   * Average order value
// - Filter tabs:
//   * All Transactions
//   * Purchases (user as buyer)
//   * Sales (user as seller)
//   * Rentals (as renter or rentee)
//   * Returns
//   * Disputes
// - Status filter dropdown (completed, pending, cancelled, refunded, disputed)
// - Date range filter
// - Transactions timeline/table:
//   * Transaction ID and date
//   * Item name and photo
//   * Transaction type (purchase/sale/rental)
//   * Role (buyer/seller/renter)
//   * Amount
//   * Status badge
//   * Other party (buyer or seller name)
//   * Actions (view details, refund, cancel)
// - Financial summary panel:
//   * Total revenue from sales
//   * Total spending on purchases
//   * Platform fees collected
//   * Pending payments
//   * Refunded amount
// - Transaction detail modal
// - Export button (CSV, PDF)
//
// DATA REQUIREMENTS:
// - State: userId, transactions, filters, dateRange, isLoading, financialSummary
// - URL params: userId (from UserDetail.vue or direct link)
// - API: GET /api/admin/users/:userId/transactions
// - Query params: type, status, dateFrom, dateTo, page, limit
// - Response: {
//     transactions: [{
//       id, date, itemId, itemName, itemPhoto,
//       type: 'purchase' | 'sale' | 'rental' | 'return',
//       userRole: 'buyer' | 'seller' | 'renter' | 'rentee',
//       amount, currency,
//       status: 'completed' | 'pending' | 'cancelled' | 'refunded' | 'disputed',
//       otherParty: { userId, name, photo },
//       paymentMethod, paymentStatus,
//       deliveryStatus, trackingNumber,
//       createdAt, completedAt
//     }],
//     total, page, totalPages,
//     summary: {
//       totalTransactions, totalSpent, totalEarned, netValue,
//       avgOrderValue, completedCount, cancelledCount,
//       totalRevenue, totalSpending, platformFees, pendingPayments, refundedAmount
//     }
//   }
//
// WORKFLOW:
// 1. Load user transaction history on component mount
// 2. Display user summary with financial metrics
// 3. Show all transactions in timeline format
// 4. Admin filters by transaction type or status
// 5. Admin selects date range to narrow results
// 6. Click on transaction to view full details
// 7. Perform actions (refund, cancel, resolve dispute)
// 8. Export transaction history for user records
//
// TRANSACTION TYPES:
// - PURCHASE: User bought an item
//   * Show item, price, seller, delivery status
//   * Actions: Refund, Cancel Order, Contact Seller
//
// - SALE: User sold an item
//   * Show item, price, buyer, payout status
//   * Actions: Cancel Sale, Issue Refund, Contact Buyer
//
// - RENTAL: User rented or rented out an item
//   * Show rental period, daily rate, total cost
//   * Show return status and security deposit
//   * Actions: Extend Rental, Process Return, Refund Deposit
//
// - RETURN: Product return transactions
//   * Show return reason, refund status
//   * Actions: Approve Return, Reject Return, Issue Refund
//
// TRANSACTION STATUS BADGES:
// - Completed: Green badge (transaction successful)
// - Pending: Yellow badge (payment or delivery in progress)
// - Cancelled: Gray badge (order cancelled)
// - Refunded: Blue badge (money returned to buyer)
// - Disputed: Red badge (dispute filed)
//
// FINANCIAL SUMMARY CALCULATIONS:
// - Total Spent: Sum of all purchase amounts where user is buyer
// - Total Earned: Sum of all sale amounts where user is seller
// - Net Value: Total Earned - Total Spent
// - Avg Order Value: Total transaction value / transaction count
// - Total Revenue: User's sales revenue (gross)
// - Total Spending: User's purchase spending (gross)
// - Platform Fees: Fees collected from user's transactions
// - Pending Payments: Transactions not yet settled
// - Refunded Amount: Total refunds issued to/by user
//
// TRANSACTION DETAILS (Modal/Panel):
// - Full transaction information:
//   * Transaction ID and date
//   * Item details (name, description, photos, price)
//   * Buyer and seller information
//   * Payment details (method, status, amount breakdown)
//   * Delivery information (address, tracking, status)
//   * Timeline of transaction events
//   * Messages between parties
//   * Admin notes
// - Available actions based on status
//
// ADMIN ACTIONS:
// - REFUND TRANSACTION:
//   * Full or partial refund
//   * Select refund reason
//   * Process refund immediately
//   * Notify user via email
//
// - CANCEL TRANSACTION:
//   * Cancel pending transaction
//   * Select cancellation reason
//   * Refund payment if already processed
//   * Update inventory
//
// - RESOLVE DISPUTE:
//   * Review dispute details
//   * Decide in favor of buyer or seller
//   * Issue refund or release payment
//   * Close dispute
//
// - VIEW COMMUNICATIONS:
//   * See all messages between buyer and seller
//   * Admin can send message to either party
//
// FILTERING & SORTING:
// - Filter by transaction type (purchase, sale, rental)
// - Filter by status (completed, pending, etc.)
// - Filter by date range (last 7/30/90 days, custom)
// - Filter by amount range (min/max)
// - Sort by date (newest first, oldest first)
// - Sort by amount (highest first, lowest first)
//
// EXPORT FUNCTIONALITY:
// - Export user's complete transaction history
// - CSV format: Date, ID, Type, Item, Amount, Status, Other Party
// - PDF format: Formatted transaction report
// - Include financial summary in export
// - Filter export to specific date range or transaction type
//
// REVENUE METRICS:
// - Monthly revenue trend chart (if user is seller)
// - Best-selling items for user
// - Average transaction value over time
// - Repeat buyer rate (for sellers)
//
// SECURITY CONSIDERATIONS:
// - Only authorized admins can view user transactions
// - Audit log all transaction history accesses
// - Sensitive financial data requires additional permissions
// - Refund/cancel actions logged and require confirmation
//
// PERFORMANCE OPTIMIZATION:
// - Paginate transactions (50 per page)
// - Lazy load item photos
// - Cache financial summary calculations
// - Virtual scrolling for long transaction lists
//
// ERROR HANDLING:
// - Handle case where user has no transactions
// - Show error if transaction data fails to load
// - Retry mechanism for failed API calls
// - Validate action inputs before submitting
//
// RESPONSIVE DESIGN:
// - Timeline view on desktop
// - Card view on mobile
// - Collapsible filters on small screens
// - Touch-friendly action buttons
//
// INTEGRATION POINTS:
// - Router: Navigate to TransactionDetail.vue, ItemDetail.vue, UserDetail.vue
// - Store: Cache transaction data during session
// - Export Service: Generate CSV/PDF reports
// - Notification Service: Send transaction-related notifications
// - Payment Service: Process refunds and cancellations
