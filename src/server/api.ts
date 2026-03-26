import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
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

router.patch('/bookings/:id/status', authenticate, async (req, res) => {
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
    await prisma.activity.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
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
