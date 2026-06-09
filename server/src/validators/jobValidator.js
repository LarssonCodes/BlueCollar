import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().trim().min(1, 'Job title is required').max(200),
  description: z.string().trim().min(1, 'Job description is required').max(5000),
  trade: z.enum(['ELECTRICIAN', 'PLUMBER', 'DRIVER', 'WELDER', 'MECHANIC', 'CONSTRUCTION', 'OTHER'], {
    errorMap: () => ({ message: 'Invalid trade category selected' })
  }),
  type: z.enum(['GIG', 'CONTRACT'], {
    errorMap: () => ({ message: 'Invalid job type selected' })
  }),
  pincode: z.string().trim().min(1, 'Pincode is required').max(10),
  city: z.string().trim().min(1, 'City is required').max(100),
  state: z.string().trim().min(1, 'State is required').max(100),
  payAmount: z.number().int().positive('Pay amount must be a positive integer'),
  payType: z.enum(['DAILY', 'MONTHLY'], {
    errorMap: () => ({ message: 'Invalid pay type selected' })
  }),
  startDate: z.string().trim().refine(val => !isNaN(Date.parse(val)), {
    message: 'Start date must be a valid date'
  }).transform(val => new Date(val)),
  endDate: z.string().trim().optional().nullable()
    .refine(val => !val || !isNaN(Date.parse(val)), {
      message: 'End date must be a valid date'
    })
    .transform(val => val ? new Date(val) : null)
});

export const updateJobSchema = createJobSchema.partial().extend({
  status: z.enum(['OPEN', 'FILLED', 'CLOSED'], {
    errorMap: () => ({ message: 'Invalid job status value' })
  }).optional()
});
