import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, upload } from './_upload.js';
import { 
  BookingSchema, 
  ContactSchema, 
  ActivitySchema, 
  LoginSchema, 
  validate 
} from './_schemas.js';
import { rateLimiter } from './_middleware.js';
import { stringify } from 'csv-stringify/sync';
import { generateInvoicePDF } from './_invoice.js';
import { sendBookingConfirmation } from './_mailer.js';

// Prisma Singleton for Serverless
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Auth Middleware
export const authenticate = (req: any, res: any, next: any) => {
  const token = 
    req.cookies?.auth_token ||           // httpOnly cookie
    req.headers.authorization?.split(' ')[1]; // fallback for API clients
    
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Role-based Authorization Middleware
export const authorize = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }
    next();
  };
};

// Todos Routes
router.get('/todos', authenticate, async (req, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'asc' },
  });
  res.json(todos);
});

router.post('/todos', authenticate, authorize(['ADMIN']), async (req, res) => {
  const { text } = req.body;
  const todo = await prisma.todo.create({
    data: { text },
  });
  res.json(todo);
});

router.patch('/todos/:id', authenticate, authorize(['ASSISTANT']), async (req, res) => {
  const { completed } = req.body;
  const todo = await prisma.todo.update({
    where: { id: req.params.id },
    data: { completed },
  });
  res.json(todo);
});

router.delete('/todos/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  await prisma.todo.delete({
    where: { id: req.params.id },
  });
  res.json({ success: true });
});

// Notes Routes
router.get('/notes', authenticate, async (req, res) => {
  const notes = await prisma.note.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  res.json(notes);
});

router.post('/notes', authenticate, authorize(['ADMIN']), async (req, res) => {
  const { content } = req.body;
  const note = await prisma.note.create({
    data: { content },
  });
  res.json(note);
});

router.put('/notes/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  const { content } = req.body;
  const note = await prisma.note.update({
    where: { id: req.params.id },
    data: { content },
  });
  res.json(note);
});

// Auth Routes
router.post('/auth/login', rateLimiter(5, 60000, 'Too many login attempts'), validate(LoginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );

  res
    .cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({ user: { id: user.id, email: user.email, role: user.role } });
});

router.post('/auth/logout', (req, res) => {
  res
    .clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .json({ success: true });
});

// Activities Routes
router.get('/activities', async (req, res) => {
  const activities = await prisma.activity.findMany({
    include: { images: true, durations: true },
  });
  res.json(activities);
});

router.get('/activities/:id', async (req, res) => {
  const activity = await prisma.activity.findUnique({
    where: { id: req.params.id },
    include: { images: true, durations: true },
  });
  if (!activity) return res.status(404).json({ error: 'Not found' });
  res.json(activity);
});

// Public: confirmed booking dates and times for a given activity (for the calendar widget)
router.get('/activities/:id/confirmed-dates', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        activityId: req.params.id,
        status: 'confirmed',
      },
      select: { startDate: true, endDate: true, time: true },
    });
    
    // Group times by date string (yyyy-mm-dd)
    const dateMap: Record<string, string[]> = {};
    
    bookings.forEach((b: any) => {
      const datesToProcess = [];
      if (b.startDate) datesToProcess.push(new Date(b.startDate).toISOString().split('T')[0]);
      if (b.endDate) datesToProcess.push(new Date(b.endDate).toISOString().split('T')[0]);
      
      datesToProcess.forEach(dateStr => {
        if (!dateMap[dateStr]) dateMap[dateStr] = [];
        if (b.time && !dateMap[dateStr].includes(b.time)) {
          dateMap[dateStr].push(b.time);
        }
      });
    });
    
    res.json(dateMap);
  } catch {
    res.status(500).json({ error: 'Failed to fetch confirmed dates' });
  }
});

// Bookings Routes
router.post('/bookings', rateLimiter(10, 60000, 'Too many booking attempts'), validate(BookingSchema), async (req, res) => {
  try {
    const { 
      activityId, 
      durationId, 
      fullName, 
      phone, 
      persons, 
      isMultiDay, 
      startDate, 
      endDate, 
      time 
    } = req.body;

    const booking = await prisma.booking.create({
      data: {
        activityId,
        durationId,
        fullName,
        phone,
        persons,
        isMultiDay,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        time,
      },
      include: {
        activity: true,
        duration: true
      }
    });

    // Trigger email notification
    sendBookingConfirmation({
      customerName: booking.fullName,
      customerPhone: booking.phone,
      activityTitle: booking.activity.title,
      bookingDate: booking.startDate.toLocaleDateString('en-GB'),
      bookingTime: booking.time,
      persons: booking.persons,
      price: booking.duration?.price ?? 0,
      bookingId: booking.id,
    }).catch(err => console.error('Email failed:', err));
    
    res.json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
});

router.get('/bookings', authenticate, async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string | undefined;
  const search = req.query.search as string | undefined;

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
    ];
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { activity: true, duration: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({
    data: bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// Anonymized public bookings endpoint for social proof
router.get('/bookings/recent-public', async (req, res) => {
  try {
    const recentBookings = await prisma.booking.findMany({
      where: {
        status: { in: ['confirmed', 'completed'] },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
        },
      },
      select: {
        persons: true,
        createdAt: true,
        activity: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json(recentBookings.map(b => ({
      activityTitle: b.activity.title,
      persons: b.persons,
      createdAt: b.createdAt.toISOString(),
    })));
  } catch {
    res.json([]);
  }
});

// CSV Export for Bookings
router.get(
  '/bookings/export/csv',
  authenticate,
  authorize(['ADMIN']),
  async (req, res) => {
    try {
      const { startDate, endDate, status, activityId } = req.query as Record<string, string>;

      const where: any = {};
      if (status) where.status = status;
      if (activityId) where.activityId = activityId;
      if (startDate || endDate) {
        where.startDate = {};
        if (startDate) where.startDate.gte = new Date(startDate);
        if (endDate) where.startDate.lte = new Date(endDate);
      }

      const bookings = await prisma.booking.findMany({
        where,
        include: { activity: true, duration: true },
        orderBy: { createdAt: 'desc' },
      });

      const rows = bookings.map(b => ({
        'Booking ID': b.id,
        'Customer Name': b.fullName,
        'Phone': b.phone,
        'Activity': b.activity?.title ?? 'N/A',
        'Duration': b.duration?.durationLabel ?? 'N/A',
        'Price (€)': b.duration?.price ?? 0,
        'Persons': b.persons,
        'Start Date': b.startDate ? new Date(b.startDate).toLocaleDateString('en-GB') : '',
        'End Date': b.endDate ? new Date(b.endDate).toLocaleDateString('en-GB') : '',
        'Time': b.time ?? '',
        'Multi-Day': b.isMultiDay ? 'Yes' : 'No',
        'Status': b.status,
        'Created At': new Date(b.createdAt).toLocaleString('en-GB'),
      }));

      const csv = stringify(rows, { header: true });
      const filename = `bookings-${new Date().toISOString().split('T')[0]}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send('\uFEFF' + csv); // BOM for Excel
    } catch (error) {
      res.status(500).json({ error: 'Export failed' });
    }
  }
);

// PDF Invoice Download
router.get(
  '/bookings/:id/invoice',
  authenticate,
  authorize(['ADMIN', 'ASSISTANT']),
  async (req, res) => {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
        include: { activity: true, duration: true },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const invoiceNumber = `TJ-${new Date().getFullYear()}-${booking.id.substring(0, 6).toUpperCase()}`;
      
      const pdfBuffer = await generateInvoicePDF({ 
        booking: booking as any, 
        invoiceNumber 
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition', 
        `attachment; filename="invoice-${invoiceNumber}.pdf"`
      );
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Invoice error:', error);
      res.status(500).json({ 
        error: 'Failed to generate invoice',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }
);

router.patch('/bookings/:id/status', authenticate, authorize(['ADMIN', 'ASSISTANT']), async (req, res) => {
  const { status } = req.body;
  const booking = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json(booking);
});

// Reviews Routes
router.get('/reviews', async (req, res) => {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(reviews);
});

// Contact Routes
router.post('/contact', async (req, res) => {
  try {
    const message = await prisma.contactMessage.create({
      data: req.body,
    });
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

router.get('/contact', authenticate, async (req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(messages);
});

// Upload Route (Admin Only)
router.post('/upload', authenticate, authorize(['ADMIN']), upload.single('image'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '-')}`;
    const bucketName = process.env.R2_BUCKET_NAME || 'taghazoutjet';
    
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    // Ensure R2_PUBLIC_URL doesn't end with slash
    let baseUrl = process.env.R2_PUBLIC_URL || '';
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    
    const publicUrl = `${baseUrl}/${filename}`;
    res.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Activity Management (Admin Only)
router.post('/activities', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { title, description, category, maxPersons, location, safetyInfo, equipmentIncluded, durations, images, rating } = req.body;
    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        category,
        maxPersons: parseInt(maxPersons),
        location,
        safetyInfo,
        equipmentIncluded,
        rating: parseFloat(rating || 5.0),
        backgroundImageUrl: req.body.backgroundImageUrl,
        durations: {
          create: durations,
        },
        images: {
          create: images,
        },
      },
      include: { durations: true, images: true },
    });
    res.json(activity);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

router.put('/activities/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { title, description, category, maxPersons, location, safetyInfo, equipmentIncluded, durations, images, rating } = req.body;
    
    // Simplification: delete old and create new for relations (production would use update/upsert)
    const activity = await prisma.activity.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        category,
        maxPersons: parseInt(maxPersons),
        location,
        safetyInfo,
        equipmentIncluded,
        rating: parseFloat(rating || 5.0),
        backgroundImageUrl: req.body.backgroundImageUrl,
        durations: {
          deleteMany: {},
          create: durations.map((d: any) => ({ durationLabel: d.durationLabel, price: parseFloat(d.price) })),
        },
        images: {
          deleteMany: {},
          create: images.map((i: any) => ({ imageUrl: i.imageUrl })),
        },
      },
      include: { durations: true, images: true },
    });
    res.json(activity);
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(400).json({ error: 'Failed to update' });
  }
});

router.delete('/activities/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    // Manually delete bookings first to prevent foreign key constraint fails
    // from the Booking -> ActivityDuration relation
    await prisma.booking.deleteMany({
      where: { activityId: req.params.id }
    });

    await prisma.activity.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(400).json({ error: 'Failed to delete' });
  }
});

// Message Management (Admin Only)
router.delete('/contact/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    await prisma.contactMessage.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete message' });
  }
});

router.patch('/contact/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: 'Failed' });
  }
});

// Booking Deletion (Admin Only)
router.delete('/bookings/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    await prisma.booking.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete booking' });
  }
});

export default router;
