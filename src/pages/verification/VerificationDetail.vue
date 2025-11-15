// PAGE PURPOSE: Individual verification review page with document viewer and approval/rejection actions
//
// MAIN FUNCTIONALITY:
// - Display complete user information for verification review
// - Show all uploaded identification documents with zoom and rotation
// - Provide AI-assisted fraud detection indicators
// - Compare document photo with user selfie
// - Allow approval or rejection with reason selection
// - View previous verification attempts and history
// - Add administrative notes and flags
//
// UI COMPONENTS:
// - User information panel:
//   * Profile photo and selfie comparison
//   * Full name, email, phone number
//   * Account creation date, registration country
//   * Previous verification attempts count
//   * User account status and flags
// - Document viewer section:
//   * Uploaded document images (front, back, selfie)
//   * Zoom in/out controls
//   * Rotate document controls
//   * Side-by-side comparison view
//   * Document type label
// - Verification checklist:
//   * Name matches document ✓/✗
//   * Photo matches selfie ✓/✗
//   * Document not expired ✓/✗
//   * Document appears authentic ✓/✗
//   * Address readable ✓/✗
// - AI fraud detection panel:
//   * Overall risk score with explanation
//   * Specific fraud indicators detected
//   * Duplicate document warnings
//   * Image manipulation detection results
// - Previous submissions timeline (if exists)
// - Action buttons:
//   * Approve Verification (green)
//   * Reject Verification (red)
//   * Request Additional Documents (yellow)
//   * Flag for Fraud Review (orange)
//   * Add Note (gray)
// - Rejection reason modal (appears on reject)
// - Admin notes section (add private notes)
// - Verification history (all attempts for this user)
//
// DATA REQUIREMENTS:
// - State: verification, isLoading, selectedDocument, zoomLevel, rotation, checklistStatus, notes
// - URL params: verificationId (from queue or direct link)
// - API: GET /api/admin/verifications/:id
// - Response: {
//     id, userId, submittedAt, status,
//     user: { name, email, phone, photo, registrationDate, country, accountStatus },
//     documents: [{ type, frontUrl, backUrl, selfieUrl, uploadedAt }],
//     riskScore, fraudIndicators: [{ type, severity, description }],
//     checklistItems: { nameMatch: bool, photoMatch: bool, notExpired: bool, authentic: bool, readable: bool },
//     previousAttempts: [{ id, submittedAt, status, rejectionReason }],
//     assignedTo: adminId,
//     notes: [{ adminId, adminName, note, timestamp }]
//   }
// - Action APIs:
//   * POST /api/admin/verifications/:id/approve
//   * POST /api/admin/verifications/:id/reject (payload: { reason, details })
//   * POST /api/admin/verifications/:id/request-documents (payload: { requestedDocuments[], message })
//   * POST /api/admin/verifications/:id/flag-fraud
//   * POST /api/admin/verifications/:id/notes (payload: { note })
//
// WORKFLOW:
// 1. Load verification details on page mount using ID from URL
// 2. Display user information and documents
// 3. Show AI fraud indicators and risk score
// 4. Admin reviews documents using viewer tools (zoom, rotate, compare)
// 5. Admin completes verification checklist manually
// 6. Admin decides action:
//    a. APPROVE: Confirm approval, send success notification to user
//    b. REJECT: Select rejection reason, add details, send notification
//    c. REQUEST MORE: Specify documents needed, send request to user
//    d. FLAG FRAUD: Move to fraud investigation queue
// 7. Action recorded in audit log and verification history
// 8. Redirect to next pending verification or back to queue
//
// DOCUMENT VIEWER FEATURES:
// - View front and back of ID document side-by-side
// - Zoom in up to 400% to check details
// - Rotate documents if uploaded incorrectly
// - Full-screen mode for detailed inspection
// - Compare document photo with user selfie side-by-side
// - Highlight extracted text fields (AI OCR results)
//
// VERIFICATION CHECKLIST:
// - Name on document matches registered name
// - Photo on document matches selfie photo
// - Document expiration date is valid (not expired)
// - Document appears authentic (no tampering signs)
// - Address and other details are readable
// - Admin manually checks each item before approval
//
// AI FRAUD DETECTION INDICATORS:
// - Overall risk score (0-100) with color coding
// - Specific warnings:
//   * Duplicate document (same ID submitted by multiple users)
//   * Image manipulation detected (photoshopping)
//   * Document not from claimed country
//   * Facial recognition mismatch (photo vs selfie)
//   * Document reported as stolen/fraudulent
// - Each indicator has severity level and explanation
//
// REJECTION REASONS (Dropdown):
// - Document expired
// - Document unclear/unreadable
// - Photo doesn't match
// - Document appears tampered/fake
// - Incomplete information
// - Wrong document type
// - Suspected fraud
// - Other (with details field)
//
// APPROVAL WORKFLOW:
// 1. Admin clicks "Approve Verification"
// 2. Confirm approval modal appears
// 3. Admin confirms
// 4. Backend updates user verification status to "verified"
// 5. User receives approval notification (email + in-app)
// 6. Verification unlocks user account features (buying, renting)
// 7. Admin redirected to next pending verification
//
// REJECTION WORKFLOW:
// 1. Admin clicks "Reject Verification"
// 2. Rejection reason modal opens
// 3. Admin selects primary reason and adds details
// 4. Admin confirms rejection
// 5. Backend updates status to "rejected"
// 6. User receives rejection notification with reason and resubmission instructions
// 7. User can resubmit with new documents
// 8. Admin redirected to next pending verification
//
// REQUEST ADDITIONAL DOCUMENTS:
// - Admin specifies which documents are needed
// - Custom message to user explaining requirements
// - User receives notification to upload additional documents
// - Verification stays in pending state
// - Auto-assigns back to same admin when documents uploaded
//
// SECURITY CONSIDERATIONS:
// - Lock verification when admin opens (prevent concurrent reviews)
// - Only assigned admin or unassigned verifications can be reviewed
// - Audit log all approval/rejection actions
// - Sensitive document URLs expire after 1 hour
// - Admin notes are private (not shown to users)
// - Fraud flags trigger immediate security review
//
// PREVIOUS ATTEMPTS DISPLAY:
// - Timeline of all previous verification submissions
// - Show each attempt's submission date, status, and rejection reason
// - Highlight patterns (multiple rejections for same reason)
// - Warning if >3 previous rejections (potential fraud)
//
// PERFORMANCE OPTIMIZATION:
// - Lazy load document images
// - Preload next verification in queue for faster navigation
// - Cache verification data during review session
//
// ERROR HANDLING:
// - Handle case where verification no longer exists (already processed)
// - Show error if document images fail to load
// - Retry mechanism for action failures
//
// INTEGRATION POINTS:
// - Router: Navigate to next verification, return to queue
// - API Service: Verification detail, approval, rejection endpoints
// - Image Viewer: Zoom, rotate, full-screen document viewer
// - Notification Service: Send user notifications on approve/reject
// - Audit Service: Log all verification actions
