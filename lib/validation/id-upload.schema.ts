import { z } from 'zod';

/**
 * ID Card Upload Validation Schema
 * 
 * Validates identity document uploads including:
 * - File size constraints
 * - Accepted file formats (images and PDFs)
 * - Front and back page requirements
 * - User confirmation of validity
 * 
 * @module lib/validation/id-upload.schema
 */

/**
 * File validation constants
 * 
 * Defines the constraints for uploaded identity documents
 */
export const FILE_VALIDATION = {
  /** Maximum file size: 4MB */
  MAX_SIZE: 4 * 1024 * 1024,
  
  /** Accepted MIME types for uploads */
  ACCEPTED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'] as const,
  
  /** Accepted file extensions */
  ACCEPTED_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.pdf'] as const,
} as const;

/**
 * Individual file validation schema
 * 
 * Validates a single file upload with:
 * - Size limit check (max 4MB)
 * - Format validation (PNG, JPEG, PDF only)
 * 
 * @example
 * ```typescript
 * const result = fileSchema.safeParse(file);
 * if (result.success) {
 *   console.log('Valid file:', result.data);
 * }
 * ```
 */
export const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size > 0,
    'File is required'
  )
  .refine(
    (file) => file.size <= FILE_VALIDATION.MAX_SIZE,
    `File size must be less than ${FILE_VALIDATION.MAX_SIZE / 1024 / 1024}MB`
  )
  .refine(
    (file) => FILE_VALIDATION.ACCEPTED_TYPES.includes(file.type as typeof FILE_VALIDATION.ACCEPTED_TYPES[number]),
    'File must be PNG, JPEG, or PDF format'
  );

/**
 * Complete ID card upload validation schema
 * 
 * Validates the full ID card upload form including:
 * - Front page document
 * - Back page document
 * - User confirmation of validity
 * 
 * @example
 * ```typescript
 * import { idCardUploadSchema } from '@/lib/validation/id-upload.schema';
 * 
 * const result = idCardUploadSchema.safeParse({
 *   frontPage: frontFile,
 *   backPage: backFile,
 *   isValidConfirmed: true
 * });
 * 
 * if (result.success) {
 *   // Valid upload data
 *   console.log(result.data);
 * } else {
 *   // Validation errors
 *   console.log(result.error.issues);
 * }
 * ```
 */
export const idCardUploadSchema = z.object({
  /** Front page of the ID card */
  frontPage: fileSchema,
  
  /** Back page of the ID card */
  backPage: fileSchema,
  
  /** User must confirm the ID is valid and readable */
  isValidConfirmed: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that the ID is valid and readable',
  }),
});

/**
 * Type inference from ID upload schema
 * 
 * Use this type for form data and component props
 * 
 * @example
 * ```typescript
 * import { IDCardUploadInput } from '@/lib/validation/id-upload.schema';
 * 
 * const handleUpload = async (data: IDCardUploadInput) => {
 *   // data.frontPage: File
 *   // data.backPage: File
 *   // data.isValidConfirmed: boolean
 * };
 * ```
 */
export type IDCardUploadInput = z.infer<typeof idCardUploadSchema>;

/**
 * Validate a single file
 * 
 * Helper function to validate individual file uploads
 * Returns validation result with success status and error message
 * 
 * @param file - The file to validate
 * @returns Object with validation status and optional error message
 * 
 * @example
 * ```typescript
 * const result = validateFile(selectedFile);
 * 
 * if (result.isValid) {
 *   console.log('File is valid');
 * } else {
 *   console.log('Error:', result.error);
 * }
 * ```
 */
export function validateFile(file: File): { 
  isValid: boolean; 
  error?: string;
} {
  try {
    fileSchema.parse(file);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.issues[0]?.message || 'Invalid file'
      };
    }
    return { 
      isValid: false, 
      error: 'Invalid file'
    };
  }
}

/**
 * Validate complete ID upload data
 * 
 * Helper function to validate the complete ID card upload form
 * 
 * @param data - The ID upload form data to validate
 * @returns Object with success status and either parsed data or errors
 * 
 * @example
 * ```typescript
 * const result = validateIDCardUpload({
 *   frontPage: frontFile,
 *   backPage: backFile,
 *   isValidConfirmed: true
 * });
 * 
 * if (result.success) {
 *   console.log('Valid upload:', result.data);
 * } else {
 *   console.log('Errors:', result.errors);
 * }
 * ```
 */
export function validateIDCardUpload(data: unknown): {
  success: boolean;
  data?: IDCardUploadInput;
  errors?: Record<string, string>;
} {
  const result = idCardUploadSchema.safeParse(data);

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
 * Check if a file is an image
 * 
 * Helper function to determine if a file is an image type
 * Useful for conditional rendering of preview thumbnails
 * 
 * @param file - The file to check
 * @returns True if the file is an image (PNG, JPEG, JPG)
 * 
 * @example
 * ```typescript
 * if (isImageFile(file)) {
 *   // Show image preview
 *   const url = URL.createObjectURL(file);
 * } else {
 *   // Show PDF icon
 * }
 * ```
 */
export function isImageFile(file: File): boolean {
  return ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
}

/**
 * Format file size for display
 * 
 * Converts bytes to human-readable format (KB, MB)
 * 
 * @param bytes - The file size in bytes
 * @returns Formatted string with appropriate unit
 * 
 * @example
 * ```typescript
 * formatFileSize(1024); // "1.00 KB"
 * formatFileSize(1048576); // "1.00 MB"
 * formatFileSize(2500000); // "2.38 MB"
 * ```
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
