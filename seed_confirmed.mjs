import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

// Add a confirmed booking for camels-riding on April 5 and April 10 2026
await p.booking.create({
  data: {
    activityId: 'camels-riding',
    fullName: 'Test User',
    phone: '+212600000001',
    persons: 2,
    startDate: '2026-04-05',
    status: 'confirmed',
  }
});

await p.booking.create({
  data: {
    activityId: 'camels-riding',
    fullName: 'Test User 2',
    phone: '+212600000002',
    persons: 1,
    startDate: '2026-04-10',
    status: 'confirmed',
  }
});

// Verify
const confirmed = await p.booking.findMany({
  where: { status: 'confirmed' },
  select: { activityId: true, startDate: true, status: true }
});
console.log('Confirmed bookings:', JSON.stringify(confirmed, null, 2));

await p.$disconnect();
