import { z } from 'zod';

export const applyToJobSchema = z.object({
  coverNote: z
    .string()
    .max(500, 'Cover note cannot exceed 500 characters')
    .optional()
    .nullable()
    .or(z.literal('')) // handle empty string as optional
});
