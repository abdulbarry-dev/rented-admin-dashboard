// PAGE PURPOSE: Direct messaging interface to contact users and provide customer support
//
// MAIN FUNCTIONALITY:
// - Send direct messages to specific users
// - View conversation history with users
// - Send warnings, notifications, or support responses
// - Request additional information from users
// - Template-based messaging for common scenarios
// - Track message delivery and read status
// - Escalate conversations to other admins
//
// UI COMPONENTS:
// - User header:
//   * User name and photo
//   * Online/offline status indicator
//   * User verification status badge
//   * Quick links to user profile and transactions
// - Message thread panel:
//   * Conversation history (user messages and admin responses)
//   * Message bubbles with timestamps
//   * Read/delivered status indicators
//   * Admin name tags (which admin sent message)
//   * System messages (account updates, warnings)
// - Message composer:
//   * Text input area with formatting tools
//   * Attach files/images button
//   * Emoji picker
//   * Template selector dropdown
//   * Send button
//   * Draft auto-save indicator
// - Message templates sidebar:
//   * Quick templates for common messages
//   * Categories: Welcome, Verification, Support, Warning, Information
//   * Insert template button
//   * Edit templates link
// - Conversation actions toolbar:
//   * Flag conversation
//   * Assign to another admin
//   * Mark as resolved
//   * Archive conversation
//   * Export conversation
// - Admin notes section (private, not visible to user)
// - Related tickets/issues panel
//
// DATA REQUIREMENTS:
// - State: userId, messages, messageInput, selectedTemplate, isTyping, isSending
// - URL params: userId (from UserDetail.vue or direct link)
// - API: GET /api/admin/users/:userId/messages
// - Response: {
//     conversation: {
//       userId, userName, userPhoto, userStatus,
//       lastMessageAt, unreadCount,
//       assignedTo: { adminId, adminName },
//       status: 'open' | 'resolved' | 'archived',
//       priority: 'normal' | 'high' | 'urgent'
//     },
//     messages: [{
//       id, senderId, senderType: 'user' | 'admin' | 'system',
//       senderName, senderPhoto,
//       content, timestamp,
//       status: 'sent' | 'delivered' | 'read',
//       attachments: [{ url, fileName, fileType }],
//       messageType: 'text' | 'warning' | 'system' | 'template'
//     }],
//     adminNotes: [{ adminId, adminName, note, timestamp }]
//   }
// - Send message API: POST /api/admin/users/:userId/messages
// - Payload: { content, attachments[], templateId?, messageType }
//
// WORKFLOW:
// 1. Load conversation history with user
// 2. Display all previous messages in thread
// 3. Admin composes new message
// 4. Optionally select message template
// 5. Add attachments if needed
// 6. Send message
// 7. User receives notification (email + in-app)
// 8. Message appears in conversation thread
// 9. Admin can track delivery and read status
// 10. Add private admin notes as needed
//
// MESSAGE TEMPLATES:
// - VERIFICATION REQUESTS:
//   * "Please submit your ID verification"
//   * "Additional documents required for verification"
//   * "Your verification has been approved"
//   * "Verification rejected - resubmission needed"
//
// - WARNINGS:
//   * "Terms of Service violation warning"
//   * "Suspicious activity detected on your account"
//   * "Final warning before account suspension"
//
// - SUPPORT RESPONSES:
//   * "Thank you for contacting support"
//   * "Your issue has been resolved"
//   * "We're investigating your report"
//   * "Additional information needed"
//
// - GENERAL INFORMATION:
//   * "Welcome to our platform"
//   * "Account features unlocked"
//   * "Platform updates and announcements"
//   * "Transaction update"
//
// MESSAGE TYPES:
// - TEXT: Standard message communication
// - WARNING: Official warning (highlighted in red, logged)
// - SYSTEM: Automated system messages
// - TEMPLATE: Pre-formatted template message
//
// MESSAGE FEATURES:
// - Rich text formatting (bold, italic, links)
// - Attach images (verification requests, evidence)
// - Attach documents (policies, guides, receipts)
// - Emoji support for friendly communication
// - Mention other admins (@admin-name)
// - Auto-save drafts (recover unsent messages)
//
// DELIVERY & READ STATUS:
// - Sent: Message sent from admin
// - Delivered: Message reached user's account
// - Read: User opened and read message
// - Status indicators: checkmarks (sent ✓, delivered ✓✓, read ✓✓ blue)
//
// CONVERSATION MANAGEMENT:
// - ASSIGN TO ADMIN:
//   * Assign conversation to specific admin for handling
//   * Notify assigned admin
//   * Track assignment history
//
// - FLAG CONVERSATION:
//   * Flag for urgent attention
//   * Flag for legal review
//   * Flag for escalation
//
// - MARK AS RESOLVED:
//   * Close conversation when issue resolved
//   * User can reopen if needed
//   * Archive after X days of inactivity
//
// - ARCHIVE:
//   * Archive old conversations
//   * Hidden from active list
//   * Searchable in archives
//
// ADMIN NOTES (Private):
// - Add internal notes about conversation
// - Notes visible only to admins
// - Document decisions, actions taken, context
// - Useful for handoffs between admin shifts
// - Searchable for future reference
//
// ATTACHMENT HANDLING:
// - Support image attachments (PNG, JPG, GIF)
// - Support document attachments (PDF, DOC, TXT)
// - File size limit (e.g., 5MB per file)
// - Virus scanning on uploads
// - Secure file storage with expiration
//
// WARNING MESSAGES:
// - Clearly labeled as official warning
// - Logged in user's account history
// - Count towards suspension thresholds
// - Require reason and severity selection
// - Admin confirmation before sending
// - User receives warning notification
//
// NOTIFICATIONS:
// - User notified via email when admin sends message
// - User notified via in-app notification
// - Include message preview in notification
// - Direct link to view full message
//
// CONVERSATION SEARCH:
// - Search within conversation (find specific messages)
// - Search across all user conversations
// - Filter by date range
// - Filter by message type or sender
//
// RELATED INFORMATION:
// - Show user's open support tickets
// - Show recent account activities
// - Show transaction issues related to conversation
// - Link to dispute resolution if applicable
//
// SECURITY CONSIDERATIONS:
// - Only admins with "user_communication" permission can access
// - Audit log all messages sent to users
// - Warning messages require additional approval (for serious warnings)
// - Sensitive content filtered and logged
// - User privacy respected (no unauthorized access)
// - Messages encrypted in transit
//
// PERFORMANCE OPTIMIZATION:
// - Lazy load old messages (paginate history)
// - Real-time updates via WebSocket
// - Cache conversation data
// - Optimize image attachments (compression)
//
// ERROR HANDLING:
// - Retry failed message sends
// - Save draft if send fails
// - Show clear error messages
// - Handle offline scenarios gracefully
//
// COMPLIANCE:
// - Record all admin-user communications
// - Retain messages for legal/compliance requirements
// - Export capability for legal requests
// - User data privacy compliance (GDPR, etc.)
//
// RESPONSIVE DESIGN:
// - Mobile-friendly message bubbles
// - Touch-friendly composer
// - Collapsible templates sidebar on mobile
// - Full-screen mode for focused communication
//
// INTEGRATION POINTS:
// - Router: Navigate to UserDetail.vue, TransactionDetail.vue
// - WebSocket: Real-time message delivery and typing indicators
// - Notification Service: Email and in-app notifications
// - File Storage: Upload and serve attachments
// - Store: Cache conversation data
