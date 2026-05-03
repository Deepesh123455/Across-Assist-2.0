require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const email = "de3e@gmail.com";
  const user = await prisma.user.findUnique({
    where: { email },
    include: { primarySession: { include: { recommendation: true } } }
  });
  if (!user) {
    console.log("User not found");
    return;
  }
  console.log("USER_DATA_START");
  console.log(JSON.stringify({
    email: user.email,
    onboardingDone: user.onboardingDone,
    primarySessionId: user.primarySessionId,
    primarySessionStatus: user.primarySession?.status,
    hasRecommendation: !!user.primarySession?.recommendation
  }, null, 2));
  
  const sessions = await prisma.session.findMany({
    where: { userId: user.id },
    include: { recommendation: true }
  });
  console.log("SESSIONS_START");
  console.log(JSON.stringify(sessions.map(s => ({
    id: s.id,
    status: s.status,
    isConverted: s.isConverted,
    hasRec: !!s.recommendation
  })), null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
