/**
 * Validation Schemas - Centralized Export
 * 
 * This module exports all validation schemas used throughout the application.
 * Import from this file for clean and consistent imports across the codebase.
 * 
 * @module lib/validation
 * 
 * @example
 * ```typescript
 * // Clean imports
 * import { loginSchema, registerSchema } from '@/lib/validation';
 * 
 * // Or import specific types
 * import { LoginFormInput, RegisterFormInput } from '@/lib/validation';
 * ```
 */

// Login validation
export {
  loginSchema,
  emailOnlySchema,
  validateLoginCredentials,
  validateEmail,
  type LoginFormInput,
  type EmailOnlyInput,
} from './login.schema';

// Register validation  
export {
  registerSchema,
  validateRegistrationData,
  type RegisterFormInput,
} from './register.schema';

// ID Upload validation
export {
  idCardUploadSchema,
  fileSchema,
  FILE_VALIDATION,
  validateFile,
  validateIDCardUpload,
  isImageFile,
  formatFileSize,
  type IDCardUploadInput,
} from './id-upload.schema';
