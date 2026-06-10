import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['WORKER', 'EMPLOYER'], {
    errorMap: () => ({ message: 'Role must be either WORKER or EMPLOYER' })
  })
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long').max(100, 'New password must be at most 100 characters long')
});

export const googleAuthSchema = z.object({
  accessToken: z.string().trim().min(1, 'Access token is required'),
  role: z.enum(['WORKER', 'EMPLOYER']).optional()
});

