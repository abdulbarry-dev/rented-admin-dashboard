// PAGE PURPOSE: User-reported items management for handling flags and policy violations
//
// MAIN FUNCTIONALITY:
// - Display all user-reported items requiring investigation
// - Review report details and evidence
// - Investigate flagged content for policy violations
// - Take action (remove item, warn seller, dismiss report, etc.)
// - Track report resolution and trends
// - Identify malicious reporters (false reports)
// - Manage reporter credibility scores
//
// UI COMPONENTS:
// - Reported items statistics (total reports, pending, resolved, dismissed)
// - Priority tabs (critical, high, medium, low priority)
// - Reports table (item, reporter, reason, report date, status, assigned admin)
// - Filter panel (report reason, date range, status, item category)
// - Report detail view (item info, report details, reporter history, investigation notes)
// - Action buttons (Remove Item, Warn Seller, Dismiss Report, Request More Info, Escalate)
// - Resolution form (action taken, reason, notes)
// - Reporter management (view reporter profile, credibility score)
// - Bulk report actions
//
// DATA REQUIREMENTS:
// - API: GET /api/admin/reported-items
// - Query params: status, reason, priority, dateFrom, dateTo, category
// - Response: {
//     reports: [{
//       id, itemId, itemTitle, itemPhoto, sellerId, sellerName,
//       reporterId, reporterName, reportReason, reportDetails,
//       reportedAt, evidence: [ screenshot URLs ],
//       priority: 'critical' | 'high' | 'medium' | 'low',
//       status: 'pending' | 'investigating' | 'resolved' | 'dismissed',
//       assignedTo: adminId,
//       resolution: { action, reason, resolvedAt, resolvedBy },
//       reporterCredibility: number (0-100)
//     }],
//     stats: { totalReports, pending, resolved, dismissed, avgResolutionTime },
//     reportReasons: [{ reason, count }]
//   }
//
// WORKFLOW:
// 1. Load reported items queue
// 2. Display reports sorted by priority
// 3. Admin selects report to investigate
// 4. Review item details and report reason
// 5. Check reporter credibility and history
// 6. Investigate evidence (screenshots, messages)
// 7. Decide action:
//    a. Remove item (if policy violation confirmed)
//    b. Warn seller (minor violation)
//    c. Dismiss report (false/malicious report)
//    d. Request more information
//    e. Escalate to legal/compliance
// 8. Document resolution with notes
// 9. Notify reporter and seller of outcome
// 10. Update report status to resolved
//
// REPORT REASONS (User-Selected):
// - Prohibited/Illegal Item: Item violates laws or marketplace policies
// - Counterfeit/Fake: Item is counterfeit or misrepresented
// - Inappropriate Content: Offensive images, text, or content
// - Misleading Description: Item description doesn't match photos/reality
// - Scam/Fraud: Suspected fraudulent listing
// - Spam: Repetitive or spam listing
// - Copyright Violation: Unauthorized use of copyrighted material
// - Price Gouging: Unreasonably high pricing for essential items
// - Duplicate Listing: Same item listed multiple times
// - Other: Custom reason provided by reporter
//
// PRIORITY LEVELS:
// - CRITICAL: Illegal items, safety hazards, urgent legal issues
//   * Immediate attention required
//   * Auto-assign to senior admin
//   * Escalate to legal if needed
//
// - HIGH: Prohibited items, fraud, counterfeits
//   * Review within 24 hours
//   * Potential account suspension
//
// - MEDIUM: Misleading descriptions, inappropriate content
//   * Review within 3 days
//   * Warning to seller likely
//
// - LOW: Spam, duplicates, minor issues
//   * Review within 7 days
//   * Educate seller
//
// INVESTIGATION PROCESS:
// 1. Review reported item (photos, description, pricing, seller info)
// 2. Check seller history (previous reports, violations, account age)
// 3. Review reporter credibility (past reports, accuracy rate)
// 4. Examine evidence provided (screenshots, links, messages)
// 5. Compare with marketplace policies
// 6. Check for similar violations by same seller
// 7. Determine if report is valid
// 8. Decide appropriate action
//
// ACTIONS AVAILABLE:
//
// - REMOVE ITEM:
//   * Confirm policy violation
//   * Select removal reason
//   * Item immediately delisted
//   * Seller notified with explanation
//   * Reporter notified of action taken
//   * Log in seller's violation history
//   * May trigger account suspension if repeated violations
//
// - WARN SELLER:
//   * Minor policy violation
//   * Send official warning to seller
//   * Require seller to fix issue
//   * Item remains listed (or suspended until fixed)
//   * Warning counts toward suspension threshold
//
// - DISMISS REPORT:
//   * No policy violation found
//   * False or malicious report
//   * Reduce reporter credibility score (if malicious)
//   * Notify reporter that no action was taken
//   * Item remains active
//
// - REQUEST MORE INFORMATION:
//   * Unclear if violation occurred
//   * Contact reporter for additional evidence
//   * Contact seller for clarification
//   * Put report on hold pending response
//
// - ESCALATE:
//   * Legal/compliance review needed
//   * Potential criminal activity
//   * Assign to legal team
//   * Suspend item pending investigation
//
// - EDIT ITEM:
//   * Admin corrects minor issues
//   * Fix misleading description
//   * Update photos
//   * Mark report as resolved
//
// EVIDENCE REVIEW:
// - Reporter-uploaded screenshots
// - Item photos and description
// - Conversation history (if applicable)
// - Price comparison data
// - External links or references
// - Previous reports on same item/seller
//
// REPORTER CREDIBILITY:
// - Track reporter's accuracy rate
// - High credibility (80-100): Accurate reports, trustworthy
// - Medium credibility (50-79): Mixed accuracy
// - Low credibility (0-49): Frequent false reports, may be malicious
// - Impact on priority: High-credibility reporters get faster review
// - Malicious reporters may be warned or banned from reporting
//
// SELLER VIOLATION TRACKING:
// - Count policy violations per seller
// - Track violation severity and frequency
// - 3 strikes policy:
//   * 1st violation: Warning
//   * 2nd violation: Temporary suspension
//   * 3rd violation: Permanent ban
// - Violation types tracked separately
// - Appeal process available
//
// RESOLUTION NOTES:
// - Admin documents decision rationale
// - Explain why action was taken
// - Include policy references
// - Useful for appeals and consistency
// - Searchable for future similar cases
//
// NOTIFICATIONS:
//
// - TO REPORTER:
//   * "Thank you for your report"
//   * "We've investigated and taken action" (don't specify action for privacy)
//   * "No policy violation found, item remains active"
//
// - TO SELLER:
//   * "Your item was reported and removed for [reason]"
//   * "You've received a warning for [violation]"
//   * "Your item has been reviewed and approved"
//   * Include policy guidelines and how to avoid future violations
//
// BULK REPORT ACTIONS:
// - Select multiple reports
// - Bulk dismiss (for spam reports)
// - Bulk assign to admin
// - Bulk escalate
// - Useful for handling report brigading or spam
//
// REPORT TRENDS ANALYSIS:
// - Most common report reasons
// - Categories with most reports
// - Sellers with repeat violations
// - Reporter patterns (identify serial reporters)
// - Seasonal trends (e.g., more scam reports during holidays)
// - Use insights to improve policies and prevention
//
// FALSE REPORTING PREVENTION:
// - Rate limit reports per user (max X reports per day)
// - Flag users with high false report rates
// - Warn users about malicious reporting consequences
// - Ban abusive reporters
// - Require evidence for certain report types
//
// SECURITY CONSIDERATIONS:
// - Only admins with "content_moderation" permission
// - Audit log all report resolutions
// - Protect reporter anonymity (don't expose to seller)
// - Handle sensitive reports (illegal content) with care
// - Legal compliance for certain violations
//
// PERFORMANCE OPTIMIZATION:
// - Paginate reports (50 per page)
// - Lazy load evidence images
// - Cache seller/reporter history
// - Index by priority for fast filtering
//
// ERROR HANDLING:
// - Handle missing evidence gracefully
// - Retry failed actions
// - Validate resolution data
// - Clear error messages
//
// RESPONSIVE DESIGN:
// - Reports table → cards on mobile
// - Touch-friendly action buttons
// - Collapsible detail panels
//
// INTEGRATION POINTS:
// - Navigate to ItemDetail.vue, UserDetail.vue
// - Notification Service: Notify reporters and sellers
// - Policy Engine: Check violations against policies
// - Legal/Compliance: Escalate serious violations
// - Audit Service: Log all report resolutions
