// PAGE PURPOSE: Account confirmation page for new admin users to verify email and activate account
//
// MAIN FUNCTIONALITY:
// - Validate account confirmation token from email link
// - Display account activation status
// - Optionally set initial password if not set during registration
// - Activate admin account in the system
// - Redirect to login page after successful confirmation
//
// UI COMPONENTS:
// - Account confirmation status message (processing/success/error)
// - Loading spinner during token verification
// - Success message with celebration icon
// - Error message for invalid or expired tokens
// - "Continue to Login" button after successful confirmation
// - Optional password setup form (if password not set during registration)
// - Resend confirmation email link (if token expired)
//
// DATA REQUIREMENTS:
// - State: confirmationToken, isLoading, confirmationStatus, errorMessage, requiresPassword
// - URL params: token (from confirmation email link)
// - API: POST /api/admin/auth/confirm-account
// - Request payload: { token, password (optional) }
// - Response: { success, message, adminEmail, requiresPasswordSetup }
//
// WORKFLOW:
// 1. Extract confirmation token from URL query parameters on page load
// 2. Automatically submit token to confirmation API
// 3. Display loading state during verification
// 4. If token valid:
//    a. Check if password setup required
//    b. If required, show password setup form
//    c. If not required, show success message
// 5. If token invalid/expired, show error with resend option
// 6. After successful confirmation, redirect to login after 3 seconds or on button click
// 7. If password setup required, submit password before redirecting
//
// VALIDATION RULES:
// - Token must be valid and not expired (24-hour expiration)
// - Password (if required): Minimum 8 characters, complexity requirements
// - Account can only be confirmed once
//
// SECURITY CONSIDERATIONS:
// - Token validated server-side for authenticity
// - Tokens expire after 24 hours
// - Tokens are single-use and invalidated after confirmation
// - Account activation logged in audit trail
// - Prevent duplicate confirmations
// - Clear token from URL after use
//
// EMAIL RESEND LOGIC:
// - If token expired, show "Resend Confirmation Email" button
// - Request new confirmation email via API
// - Rate limit: 1 resend per 5 minutes
// - Show success message after resend
//
// ERROR HANDLING:
// - Invalid token: Show error with resend option
// - Expired token: Show error with resend option
// - Already confirmed: Show message and redirect to login
// - Network errors: Show retry option
//
// USER EXPERIENCE:
// - Auto-confirmation on page load (no manual action needed)
// - Clear success/error messaging
// - Auto-redirect countdown timer
// - Manual redirect option (don't force wait)
//
// INTEGRATION POINTS:
// - Router: Navigate to /login after success, extract token from query params
// - API Service: Account confirmation endpoint, resend email endpoint
// - Email Service: Backend sends confirmation emails
