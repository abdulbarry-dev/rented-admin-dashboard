

// PAGE PURPOSE: Password reset confirmation page where admin users set a new password
//
// MAIN FUNCTIONALITY:
// - Validate reset token from URL query parameter
// - Accept new password and confirmation password inputs
// - Validate password strength requirements
// - Submit new password to reset password API
// - Redirect to login page after successful password reset
//
// UI COMPONENTS:
// - New password input field with visibility toggle
// - Confirm password input field with visibility toggle
// - Password strength indicator (weak/medium/strong)
// - Submit button with loading state
// - Success message after password reset
// - Error message for invalid token or validation failures
// - Password requirements checklist
//
// DATA REQUIREMENTS:
// - State: newPassword, confirmPassword, isLoading, errorMessage, successMessage, resetToken
// - URL params: token (from email link)
// - API: POST /api/admin/auth/reset-password
// - Request payload: { token, newPassword }
// - Response: { success, message }
//
// WORKFLOW:
// 1. Extract reset token from URL query parameters on page load
// 2. Validate token with API to ensure it's valid and not expired
// 3. If token invalid/expired, show error and link to request new reset
// 4. User enters new password and confirms it
// 5. Real-time password strength validation
// 6. Check passwords match
// 7. Submit to reset password API
// 8. If successful, show success message and auto-redirect to login after 3 seconds
// 9. If error, display appropriate message
//
// VALIDATION RULES:
// - New password: Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
// - Confirm password: Must match new password exactly
// - Password cannot be same as previous 3 passwords (backend validation)
// - Token must be valid and not expired
//
// PASSWORD STRENGTH CALCULATION:
// - Weak: Less than 8 characters or missing character types
// - Medium: 8+ characters with 2-3 character types
// - Strong: 8+ characters with all 4 character types (upper, lower, number, special)
//
// SECURITY CONSIDERATIONS:
// - Token validated on both frontend (initial check) and backend (final submission)
// - Tokens expire after 1 hour from generation
// - Tokens are single-use and invalidated after successful reset
// - Password hashed before transmission (or use HTTPS)
// - Clear token from URL after use for security
// - Log password reset completion for audit trail
//
// ERROR HANDLING:
// - Expired token: Show message with link to request new reset
// - Invalid token: Show error with link to forgot password page
// - Network errors: Show retry option
//
// INTEGRATION POINTS:
// - Router: Navigate to /login after success, extract token from query params
// - API Service: Reset password endpoint
// - Store: Clear any existing auth state before reset
