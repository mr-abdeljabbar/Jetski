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
      backgroundImageUrl: '/images/activities/activity background image/horse_background.png',
      durations: {
        create: [
          { durationLabel: '1 hour', price: 30 },
          { durationLabel: '2 hours', price: 50 },
          { durationLabel: 'Sunset (1.5h)', price: 45 },
        ],
      },
      images: {
        create: [
          { imageUrl: '/images/activities/main image card/7.png' },
          { imageUrl: '/images/activities/horse 2.png' },
          { imageUrl: '/images/activities/horse 3.png' },
          { imageUrl: '/images/activities/horse 4.png' },
          { imageUrl: '/images/activities/horse 5.png' },
          { imageUrl: '/images/activities/horse 6.png' },
          { imageUrl: '/images/activities/horse 7.png' },
          { imageUrl: '/images/activities/horse 8.png' },
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
      backgroundImageUrl: '/images/activities/activity background image/quad_background.png',
      durations: {
        create: [
          { durationLabel: '1 hour', price: 50 },
          { durationLabel: '2 hours', price: 80 },
          { durationLabel: 'Half Day', price: 140 },
        ],
      },
      images: {
        create: [
          { imageUrl: '/images/activities/main image card/4.png' },
          { imageUrl: '/images/activities/quad 2.png' },
          { imageUrl: '/images/activities/quad 3.png' },
          { imageUrl: '/activities/quad 4.png' },
          { imageUrl: '/images/activities/quad 5.png' },
          { imageUrl: '/images/activities/quad 6.png' },
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
      backgroundImageUrl: '/images/activities/activity background image/jetski_background.png',
      durations: {
        create: [
          { durationLabel: '30 minutes', price: 45 },
          { durationLabel: '1 hour', price: 80 },
          { durationLabel: '2 hours Safari', price: 150 },
        ],
      },
      images: {
        create: [
          { imageUrl: '/images/activities/jetski 1.png' },
          { imageUrl: '/images/activities/jetski 2.png' },
          { imageUrl: '/images/activities/jetski 3.png' },
          { imageUrl: '/images/activities/jetski 4.png' },
          { imageUrl: '/images/activities/jetski 5.png' },
          { imageUrl: '/images/activities/jetski 6.png' },
          { imageUrl: '/images/activities/jetski 7.png' },
          { imageUrl: '/images/activities/jetski 8.png' },
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
      backgroundImageUrl: '/images/activities/activity background image/motobike_background.png',
      durations: {
        create: [
          { durationLabel: '1 hour', price: 40 },
          { durationLabel: 'Full Day', price: 70 },
          { durationLabel: '24 Hours', price: 90 },
        ],
      },
      images: {
        create: [
          { imageUrl: '/images/activities/main image card/6.png' },
          { imageUrl: '/images/activities/motobike 2.png' },
          { imageUrl: '/images/activities/motobike 3.png' },
          { imageUrl: '/images/activities/motobike 4.png' },
          { imageUrl: '/images/activities/motobike 5.png' },
          { imageUrl: '/images/activities/motobike 6.png' },
          { imageUrl: '/images/activities/motobike 7.png' },
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
      backgroundImageUrl: '/images/activities/activity background image/bike_background.png',
      durations: {
        create: [
          { durationLabel: '2 hours', price: 10 },
          { durationLabel: 'Half Day', price: 15 },
          { durationLabel: 'Full Day', price: 25 },
        ],
      },
      images: {
        create: [
          { imageUrl: '/images/activities/main image card/8.png' },
          { imageUrl: '/images/activities/bike 2.png' },
          { imageUrl: '/images/activities/bike 3.png' },
          { imageUrl: '/images/activities/bike 4.png' },
          { imageUrl: '/images/activities/bike 5.png' },
          { imageUrl: '/images/activities/bike 6.png' },
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
      backgroundImageUrl: '/images/activities/activity background image/scooter_background.png',
      durations: {
        create: [
          { durationLabel: '1 hour', price: 25 },
          { durationLabel: 'Full Day', price: 45 },
          { durationLabel: '24 Hours', price: 60 },
        ],
      },
      images: {
        create: [
          { imageUrl: '/images/activities/main image card/3.png' },
          { imageUrl: '/images/activities/scooter 2.png' },
          { imageUrl: '/images/activities/scooter 3.png' },
          { imageUrl: '/images/activities/scooter 4.png' },
          { imageUrl: '/images/activities/scooter 5.png' },
          { imageUrl: '/images/activities/scooter 6.png' },
          { imageUrl: '/images/activities/scooter 7.png' },
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
      backgroundImageUrl: '/images/activities/activity background image/trottinette_background.png',
      durations: {
        create: [
          { durationLabel: '1 hour', price: 20 },
          { durationLabel: '2 hours', price: 35 },
          { durationLabel: 'Full Day', price: 50 },
        ],
      },
      images: {
        create: [
          { imageUrl: '/images/activities/main image card/1.png' },
          { imageUrl: '/images/activities/trottinette 2.png' },
          { imageUrl: '/images/activities/trottinette 3.png' },
          { imageUrl: '/images/activities/trottinette 4.png' },
          { imageUrl: '/images/activities/trottinette 5.png' },
          { imageUrl: '/images/activities/trottinette 6.png' },
          { imageUrl: '/images/activities/trottinette 7.png' },
          { imageUrl: '/images/activities/trottinette 8.png' },
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
      backgroundImageUrl: '/images/activities/activity background image/surboard_background.png',
      durations: {
        create: [
          { durationLabel: '2 hours', price: 10 },
          { durationLabel: 'Half Day', price: 15 },
          { durationLabel: 'Full Day', price: 20 },
        ],
      },
      images: {
        create: [
          { imageUrl: '/images/activities/main image card/2.png' },
          { imageUrl: '/images/activities/surfboard 2.png' },
          { imageUrl: '/images/activities/surfboard 3.png' },
          { imageUrl: '/images/activities/surfboard 4.png' },
          { imageUrl: '/images/activities/surfboard 5.png' },
          { imageUrl: '/images/activities/surfboard 6.png' },
          { imageUrl: '/images/activities/surfboard 7.png' },
          { imageUrl: '/images/activities/surfboard 8.png' },
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
      backgroundImageUrl: '/images/activities/activity background image/pedalo_background.png',
      durations: {
        create: [
          { durationLabel: '1 hour', price: 20 },
          { durationLabel: '2 hours', price: 35 },
        ],
      },
      images: {
        create: [
          { imageUrl: '/images/activities/main image card/5.png' },
          { imageUrl: '/images/activities/pedalo 2.png' },
          { imageUrl: '/images/activities/pedalo 3.png' },
          { imageUrl: '/images/activities/pedalo 4.png' },
          { imageUrl: '/images/activities/pedalo 5.png' },
          { imageUrl: '/images/activities/pedalo 6.png' },
          { imageUrl: '/images/activities/pedalo 7.png' },
          { imageUrl: '/images/activities/pedalo 8.png' },
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
      backgroundImageUrl: '/images/activities/activity background image/camel_background.png',
      durations: {
        create: [
          { durationLabel: '1 hour', price: 25 },
          { durationLabel: '2 hours', price: 40 },
          { durationLabel: 'Sunset (1.5h)', price: 35 },
        ],
      },
      images: {
        create: [
          { imageUrl: '/images/activities/main image card/9.png' },
          { imageUrl: '/images/activities/Camel 2.png' },
          { imageUrl: '/images/activities/Camel 3.png' },
          { imageUrl: '/images/activities/Camel 4.png' },
          { imageUrl: '/images/activities/Camel 5.png' },
          { imageUrl: '/images/activities/Camel 6.png' },
          { imageUrl: '/images/activities/Camel 7.png' },
          { imageUrl: '/images/activities/Camel 8.png' },
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
