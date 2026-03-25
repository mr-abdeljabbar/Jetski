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

  const flyboard = await prisma.activity.create({
    data: {
      title: 'Flyboard Experience',
      description: 'Defy gravity and fly above the water with our professional flyboard equipment and instructors.',
      category: 'Extreme',
      maxPersons: 1,
      location: 'Taghazout Bay',
      safetyInfo: 'Must be a confident swimmer. Minimum age 16.',
      equipmentIncluded: 'Flyboard, Life Jacket, Helmet, Instructor',
      durations: {
        create: [
          { durationLabel: '20 minutes', price: 60 },
          { durationLabel: '40 minutes', price: 100 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1534433394982-6e44d371465e?auto=format&fit=crop&q=80&w=1000' },
        ],
      },
    },
  });

  const surfing = await prisma.activity.create({
    data: {
      title: 'Surf Lessons & Guiding',
      description: 'Learn to catch your first wave or improve your technique at the world-famous Taghazout surf spots.',
      category: 'Surf',
      maxPersons: 12,
      location: 'Anchor Point / Panoramas',
      safetyInfo: 'All levels welcome. Wetsuit and board included.',
      equipmentIncluded: 'Surfboard, Wetsuit, Transport, Instructor',
      durations: {
        create: [
          { durationLabel: '2 hours', price: 25 },
          { durationLabel: 'Full Day', price: 40 },
          { durationLabel: '3-Day Pack', price: 110 },
          { durationLabel: '5-Day Pack', price: 170 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1502680399488-6603a110037f?auto=format&fit=crop&q=80&w=1000' },
          { imageUrl: 'https://images.unsplash.com/photo-1459749411177-5071052b399d?auto=format&fit=crop&q=80&w=1000' },
        ],
      },
    },
  });

  const paddleBoard = await prisma.activity.create({
    data: {
      title: 'Stand Up Paddle Board',
      description: 'Explore the calm waters of Taghazout bay at your own pace on a paddle board.',
      category: 'Relax',
      maxPersons: 1,
      location: 'Taghazout Beach',
      safetyInfo: 'Life jackets provided.',
      equipmentIncluded: 'Paddle Board, Paddle, Life Jacket',
      durations: {
        create: [
          { durationLabel: '1 hour', price: 15 },
          { durationLabel: '2 hours', price: 25 },
          { durationLabel: 'Full Day', price: 45 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1541344999736-83eca872977a?auto=format&fit=crop&q=80&w=1000' },
        ],
      },
    },
  });

  const fishing = await prisma.activity.create({
    data: {
      title: 'Deep Sea Fishing',
      description: 'Join our experienced local fishermen for a half-day or full-day fishing trip in the Atlantic.',
      category: 'Fishing',
      maxPersons: 6,
      location: 'Agadir Port',
      safetyInfo: 'All equipment and bait provided.',
      equipmentIncluded: 'Rod, Reel, Bait, Tackle, Snacks',
      durations: {
        create: [
          { durationLabel: '4 hours (Half Day)', price: 200 },
          { durationLabel: '8 hours (Full Day)', price: 350 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1000' },
        ],
      },
    },
  });

  const boatTrip = await prisma.activity.create({
    data: {
      title: 'Sunset Boat Cruise',
      description: 'Relax and enjoy a beautiful sunset cruise with your friends and family along the coast.',
      category: 'Boat',
      maxPersons: 12,
      location: 'Agadir Marina',
      safetyInfo: 'Life jackets provided. Drinks and snacks on board.',
      equipmentIncluded: 'Boat, Captain, Drinks, Snacks',
      durations: {
        create: [
          { durationLabel: '2 hours', price: 150 },
          { durationLabel: '4 hours', price: 280 },
          { durationLabel: 'Full Day', price: 500 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1000' },
        ],
      },
    },
  });

  const safari = await prisma.activity.create({
    data: {
      title: 'Coastal Jet Ski Safari',
      description: 'A guided long-distance jet ski tour to explore hidden caves and secluded beaches.',
      category: 'Jet Ski',
      maxPersons: 2,
      location: 'Taghazout Beach',
      safetyInfo: 'Life jacket provided. Professional guide leads the way.',
      equipmentIncluded: 'Jet Ski, Life Jacket, Fuel, Guide',
      durations: {
        create: [
          { durationLabel: '2 hours', price: 110 },
          { durationLabel: '4 hours', price: 200 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1558604446-0b1d30f40212?auto=format&fit=crop&q=80&w=1000' },
        ],
      },
    },
  });
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
