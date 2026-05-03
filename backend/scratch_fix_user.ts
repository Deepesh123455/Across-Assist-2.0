import * as dotenv from 'dotenv';
dotenv.config();
import { prisma } from './src/lib/prisma';

async function main() {
  const USER_EMAIL = 'de3e@gmail.com';

  const user = await prisma.user.findFirst({
    where: { email: { equals: USER_EMAIL, mode: 'insensitive' } },
  });

  if (!user) {
    console.error('User not found!');
    return;
  }

  console.log('Found user:', user.id, user.email, 'primarySessionId:', user.primarySessionId);

  // Find the most recent session WITH a recommendation that has no userId (anonymous)
  const session = await prisma.session.findFirst({
    where: { recommendation: { isNot: null } },
    orderBy: { createdAt: 'desc' },
    include: { recommendation: true },
  });

  if (!session) {
    console.error('No sessions with recommendations found!');
    return;
  }

  console.log('Linking session:', session.id, 'Bundle:', session.recommendation?.bundleName);

  // Update session to link to user
  await prisma.session.update({
    where: { id: session.id },
    data: {
      userId: user.id,
      email: USER_EMAIL,
      isConverted: true,
      status: 'COMPLETED' as any,
    },
  });

  // Update user to set primarySession and onboardingDone
  await prisma.user.update({
    where: { id: user.id },
    data: {
      primarySessionId: session.id,
      onboardingDone: true,
    },
  });

  console.log('\n✅ SUCCESS! User', USER_EMAIL, 'is now linked to session', session.id);
  console.log('Bundle:', session.recommendation?.bundleName);
  console.log('\nThe user should now see their bundle on the dashboard after refreshing.');

  await prisma.$disconnect();
}

main().catch(console.error);
