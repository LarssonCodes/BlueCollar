import { z } from 'zod';

export const createProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters long').max(100),
  companyName: z.string().trim().transform(val => val === '' ? null : val).optional().nullable(),
  phone: z.string().trim().regex(/^\d{10,15}$/, 'Phone number must contain between 10 and 15 digits'),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  city: z.string().trim().min(2, 'City name must be at least 2 characters long'),
  profilePicture: z.string().trim().optional().nullable()
});

export const updateProfileSchema = createProfileSchema.partial();
