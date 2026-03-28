import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const booking = await prisma.booking.findFirst();
  if (booking) {
    console.log('BOOKING_ID:' + booking.id);
  } else {
    // Create a dummy booking if none exists
    const activity = await prisma.activity.findFirst({ include: { durations: true } });
    if (!activity) {
      console.log('No activities found');
      return;
    }
    const newBooking = await prisma.booking.create({
      data: {
        activityId: activity.id,
        durationId: activity.durations[0].id,
        fullName: 'Test User',
        phone: '123456789',
        persons: 2,
        startDate: new Date(),
        status: 'pending'
      }
    });
    console.log('BOOKING_ID:' + newBooking.id);
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
