import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.activityDuration.deleteMany();
  await prisma.activityImage.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@taghazoutjet.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create Assistant
  const assistantPassword = await bcrypt.hash('assistant123', 10);
  await prisma.user.create({
    data: {
      email: 'assistant@taghazoutjet.com',
      password: assistantPassword,
      role: 'ASSISTANT',
    },
  });

  // Create Activities
  const jetSki = await prisma.activity.create({
    data: {
      title: 'Jet Ski Rental',
      description: 'Experience the thrill of riding a high-speed jet ski along the beautiful coast of Taghazout.',
      category: 'Jet Ski',
      maxPersons: 2,
      location: 'Taghazout Beach',
      safetyInfo: 'Life jacket provided. Must be 18+ to drive.',
      equipmentIncluded: 'Jet Ski, Life Jacket, Fuel',
      durations: {
        create: [
          { durationLabel: '30 minutes', price: 30 },
          { durationLabel: '1 hour', price: 50 },
          { durationLabel: '2 hours', price: 90 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1558604446-0b1d30f40212?auto=format&fit=crop&q=80&w=1000' },
          { imageUrl: 'https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&q=80&w=1000' },
        ],
      },
    },
  });

  const boatTrip = await prisma.activity.create({
    data: {
      title: 'Sunset Boat Cruise',
      description: 'Relax and enjoy a beautiful sunset cruise with your friends and family.',
      category: 'Boat',
      maxPersons: 8,
      location: 'Agadir Marina',
      safetyInfo: 'Life jackets provided.',
      equipmentIncluded: 'Boat, Captain, Drinks',
      durations: {
        create: [
          { durationLabel: '2 hours', price: 150 },
          { durationLabel: 'Half day', price: 300 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1000' },
        ],
      },
    },
  });

  // Create Reviews
  await prisma.review.createMany({
    data: [
      {
        name: 'John Smith',
        country: 'UK',
        rating: 5,
        message: 'Amazing jet ski experience! The staff was very professional and the equipment was top notch.',
      },
      {
        name: 'Marie Dubois',
        country: 'France',
        rating: 5,
        message: 'Superbe balade en bateau au coucher du soleil. Je recommande vivement !',
      },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
