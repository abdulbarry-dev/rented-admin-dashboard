// PAGE PURPOSE: AI-powered fraud detection dashboard showing suspicious documents and patterns
//
// MAIN FUNCTIONALITY:
// - Display all verifications flagged by AI fraud detection system
// - Show suspicious patterns: duplicate documents, image manipulation, stolen IDs
// - Provide fraud investigation tools and resources
// - Track blacklisted documents and users
// - Generate fraud reports and analytics
// - Coordinate fraud response actions (account suspension, legal reporting)
//
// UI COMPONENTS:
// - Fraud alert summary dashboard:
//   * Total active fraud alerts
//   * High-severity fraud cases (requires immediate action)
//   * Duplicate documents detected
//   * Blacklisted documents found
//   * Fraud trends (increasing/decreasing)
// - Alert priority tabs:
//   * Critical (immediate action required)
//   * High (review within 24 hours)
//   * Medium (review within 3 days)
//   * Low (informational)
//   * Resolved (archived fraud cases)
// - Fraud alerts table:
//   * Alert ID and timestamp
//   * User name and email
//   * Fraud type (duplicate doc, manipulation, stolen ID, blacklisted)
//   * Risk score and severity
//   * AI confidence level
//   * Detection method (algorithm name)
//   * Status (new, investigating, resolved, false positive)
//   * Assigned investigator
//   * Actions (Investigate, Resolve, Escalate)
// - Fraud detail panel:
//   * All detected fraud indicators
//   * Evidence (highlighted document issues)
//   * Similar cases found
//   * User account history
//   * Related accounts (same IP, device, address)
// - Investigation tools:
//   * Reverse image search for documents
//   * Duplicate finder (search for same document)
//   * User connection graph (linked accounts)
//   * IP and device fingerprint analysis
// - Action buttons:
//   * Mark as False Positive
//   * Suspend User Account
//   * Blacklist Document
//   * Report to Authorities
//   * Add to Watchlist
//   * Resolve Alert
//
// DATA REQUIREMENTS:
// - State: fraudAlerts, selectedAlert, filters, isLoading, investigationData
// - API: GET /api/admin/fraud-alerts
// - Query params: severity, status, fraudType, dateFrom, dateTo
// - Response: {
//     alerts: [{
//       id, userId, userName, userEmail, userPhoto,
//       verificationId, detectedAt,
//       fraudType: 'duplicate_document' | 'image_manipulation' | 'stolen_id' | 'blacklisted' | 'suspicious_pattern',
//       severity: 'critical' | 'high' | 'medium' | 'low',
//       riskScore, aiConfidence,
//       detectionMethod, evidence: {},
//       status, assignedTo, resolvedAt, resolution
//     }],
//     stats: {
//       total, critical, high, medium, low,
//       duplicatesFound, blacklistedFound,
//       trendPercentage
//     }
//   }
// - Investigation API: GET /api/admin/fraud-alerts/:id/investigate
// - Response: {
//     alert: { full details },
//     relatedCases: [ similar fraud alerts ],
//     userHistory: { previousFraudFlags, accountAge, transactionHistory },
//     linkedAccounts: [ { userId, linkType, confidence } ],
//     deviceFingerprint: { IP, device, location, vpnDetected },
//     documentAnalysis: { manipulation details, OCR results, metadata }
//   }
//
// WORKFLOW:
// 1. Load fraud alerts dashboard with summary statistics
// 2. Display alerts sorted by severity (critical first)
// 3. Admin filters by severity, type, or status
// 4. Admin clicks on alert to open investigation panel
// 5. Review all fraud indicators and evidence
// 6. Use investigation tools to gather more information
// 7. Decide action:
//    a. False Positive: Mark and close alert
//    b. Confirmed Fraud: Suspend user, blacklist document, report
//    c. Needs More Info: Assign investigator, add to watchlist
// 8. Execute action and log resolution
// 9. Alert marked as resolved with outcome documented
//
// FRAUD TYPES & DETECTION:
//
// 1. DUPLICATE DOCUMENTS:
//    - Same ID document submitted by multiple users
//    - AI image hashing detects identical documents
//    - Shows all users who submitted same document
//    - Evidence: Side-by-side comparison of submissions
//    - Action: Suspend all involved accounts, blacklist document
//
// 2. IMAGE MANIPULATION:
//    - Photoshopped or digitally altered documents
//    - AI detects signs of editing (layers, inconsistent lighting, artifacts)
//    - Metadata analysis shows editing software traces
//    - Evidence: Highlighted manipulation areas on image
//    - Action: Reject verification, flag user account
//
// 3. STOLEN/REPORTED IDS:
//    - Document matches blacklist of stolen/lost IDs
//    - Cross-reference with external fraud databases
//    - Evidence: Blacklist source and date added
//    - Action: Immediate account suspension, notify authorities
//
// 4. SUSPICIOUS PATTERNS:
//    - Multiple accounts from same device/IP
//    - Bulk account creation patterns
//    - Unusual registration location vs document country
//    - Evidence: Pattern analysis report
//    - Action: Investigate all linked accounts, watchlist
//
// 5. FACIAL RECOGNITION MISMATCH:
//    - Photo on document doesn't match selfie
//    - AI facial recognition confidence below threshold
//    - Evidence: Face comparison score and highlighted differences
//    - Action: Reject verification, request new submission
//
// INVESTIGATION TOOLS:
//
// - REVERSE IMAGE SEARCH:
//   * Search for document image across internet
//   * Detect if document photo taken from public source
//   * Find other instances of same document
//
// - DUPLICATE FINDER:
//   * Upload document to search internal database
//   * Find all matching or similar documents
//   * Show all users who submitted matches
//
// - ACCOUNT CONNECTION GRAPH:
//   * Visual graph of linked user accounts
//   * Links based on: same IP, device, email pattern, phone, address
//   * Identify fraud rings (multiple fake accounts)
//
// - METADATA ANALYSIS:
//   * Extract EXIF data from document images
//   * Check for editing software traces
//   * Verify image creation date (should be recent)
//   * Detect screenshots vs original photos
//
// FRAUD RESPONSE ACTIONS:
//
// - SUSPEND USER ACCOUNT:
//   * Immediately block user access
//   * Freeze all transactions
//   * Send fraud notification email
//   * Log suspension reason
//
// - BLACKLIST DOCUMENT:
//   * Add document to blacklist database
//   * Prevent future submissions of same document
//   * Alert other platforms (if sharing blacklist)
//
// - REPORT TO AUTHORITIES:
//   * Generate fraud report with evidence
//   * Submit to law enforcement or fraud bureaus
//   * Document reporting date and case number
//
// - ADD TO WATCHLIST:
//   * Flag user for enhanced monitoring
//   * Review all future activities
//   * Alert admins on any suspicious actions
//
// - MARK FALSE POSITIVE:
//   * Document why alert is false positive
//   * Improve AI model with feedback
//   * Clear user account of fraud flag
//
// FRAUD ANALYTICS:
// - Fraud detection rate over time
// - Most common fraud types
// - False positive rate (accuracy metric)
// - Average resolution time
// - Prevented fraud value estimate
// - Geographic fraud patterns
//
// BLACKLIST MANAGEMENT:
// - View all blacklisted documents
// - Add documents manually to blacklist
// - Remove documents from blacklist (with reason)
// - Import blacklists from external sources
// - Export blacklist for sharing with partners
// - Blacklist expiration dates (auto-remove after X years)
//
// SECURITY CONSIDERATIONS:
// - Only admins with "fraud_investigation" permission can access
// - All fraud investigations audited and logged
// - Sensitive user data access restricted
// - External reporting requires Super Admin approval
// - Blacklist changes require dual approval
//
// PERFORMANCE OPTIMIZATION:
// - Index fraud alerts by severity and status
// - Cache investigation data during session
// - Lazy load evidence images
// - Background processing for duplicate detection
//
// ERROR HANDLING:
// - Handle missing evidence data gracefully
// - Retry failed fraud detection API calls
// - Show errors in fraud actions clearly
//
// COMPLIANCE & LEGAL:
// - Maintain audit trail for legal proceedings
// - Document retention policy for fraud cases
// - Privacy compliance when reporting to authorities
// - User rights to appeal fraud decisions
// - Compliance with anti-money laundering regulations
//
// RESPONSIVE DESIGN:
// - Alerts table collapses to cards on mobile
// - Investigation panel full-screen on small devices
// - Touch-friendly action buttons
//
// INTEGRATION POINTS:
// - Router: Navigate to VerificationDetail.vue, UserDetail.vue
// - Store: Cache fraud alerts and investigation data
// - Notification Service: Alert investigators of critical fraud
// - External APIs: Fraud database checks, blacklist services
// - Legal/Compliance: Generate reports for authorities
