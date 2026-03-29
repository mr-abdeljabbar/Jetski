import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const r = await p.booking.findMany({
  select: { id: true, activityId: true, startDate: true, endDate: true, status: true }
});
console.log(JSON.stringify(r, null, 2));
await p.$disconnect();
