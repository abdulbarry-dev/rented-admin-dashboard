import { z } from 'zod';

// Registration form validation schema
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must not exceed 100 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
    email: z
      .string()
      .email('Invalid email address')
      .min(5, 'Email is required')
      .max(255, 'Email is too long'),
    phone: z
      .string()
      .min(10, 'Please enter a valid phone number (at least 10 digits)')
      .regex(
        /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
        'Invalid phone number format'
      ),
    gender: z
      .string()
      .refine((val) => val === 'H' || val === 'F', {
        message: 'Please select your gender',
      }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password is too long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
  });

// Type inference
export type RegisterFormInput = z.infer<typeof registerSchema>;
