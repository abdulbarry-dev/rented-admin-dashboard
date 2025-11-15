// PAGE PURPOSE: Two-factor authentication verification screen for admin users with 2FA enabled
//
// MAIN FUNCTIONALITY:
// - Display 6-digit code input interface
// - Accept verification code from authenticator app (Google Authenticator, Authy, etc.)
// - Verify code with authentication API
// - Complete login process after successful verification
// - Provide backup code option for emergency access
//
// UI COMPONENTS:
// - 6-digit code input (separate boxes for each digit or single input)
// - Auto-focus and auto-advance between digit inputs
// - Submit button (auto-submit on 6th digit entry)
// - Resend code option (for SMS-based 2FA if applicable)
// - "Use backup code" link for emergency access
// - Loading state during verification
// - Error message for invalid codes
// - Countdown timer showing code expiration (30 seconds)
//
// DATA REQUIREMENTS:
// - State: verificationCode, isLoading, errorMessage, sessionId, remainingAttempts
// - Session storage: sessionId from Login.vue
// - API: POST /api/admin/auth/verify-2fa
// - Request payload: { sessionId, code }
// - Response: { success, token, adminProfile }
//
// WORKFLOW:
// 1. Retrieve sessionId from route params or session storage (passed from Login.vue)
// 2. Display code input interface
// 3. User enters 6-digit code from authenticator app
// 4. Auto-submit when 6 digits entered or manual submit
// 5. Verify code with API
// 6. If valid, store authentication token and redirect to dashboard
// 7. If invalid, show error and allow retry (maximum 3 attempts)
// 8. If 3 failed attempts, lock account and redirect to login
// 9. Track remaining attempts and show warning
//
// VALIDATION RULES:
// - Code must be exactly 6 digits
// - Only numeric characters allowed
// - Maximum 3 verification attempts before lockout
// - Code expires after 30 seconds (TOTP standard)
//
// SECURITY CONSIDERATIONS:
// - SessionId required from previous login step (can't access directly)
// - If no sessionId, redirect to login page
// - Rate limiting on verification attempts (3 max)
// - Account temporarily locked after failed attempts
// - Clear verification code from memory after submission
// - Log all 2FA attempts for security audit
//
// BACKUP CODE FLOW:
// - Link to enter backup code instead of authenticator code
// - Backup codes are 8-character alphanumeric codes
// - Each backup code is single-use
// - Navigate to backup code input modal/page
//
// ERROR HANDLING:
// - Invalid code: Show error message, decrement remaining attempts
// - Expired session: Redirect to login
// - Network errors: Show retry option
// - Account locked: Show message and redirect to login
//
// USER EXPERIENCE:
// - Auto-advance focus between digit inputs
// - Paste support (paste 6-digit code into first input)
// - Clear button to reset all digits
// - Visual countdown timer for code expiration
//
// INTEGRATION POINTS:
// - Router: Navigate to /dashboard after success, redirect to /login if no sessionId
// - Store: Update auth store with token and admin profile
// - API Service: 2FA verification endpoint
