import { z } from 'zod';

/**
 * Login Form Validation Schema
 * 
 * Validates user credentials for authentication including:
 * - Email address format and requirements
 * - Password strength and format
 * - Remember me preference (optional)
 * 
 * @module lib/validation/login.schema
 */

/**
 * Login identifier validation schema
 * 
 * Accepts either email or phone number
 * - Email: Valid email format (5-255 chars)
 * - Phone: International format with 10+ digits
 */
const loginIdentifierSchema = z
  .string()
  .min(1, 'Email or phone number is required')
  .trim()
  .refine(
    (value) => {
      // Check if it's a valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(value)) {
        return value.length >= 5 && value.length <= 255
      }
      
      // Check if it's a valid phone number (10+ digits, allows international format)
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
      return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10
    },
    'Please enter a valid email address or phone number'
  );

/**
 * Password validation schema
 * 
 * Requirements:
 * - Minimum 8 characters
 * - Maximum 100 characters
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 * - Required field
 */
const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

/**
 * Remember me validation schema
 * 
 * Optional boolean field to persist user session
 * Defaults to false if not provided
 */
const rememberMeSchema = z
  .boolean()
  .optional()
  .default(false);

/**
 * Complete login form validation schema
 * 
 * Combines all login fields with their respective validations
 * 
 * @example
 * ```typescript
 * import { loginSchema } from '@/lib/validation/login.schema';
 * 
 * // Login with email
 * const result = loginSchema.safeParse({
 *   login: 'user@example.com',
 *   password: 'SecurePass123',
 *   rememberMe: true
 * });
 * 
 * // Login with phone
 * const result = loginSchema.safeParse({
 *   login: '+1234567890',
 *   password: 'SecurePass123',
 *   rememberMe: true
 * });
 * 
 * if (result.success) {
 *   // Valid data
 *   console.log(result.data);
 * } else {
 *   // Validation errors
 *   console.log(result.error.errors);
 * }
 * ```
 */
export const loginSchema = z.object({
  login: loginIdentifierSchema,
  password: passwordSchema,
  rememberMe: rememberMeSchema,
});

/**
 * Type inference from login schema
 * 
 * Use this type for form data and component props
 * 
 * @example
 * ```typescript
 * import { LoginFormInput } from '@/lib/validation/login.schema';
 * 
 * const handleLogin = async (data: LoginFormInput) => {
 *   // data.login: string (email or phone)
 *   // data.password: string
 *   // data.rememberMe: boolean
 * };
 * ```
 */
export type LoginFormInput = z.infer<typeof loginSchema>;

/**
 * Partial schema for email-only validation
 * Useful for "Forgot Password" or email verification flows
 */
export const emailOnlySchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim(),
});

/**
 * Type for email-only validation
 */
export type EmailOnlyInput = z.infer<typeof emailOnlySchema>;

/**
 * Validate login credentials
 * 
 * Helper function to validate login form data with detailed error messages
 * 
 * @param data - The login form data to validate
 * @returns Object with success status and either parsed data or errors
 * 
 * @example
 * ```typescript
 * const result = validateLoginCredentials({
 *   email: 'user@example.com',
 *   password: 'weak',
 *   rememberMe: false
 * });
 * 
 * if (result.success) {
 *   console.log('Valid credentials:', result.data);
 * } else {
 *   console.log('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateLoginCredentials(data: unknown): {
  success: boolean;
  data?: LoginFormInput;
  errors?: Record<string, string>;
} {
  const result = loginSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  // Convert Zod errors to flat object structure
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });

  return {
    success: false,
    errors,
  };
}

/**
 * Validate email only
 * 
 * Helper function for email-only validation (e.g., forgot password)
 * 
 * @param email - The email address to validate
 * @returns Object with success status and either parsed data or error message
 * 
 * @example
 * ```typescript
 * const result = validateEmail('user@example.com');
 * 
 * if (result.success) {
 *   console.log('Valid email:', result.data.email);
 * } else {
 *   console.log('Error:', result.error);
 * }
 * ```
 */
export function validateEmail(email: string): {
  success: boolean;
  data?: EmailOnlyInput;
  error?: string;
} {
  const result = emailOnlySchema.safeParse({ email });

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: result.error.issues[0]?.message || 'Invalid email address',
  };
}
