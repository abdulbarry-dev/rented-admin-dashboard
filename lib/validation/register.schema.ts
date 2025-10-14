import { z } from 'zod';

/**
 * Registration Form Validation Schema
 * 
 * Validates new user registration data including:
 * - Personal information (full name, gender)
 * - Contact details (email, phone)
 * - Account security (password, confirmation)
 * 
 * @module lib/validation/register.schema
 */

/**
 * Full name validation schema
 * 
 * Requirements:
 * - Minimum 2 characters
 * - Maximum 100 characters
 * - Only letters and spaces allowed
 * - Required field
 */
const fullNameSchema = z
  .string()
  .min(1, 'Full name is required')
  .min(2, 'Full name must be at least 2 characters')
  .max(100, 'Full name must not exceed 100 characters')
  .regex(
    /^[a-zA-Z\s]+$/,
    'Full name can only contain letters and spaces'
  )
  .trim();

/**
 * Email validation schema
 * 
 * Requirements:
 * - Valid email format
 * - Minimum 5 characters
 * - Maximum 255 characters
 * - Required field
 */
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must not exceed 255 characters')
  .toLowerCase()
  .trim();

/**
 * Phone number validation schema
 * 
 * Requirements:
 * - Minimum 10 digits
 * - International format supported
 * - Allows +, (), -, ., and spaces
 * - Required field
 */
const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .min(10, 'Please enter a valid phone number (at least 10 digits)')
  .regex(
    /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
    'Invalid phone number format'
  )
  .trim();

/**
 * Gender validation schema
 * 
 * Requirements:
 * - Must be either 'H' (Homme/Male) or 'F' (Femme/Female)
 * - Required field
 */
const genderSchema = z
  .string()
  .refine((val) => val === 'H' || val === 'F', {
    message: 'Please select your gender',
  });

/**
 * Password validation schema
 * 
 * Requirements:
 * - Minimum 8 characters
 * - Maximum 100 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
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
 * Password confirmation validation schema
 * 
 * Requirements:
 * - Must be provided
 * - Must match the password field (validated at schema level)
 */
const confirmPasswordSchema = z
  .string()
  .min(1, 'Please confirm your password');

/**
 * Complete registration form validation schema
 * 
 * Combines all registration fields with password confirmation matching
 * 
 * @example
 * ```typescript
 * import { registerSchema } from '@/lib/validation/register.schema';
 * 
 * const result = registerSchema.safeParse({
 *   fullName: 'John Doe',
 *   email: 'john@example.com',
 *   phone: '+1234567890',
 *   gender: 'H',
 *   password: 'SecurePass123',
 *   confirmPassword: 'SecurePass123'
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
export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    phone: phoneSchema,
    gender: genderSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Type inference from registration schema
 * 
 * Use this type for form data and component props
 * 
 * @example
 * ```typescript
 * import { RegisterFormInput } from '@/lib/validation/register.schema';
 * 
 * const handleRegister = async (data: RegisterFormInput) => {
 *   // data.fullName: string
 *   // data.email: string
 *   // data.phone: string
 *   // data.gender: string
 *   // data.password: string
 *   // data.confirmPassword: string
 * };
 * ```
 */
export type RegisterFormInput = z.infer<typeof registerSchema>;

/**
 * Validate registration data
 * 
 * Helper function to validate registration form data with detailed error messages
 * 
 * @param data - The registration form data to validate
 * @returns Object with success status and either parsed data or errors
 * 
 * @example
 * ```typescript
 * const result = validateRegistrationData({
 *   fullName: 'John Doe',
 *   email: 'john@example.com',
 *   phone: '+1234567890',
 *   gender: 'H',
 *   password: 'SecurePass123',
 *   confirmPassword: 'SecurePass123'
 * });
 * 
 * if (result.success) {
 *   console.log('Valid data:', result.data);
 * } else {
 *   console.log('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateRegistrationData(data: unknown): {
  success: boolean;
  data?: RegisterFormInput;
  errors?: Record<string, string>;
} {
  const result = registerSchema.safeParse(data);

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
