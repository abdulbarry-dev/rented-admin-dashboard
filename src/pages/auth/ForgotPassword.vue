// PAGE PURPOSE: Password recovery request form for admin users who forgot their passwords
//
// MAIN FUNCTIONALITY:
// - Accept admin email address
// - Validate email format and existence in system
// - Send password reset link to registered email
// - Display confirmation message after successful submission
// - Provide navigation back to login page
//
// UI COMPONENTS:
// - Email input field with validation
// - Submit button with loading state
// - Success message with instructions to check email
// - Error message for invalid or non-existent email
// - Back to login link
// - Email icon and helper text
//
// DATA REQUIREMENTS:
// - State: email, isLoading, isSubmitted, errorMessage, successMessage
// - API: POST /api/admin/auth/forgot-password
// - Request payload: { email }
// - Response: { success, message, resetTokenExpiry }
//
// WORKFLOW:
// 1. User enters email address
// 2. Client-side email format validation
// 3. Submit request to forgot password API
// 4. If successful, display success message with instructions
// 5. If email not found, display generic message for security (don't reveal if email exists)
// 6. User checks email and clicks reset link
// 7. Reset link redirects to ResetPassword.vue with token parameter
//
// VALIDATION RULES:
// - Email: Valid email format required, non-empty
// - Rate limiting: Maximum 3 reset requests per email per hour
//
// SECURITY CONSIDERATIONS:
// - Don't reveal whether email exists in system (generic success message)
// - Reset tokens expire after 1 hour
// - Rate limiting to prevent email bombing
// - Reset tokens are single-use only
// - Log all password reset requests for audit trail
//
// USER EXPERIENCE:
// - Clear instructions on what will happen next
// - Resend option after 60 seconds if email not received
// - Link to contact support if issues persist
//
// INTEGRATION POINTS:
// - Router: Navigate to /login
// - API Service: Forgot password endpoint
// - Email Service: Backend sends password reset email with secure token link
