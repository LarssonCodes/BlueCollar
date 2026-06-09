import { z } from 'zod';

export const createProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters long').max(100),
  phone: z.string().trim().regex(/^\d{10,15}$/, 'Phone number must contain between 10 and 15 digits'),
  trade: z.enum(['ELECTRICIAN', 'PLUMBER', 'DRIVER', 'WELDER', 'MECHANIC', 'CONSTRUCTION', 'OTHER'], {
    errorMap: () => ({ message: 'Invalid trade category selected' })
  }),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  city: z.string().trim().min(2, 'City name must be at least 2 characters long'),
  state: z.string().trim().min(2, 'State name must be at least 2 characters long'),
  experience: z.number().int().min(0, 'Experience cannot be negative'),
  bio: z.string().trim().min(10, 'Bio must be at least 10 characters long').max(1000),
  skills: z.array(z.string().trim().min(1, 'Skill tag cannot be empty')).min(1, 'Please add at least one skill'),
  isAvailable: z.boolean().optional().default(true),
  profilePicture: z.string().trim().optional().nullable()
});

export const updateProfileSchema = createProfileSchema.partial();
