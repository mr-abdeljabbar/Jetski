import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, upload } from './_upload.js';

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
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
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
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
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
router.post('/bookings', async (req, res) => {
  try {
    const { activityId, durationId, fullName, phone, persons, date, time, isMultiDay, startDate, endDate } = req.body;
    const booking = await prisma.booking.create({
      data: {
        activityId,
        durationId,
        fullName,
        phone,
        persons: parseInt(persons),
        isMultiDay: !!isMultiDay,
        startDate: startDate || date,
        endDate: endDate || null,
        time: time || null,
      },
    });
    res.json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
});

router.get('/bookings', authenticate, async (req, res) => {
  const bookings = await prisma.booking.findMany({
    include: { activity: true, duration: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(bookings);
});

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
