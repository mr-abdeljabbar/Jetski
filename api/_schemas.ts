import { z } from 'zod';

export const BookingSchema = z.object({
  activityId: z.string().min(1, 'Activity ID required'),
  durationId: z.string().min(1, 'Duration ID required').nullable().optional(),
  fullName: z.string().min(2, 'Name too short').max(100),
  phone: z.string().min(8, 'Invalid phone').max(20),
  persons: z.preprocess((val) => Number(val), z.number().int().min(1).max(50)),
  isMultiDay: z.boolean().default(false),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format').nullable().optional(),
});

export const ContactSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(8).max(20),
  subject: z.string().min(2).max(200),
  activity: z.string().optional().nullable(),
  message: z.string().min(10).max(2000),
});

export const ActivitySchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(2000),
  category: z.string().min(2).max(100),
  maxPersons: z.preprocess((val) => Number(val), z.number().int().min(1).max(100)),
  location: z.string().min(2).max(200),
  safetyInfo: z.string().min(5),
  equipmentIncluded: z.string().min(5),
  rating: z.preprocess((val) => Number(val), z.number().min(1).max(5).default(5.0)),
  backgroundImageUrl: z.string().url().nullable().optional(),
  durations: z.array(z.object({
    durationLabel: z.string().min(2),
    price: z.preprocess((val) => Number(val), z.number().min(0)),
  })).min(1),
  images: z.array(z.object({
    imageUrl: z.string().url(),
  })).min(1),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Validation middleware factory
export const validate = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    req.body = result.data; // Use parsed/cleaned data
    next();
  };
};
