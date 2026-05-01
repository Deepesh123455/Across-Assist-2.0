import { prisma } from './src/lib/prisma';
import { onboardingService } from './src/services/onboardingService';
import { Segment } from './src/onboarding/questions';

async function run() {
  try {
    const session = await prisma.session.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (!session) {
      console.log('No session found');
      return;
    }
    
    const segment = ((session.formData as any)?.segment || 'gadget') as Segment;
    console.log(`Testing generateRecommendation for session ${session.sessionToken} (segment: ${segment})`);
    
    const res = await onboardingService.generateRecommendation(session.sessionToken!, segment);
    console.log('Success:', res.bundleName);
  } catch (err: any) {
    console.error('Error in generateRecommendation:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
