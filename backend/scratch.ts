import { prisma } from './src/lib/prisma';
async function main() {
  const user = await prisma.user.findUnique({ where: { email: "de3e@gmail.com" }});
  if (!user) {
    console.log("User not found");
    return;
  }
  console.log("User found:", user.id, "onboardingDone:", user.onboardingDone, "primarySessionId:", user.primarySessionId);
  const sessions = await prisma.session.findMany({ where: { userId: user.id }, include: { recommendation: true }});
  console.log("Sessions:", sessions.length);
  for (const s of sessions) {
    console.log("Session", s.id, "status:", s.status, "hasRec:", !!s.recommendation);
  }
}
main().finally(() => prisma.$disconnect());
