
import * as dotenv from 'dotenv';
dotenv.config();
import { prisma } from './src/lib/prisma';

async function main() {
  console.log('\n--- ALL SESSIONS WITH RECOMMENDATIONS ---');
  const allSessionsWithRec = await prisma.session.findMany({
    where: { recommendation: { isNot: null } },
    include: { recommendation: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  console.log(`Found ${allSessionsWithRec.length} recent sessions with recommendations`);
  allSessionsWithRec.forEach(s => {
    console.log(`- ID: ${s.id}, Email: ${s.email}, UserId: ${s.userId}, Bundle: ${s.recommendation?.bundleName}`);
  });

  const user = await prisma.user.findFirst({
    where: { email: { contains: 'de3e', mode: 'insensitive' } }
  });
  if (user) {
    console.log('\n--- USER DE3E ---');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('PrimarySessionId:', user.primarySessionId);
  }

  await prisma.$disconnect();
}

main();
