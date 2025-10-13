import { z } from 'zod';

// File validation constants
export const FILE_VALIDATION = {
  MAX_SIZE: 4 * 1024 * 1024, // 4MB
  ACCEPTED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
  ACCEPTED_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.pdf'],
} as const;

// File validation schema
export const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= FILE_VALIDATION.MAX_SIZE,
    `File size must be less than ${FILE_VALIDATION.MAX_SIZE / 1024 / 1024}MB`
  )
  .refine(
    (file) => FILE_VALIDATION.ACCEPTED_TYPES.includes(file.type as typeof FILE_VALIDATION.ACCEPTED_TYPES[number]),
    'File must be PNG, JPEG, or PDF format'
  );

// ID Card upload schema
export const idCardUploadSchema = z.object({
  frontPage: fileSchema,
  backPage: fileSchema,
  isValidConfirmed: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that the ID is valid',
  }),
});

// Type inference
export type IDCardUploadInput = z.infer<typeof idCardUploadSchema>;

// Validation helper
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  try {
    fileSchema.parse(file);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0]?.message };
    }
    return { isValid: false, error: 'Invalid file' };
  }
};
