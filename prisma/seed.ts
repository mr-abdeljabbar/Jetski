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

  // 1. Horse riding
  await prisma.activity.create({
    data: {
      id: "horse-riding",
      title: 'Horse riding',
      description: 'Experience a magical horse ride along the stunning Taghazout shoreline. Perfect for sunset views.',
      category: 'Nature',
      maxPersons: 10,
      location: 'Taghazout Beach',
      safetyInfo: 'Helmets provided. Experienced guides accompany every tour.',
      equipmentIncluded: 'Helmet, Horse, Guide',
      backgroundImageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20activity/horse_background.avif',
      durations: {
        create: [
          { durationLabel: '30 minutes', price: 10 },
          { durationLabel: '1 hour', price: 20 },
          { durationLabel: '3 hours', price: 25 },
          { durationLabel: 'Sunset (1.5h)', price: 45 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/horse/horse%201.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/horse/horse%202.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/horse/horse%203.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/horse/horse%204.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/horse/horse%205.png' },
        ],
      },
    },
  });

  // 2. Quad rentals
  await prisma.activity.create({
    data: {
      id: "quad-rentals",
      title: 'Quad rentals',
      description: 'Explore the rugged terrain and sand dunes of Taghazout on a powerful quad bike.',
      category: 'Adventure',
      maxPersons: 2,
      location: 'Dunes of Taghazout',
      safetyInfo: 'Safety briefing and helmet included. Must be 18+ to drive.',
      equipmentIncluded: 'Quad Bike, Helmet, Goggles, Guide',
      backgroundImageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20activity/quad_background.avif',
      durations: {
        create: [
          { durationLabel: '30 minutes', price: 25 },
          { durationLabel: '1 hour', price: 40 },
          { durationLabel: '3 hours', price: 60 },
          { durationLabel: 'Half Day (4h)', price: 100 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/quad/quad%201.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/quad/quad%202.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/quad/quad%203.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/quad/quad%204.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/quad/quad%205.png' },
        ],
      },
    },
  });

  // 3. Jetski rentals
  await prisma.activity.create({
    data: {
      id: "jetski-rentals",
      title: 'Jetski rentals',
      description: 'Feel the speed and spray of the ocean with our top-of-the-line jet ski rentals.',
      category: 'Water Sports',
      maxPersons: 2,
      location: 'Taghazout Bay',
      safetyInfo: 'Life jackets are mandatory. Briefing on water safety provided.',
      equipmentIncluded: 'Jet Ski, Life Jacket, Fuel',
      backgroundImageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20activity/jetski_background.avif',
      durations: {
        create: [
          { durationLabel: '30 minutes', price: 45 },
          { durationLabel: '1 hour', price: 80 },
          { durationLabel: '2 hours Safari', price: 150 },
          { durationLabel: '3 hours Safari', price: 200 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/jetski/jetski%201.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/jetski/jetski%202.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/jetski/jetski%203.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/jetski/jetski%204.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/jetski/jetski%205.png' },
        ],
      },
    },
  });

  // 4. Motobike rentals
  await prisma.activity.create({
    data: {
      id: "motobike-rentals",
      title: 'Motobike rentals',
      description: 'Roam free along the coast with our reliable motorbikes. The best way to explore at your own pace.',
      category: 'Adventure',
      maxPersons: 2,
      location: 'Taghazout Center',
      safetyInfo: 'Valid license required. Helmet must be worn at all times.',
      equipmentIncluded: 'Motorbike, Helmet, Insurance',
      backgroundImageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20activity/motobike_background.avif',
      durations: {
        create: [
          { durationLabel: '1 hour', price: 15 },
          { durationLabel: '3 hours', price: 30 },
          { durationLabel: 'Full Day', price: 60 },
          { durationLabel: '24 Hours', price: 80 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/motobike/motobike%201.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/motobike/motobike%202.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/motobike/motobike%203.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/motobike/motobike%204.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/motobike/motobike%205.png' },
        ],
      },
    },
  });

  // 5. Bike rentals
  await prisma.activity.create({
    data: {
      id: "bike-rentals",
      title: 'Bike rentals',
      description: 'Eco-friendly and fun. Cycle through the village and along the promenade on our comfortable bikes.',
      category: 'Nature',
      maxPersons: 1,
      location: 'Taghazout Promenade',
      safetyInfo: 'Lock provided. Please follow local traffic rules.',
      equipmentIncluded: 'Bicycle, Helmet, Lock',
      backgroundImageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20activity/bike_background.avif',
      durations: {
        create: [
          { durationLabel: '30 minutes', price: 5 },
          { durationLabel: '1 hour', price: 8 },
          { durationLabel: '2 hours', price: 10 },
          { durationLabel: '3 hours', price: 12 },
          { durationLabel: 'Half Day', price: 15 },
          { durationLabel: 'Full Day', price: 25 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bike/bike%201.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bike/bike%202.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bike/bike%203.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bike/bike%204.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bike/bike%205.png' },
        ],
      },
    },
  });

  // 6. Scooter rentals
  await prisma.activity.create({
    data: {
      id: "scooter-rentals",
      title: 'Scooter rentals',
      description: 'Zippy and convenient. Our scooters are perfect for quick trips to neighboring beaches and cafes.',
      category: 'Adventure',
      maxPersons: 2,
      location: 'Taghazout Main Road',
      safetyInfo: 'Helmet provided. License required for 125cc+.',
      equipmentIncluded: 'Scooter, Helmet, Insurance',
      backgroundImageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20activity/scooter_background.avif',
      durations: {
        create: [
          { durationLabel: '1 hour', price: 20 },
          { durationLabel: '3 hours', price: 40 },
          { durationLabel: 'Full Day', price: 60 },
          { durationLabel: '24 Hours', price: 75 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/scooter/scooter%201.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/scooter/scooter%202.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/scooter/scooter%203.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/scooter/scooter%204.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/scooter/scooter%205.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/scooter/scooter%206.png' },
        ],
      },
    },
  });

  // 7. Trottinette rentals
  await prisma.activity.create({
    data: {
      id: "trottinette-rentals",
      title: 'Trottinette rentals',
      description: 'Modern electric scooters for a smooth and effortless ride along the shoreline.',
      category: 'Nature',
      maxPersons: 1,
      location: 'Taghazout Boardwalk',
      safetyInfo: 'Recommended for ages 12+. Stay on designated paths.',
      equipmentIncluded: 'Electric Scooter, Helmet',
      backgroundImageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20activity/trottinette_background.avif',
      durations: {
        create: [
          { durationLabel: '30 minutes', price: 10 },
          { durationLabel: '1 hour', price: 18 },
          { durationLabel: '2 hours', price: 30 },
          { durationLabel: '3 hours', price: 40 },
          { durationLabel: 'Full Day', price: 50 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/trottinette/trottinette%201.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/trottinette/trottinette%202.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/trottinette/trottinette%203.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/trottinette/trottinette%204.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/trottinette/trottinette%205.png' },
        ],
      },
    },
  });

  // 8. Surfboard rentals
  await prisma.activity.create({
    data: {
      id: "surfboard-rentals",
      title: 'Surfboard rentals',
      description: 'Hire the best boards to catch the world-famous waves of Taghazout. All shapes and sizes available.',
      category: 'Surf',
      maxPersons: 1,
      location: 'Surf Shop HQ',
      safetyInfo: 'Know your limits. Surf within designated zones.',
      equipmentIncluded: 'Surfboard, Leash, Wax',
      backgroundImageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20activity/surfboard_background.avif',
      durations: {
        create: [
          { durationLabel: '1 hour', price: 7 },
          { durationLabel: '2 hours', price: 10 },
          { durationLabel: '3 hours', price: 12 },
          { durationLabel: 'Half Day', price: 15 },
          { durationLabel: 'Full Day', price: 20 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/surfboard/surfboard%201.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/surfboard/surfboard%202.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/surfboard/surfboard%203.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/surfboard/surfboard%204.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/surfboard/surfboard%205.png' },
        ],
      },
    },
  });

  // 9. Pedalo rentals
  await prisma.activity.create({
    data: {
      id: "pedalo-rentals",
      title: 'Pedalo rentals',
      description: 'Fun for the whole family! Pedal out into the bay for a relaxing time on the water.',
      category: 'Water Sports',
      maxPersons: 4,
      location: 'Taghazout Beach',
      safetyInfo: 'Life jackets provided. Maximum 4 people per pedalo.',
      equipmentIncluded: 'Pedalo, Life Jackets',
      backgroundImageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20activity/pedalo_background.avif',
      durations: {
        create: [
          { durationLabel: '1 hour', price: 15 },
          { durationLabel: '2 hours', price: 25 },
          { durationLabel: '3 hours', price: 35 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/pedalo/pedalo%201.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/pedalo/pedalo%202.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/pedalo/pedalo%203.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/pedalo/pedalo%204.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/pedalo/pedalo%205.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/pedalo/pedalo%206.png' },
        ],
      },
    },
  });

  // 10. Camels riding
  await prisma.activity.create({
    data: {
      id: "camels-riding",
      title: 'Camels riding',
      description: 'The authentic Moroccan experience. Traverse the dunes on the back of a friendly camel.',
      category: 'Nature',
      maxPersons: 10,
      location: 'Dunes of Taghazout',
      safetyInfo: 'Follow instructor guide. Gentle animals.',
      equipmentIncluded: 'Camel, Guide, Traditional Scarf',
      backgroundImageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20activity/camel_background.avif',
      durations: {
        create: [
          { durationLabel: '30 minutes', price: 15 },
          { durationLabel: '1 hour', price: 25 },
          { durationLabel: '2 hours', price: 40 },
          { durationLabel: '3 hours', price: 55 },
          { durationLabel: 'Sunset (1.5h)', price: 35 },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/camel/camel%201.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/camel/camel%202.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/camel/camel%203.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/camel/camel%204.png' },
          { imageUrl: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/camel/camel%205.png' },
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
