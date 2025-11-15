// PAGE PURPOSE: Admin authentication entry point with two-factor authentication support
//
// MAIN FUNCTIONALITY:
// - Accept admin credentials (email/password)
// - Validate input fields for format and required data
// - Submit login request to authentication API
// - Handle 2FA requirement and redirect to TwoFactorAuth.vue if enabled
// - Store authentication token in secure storage upon successful login
// - Redirect to dashboard after successful authentication
//
// UI COMPONENTS:
// - Login form with email and password inputs
// - "Remember me" checkbox for session persistence
// - "Forgot Password" link to password recovery
// - Submit button with loading state
// - Error message display for failed login attempts
// - Brand logo and admin panel branding
//
// DATA REQUIREMENTS:
// - State: email, password, rememberMe, isLoading, errorMessage
// - API: POST /api/admin/auth/login
// - Request payload: { email, password, rememberMe }
// - Response: { success, requiresTwoFactor, token, adminProfile, sessionId }
//
// WORKFLOW:
// 1. User enters credentials
// 2. Client-side validation (email format, password length minimum 8 characters)
// 3. Submit to authentication API
// 4. If requiresTwoFactor=true, store sessionId and navigate to TwoFactorAuth.vue
// 5. If requiresTwoFactor=false, store token and redirect to dashboard
// 6. If error, display error message and allow retry
// 7. Track failed login attempts and show lockout warning
//
// VALIDATION RULES:
// - Email: Valid email format required
// - Password: Minimum 8 characters, required field
// - Rate limiting: Maximum 5 failed attempts before 15-minute lockout
//
// SECURITY CONSIDERATIONS:
// - Passwords never stored in state after submission
// - Rate limiting on failed login attempts (show lockout message after 5 attempts)
// - HTTPS required for all authentication requests
// - Token stored in httpOnly cookies or secure storage
// - CSRF protection token included in requests
// - Clear sensitive data from memory on unmount
//
// INTEGRATION POINTS:
// - Router: Navigate to /two-factor-auth or /dashboard
// - Store: Update auth store with admin profile and token
// - API Service: Use centralized axios instance with error handling
