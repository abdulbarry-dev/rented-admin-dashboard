// PAGE PURPOSE: Detailed item view displaying full information, photo gallery, pricing, and seller details
//
// MAIN FUNCTIONALITY:
// - Display complete item information and specifications
// - Show all item photos in gallery view
// - Display seller information and ratings
// - Show item performance metrics (views, saves, inquiries)
// - View transaction history for this item
// - Provide admin actions (edit, approve, reject, feature, delist, delete)
// - Display item status and listing history
//
// UI COMPONENTS:
// - Item photo gallery (main image with thumbnails, zoom, full-screen view)
// - Item information panel (title, description, condition, specifications)
// - Pricing details (sale price, rental rates, security deposit, original price)
// - Seller information card (name, photo, rating, verification status, contact)
// - Category and tags
// - Item status badge (active, pending, sold, rented, delisted)
// - Performance metrics (total views, unique viewers, saves, shares, inquiries)
// - Transaction history for this item (if any sales/rentals)
// - Item timeline (listed date, approved date, featured periods, status changes)
// - Admin action buttons (Edit, Approve, Reject, Feature, Delist, Delete)
// - Admin notes section (private notes about this item)
// - Related items carousel (similar listings)
//
// DATA REQUIREMENTS:
// - State: itemId, itemData, isLoading, adminNotes
// - URL params: itemId (from ItemList.vue or direct link)
// - API: GET /api/admin/items/:id
// - Response: {
//     id, title, description, condition,
//     category: { id, name, path },
//     photos: [{ url, order, caption }],
//     pricing: { salePrice, rentalDaily, rentalWeekly, rentalMonthly, securityDeposit, currency, originalPrice },
//     listingType: 'sale' | 'rent' | 'both',
//     status: 'active' | 'pending' | 'sold' | 'rented' | 'delisted' | 'rejected',
//     seller: { id, name, photo, rating, verificationStatus, memberSince },
//     specifications: { brand, model, size, color, etc. },
//     location: { city, country, latitude, longitude },
//     availability: { available, quantity, rentalCalendar },
//     performance: { views, uniqueViewers, saves, shares, inquiries },
//     transactions: [{ id, type, date, buyer, amount, status }],
//     timeline: [{ event, date, admin, details }],
//     createdAt, approvedAt, featuredUntil,
//     tags: [],
//     adminNotes: [{ adminId, adminName, note, timestamp }]
//   }
//
// WORKFLOW:
// 1. Load item details on component mount
// 2. Display all item information in organized sections
// 3. Admin reviews item photos and description
// 4. Admin checks seller credibility
// 5. Admin reviews performance metrics
// 6. Admin decides action (approve, reject, edit, feature, delist)
// 7. Action executed and item status updated
// 8. User/seller notified of status change
//
// PHOTO GALLERY FEATURES:
// - Main image display with large preview
// - Thumbnail strip for all photos
// - Click thumbnail to change main image
// - Zoom in/out controls
// - Full-screen lightbox view
// - Photo carousel navigation (prev/next arrows)
// - Photo count indicator (showing X of Y)
// - Report inappropriate image button
//
// ITEM INFORMATION DISPLAY:
// - Title (with edit icon for admin)
// - Full description with formatting
// - Item condition (new, like new, used, fair, poor)
// - Category breadcrumb (Electronics > Phones > iPhones)
// - Brand, model, and specifications
// - Size, color, dimensions, weight
// - Custom attributes based on category
// - Tags (searchable keywords)
//
// PRICING DETAILS:
// - Sale Price (if for sale)
// - Rental Rates:
//   * Daily rate
//   * Weekly rate (discounted)
//   * Monthly rate (discounted)
// - Security deposit amount
// - Currency
// - Original price (if discounted)
// - Price history chart (if price changed)
//
// SELLER INFORMATION:
// - Seller profile photo
// - Seller name (clickable to UserDetail.vue)
// - Seller rating (stars and review count)
// - Verification status badge
// - Member since date
// - Response rate and time
// - Total listings count
// - Completed transactions count
// - Contact seller button (opens UserCommunication.vue)
//
// PERFORMANCE METRICS:
// - Total Views: All-time view count
// - Unique Viewers: Individual user views
// - Saves/Favorites: Users who saved this item
// - Shares: Social/link shares
// - Inquiries: Messages sent about item
// - Conversion Rate: Views → Transactions
// - View trend chart (views over time)
//
// TRANSACTION HISTORY:
// - List of all transactions for this specific item
// - For each transaction:
//   * Transaction ID and date
//   * Type (sale or rental)
//   * Buyer name (clickable to UserDetail.vue)
//   * Amount paid
//   * Status (completed, cancelled, disputed)
//   * Link to TransactionDetail.vue
// - Useful for items with rental history
//
// ITEM TIMELINE:
// - Chronological history of item events:
//   * Listed by seller (date and time)
//   * Submitted for approval (if moderation enabled)
//   * Approved by admin (admin name, date)
//   * Featured periods (start and end dates)
//   * Price changes
//   * Status changes (active → sold → relisted)
//   * Admin edits
//   * Rejected/delisted events with reasons
//
// ADMIN ACTIONS:
//
// - EDIT ITEM:
//   * Navigate to ItemEditor.vue with item ID
//   * Admin can modify any item details
//
// - APPROVE ITEM:
//   * Approve pending item for public listing
//   * Item becomes visible to buyers/renters
//   * Seller notified of approval
//
// - REJECT ITEM:
//   * Reject item (doesn't meet guidelines)
//   * Select rejection reason
//   * Add details for seller
//   * Seller notified with feedback
//
// - FEATURE ITEM:
//   * Promote item to featured section
//   * Set featured duration (1 day, 1 week, 1 month, custom)
//   * Featured items shown prominently on homepage
//   * Track featured performance
//
// - DELIST ITEM:
//   * Remove item from marketplace
//   * Select delist reason (policy violation, seller request, sold elsewhere)
//   * Item no longer visible to users
//   * Seller notified
//
// - DELETE ITEM:
//   * Permanently delete item (requires confirmation)
//   * Only for policy violations or duplicate listings
//   * Cannot be undone
//   * Audit logged
//
// ADMIN NOTES:
// - Private notes visible only to admins
// - Document decisions, concerns, or context
// - Useful for compliance or policy enforcement
// - Searchable for future reference
// - Track which admin added each note
//
// RELATED ITEMS:
// - Show similar items from same seller
// - Show similar items in same category
// - Help identify duplicates or related listings
//
// AVAILABILITY DISPLAY:
// - For Sale: Available quantity
// - For Rent: Rental calendar showing booked dates
// - Out of stock/unavailable indicator
// - Restock notifications (if applicable)
//
// LOCATION INFORMATION:
// - City and country
// - Optional map view (if coordinates available)
// - Shipping availability
// - Local pickup option
//
// SECURITY CONSIDERATIONS:
// - Only admins with "item_management" permission
// - Audit log all admin actions on items
// - Seller contact info protected (no direct phone/email display)
// - Admin edits tracked and reversible
//
// PERFORMANCE OPTIMIZATION:
// - Lazy load item photos
// - Cache item data during session
// - Optimize large image loading
//
// ERROR HANDLING:
// - Handle item not found (404)
// - Show error if item data fails to load
// - Graceful fallback for missing photos
//
// RESPONSIVE DESIGN:
// - Photo gallery responsive
// - Stacked layout on mobile
// - Touch-friendly controls
//
// INTEGRATION POINTS:
// - Router: Navigate to ItemEditor.vue, UserDetail.vue, TransactionDetail.vue
// - Store: Cache item data
// - Notification Service: Notify seller of status changes
