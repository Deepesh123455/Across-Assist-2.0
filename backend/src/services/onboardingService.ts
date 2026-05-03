import { prisma } from '../lib/prisma';
import { Segment, getQuestionsForSegment } from '../onboarding/questions';
import { buildProfile } from '../onboarding/profileBuilder';
import { selectBundle, getContextualAddOns, projectRevenue, AddOn } from '../onboarding/questionEngine';


export interface OnboardingStatus {
  segment: Segment | null;
  currentStep: number;
  totalSteps: number;
  answers: Record<string, string>;
  isComplete: boolean;
  recommendation: {
    bundleSlug: string;
    bundleName: string;
    bundleTagline: string | null;
    bundleDescription: string;
    whyThisBundle: unknown;
    objectionHandler: string;
    products: {
      id: string;
      name: string;
      category: string;
      iconEmoji: string | null;
      tagline: string | null;
      isAnchor: boolean;
    }[];
    addOns: AddOn[];
    metrics: {
      monthlyUnits: number;
      attachRate: number;
      planValue: number;
      revenueShare: number;
      projectedAnnualRevenue: number;
      attachRateP10: number | null;
      attachRateP50: number | null;
      attachRateP90: number | null;
      averagePlanValue: number;
    };
    similarClients: {
      name: string;
      logoUrl: string | null;
      tier: string;
      monthlyUnits: number | null;
    }[];
  } | null;
}

class OnboardingService {
  // ─── Save a single answer ────────────────────────────────────────────────────

  async saveAnswer(
    sessionToken: string | null | undefined,
    segment: Segment,
    questionId: string,
    answer: string,
    userId?: string,
    email?: string,
  ): Promise<{ currentStep: number; totalSteps: number; isLastQuestion: boolean; sessionToken?: string }> {
    let session = null;
    if (sessionToken) {
      session = await prisma.session.findUnique({ where: { sessionToken } });
    }
    
    if (!session) {
      const { randomUUID } = await import('crypto');
      const newToken = randomUUID();
      session = await prisma.session.create({
        data: {
          sessionToken: newToken,
          currentStep: 1,
          status: 'ACTIVE',
          userId: userId ?? null,
          email: email ?? null,
        },
      });
    }

    // Link session to user if it's not already linked
    if (userId && !session.userId) {
      await prisma.session.update({
        where: { id: session.id },
        data: { userId, email: email ?? session.email }
      });
      session.userId = userId;
      session.email = email ?? session.email;
    }

    // If the session was already COMPLETED by the login merge, create a fresh
    // onboarding session for this user and update the stored token.
    if (session.status === 'COMPLETED' && !((session.formData as any)?.onboarding_answers)) {
      const { randomUUID } = await import('crypto');
      const newToken = randomUUID();
      session = await prisma.session.create({
        data: {
          sessionToken: newToken,
          currentStep: 1,
          status: 'ACTIVE',
          userId: session.userId,
          email: session.email,
        },
      });
      // Return the new token so the frontend can persist it
      // (we embed it in the response so the hook can update localStorage)
    }

    const existingFormData = (session.formData as Record<string, unknown>) ?? {};
    const existingAnswers = (existingFormData['onboarding_answers'] as Record<string, string>) ?? {};

    const updatedAnswers = { ...existingAnswers, [questionId]: answer };
    const questions = getQuestionsForSegment(segment);
    const answeredCount = Object.keys(updatedAnswers).length;
    const totalSteps = questions.length;
    const isLastQuestion = answeredCount >= totalSteps;

    const mergedFormData = {
      ...existingFormData,
      segment,
      onboarding_answers: updatedAnswers,
      onboarding_complete: isLastQuestion,
    };

    // Direct prisma update (bypass sessionService.updateStep which merges differently)
    await prisma.session.update({
      where: { sessionToken: session.sessionToken! },
      data: {
        currentStep: answeredCount,
        formData: mergedFormData,
      },
    });

    return {
      currentStep: answeredCount,
      totalSteps,
      isLastQuestion,
      sessionToken: session.sessionToken as string,
    };
  }


  // ─── Generate deterministic recommendation ───────────────────────────────────

  async generateRecommendation(sessionToken: string, segment: Segment, userId?: string, email?: string) {
    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session) throw new Error('Session not found');

    // Link session to user if it's not already linked
    if (userId && !session.userId) {
      await prisma.session.update({
        where: { id: session.id },
        data: { userId, email: email ?? session.email }
      });
      session.userId = userId;
    }

    const formData = (session.formData as Record<string, unknown>) ?? {};
    const answers = (formData['onboarding_answers'] as Record<string, string>) ?? {};

    const profile = buildProfile(segment, answers);
    const bundleSlug = selectBundle(profile);
    const metrics = projectRevenue(profile);

    // Fetch bundle with full relations
    const bundle = await prisma.bundle.findUnique({
      where: { slug: bundleSlug },
      include: {
        bundleProducts: {
          orderBy: { sortOrder: 'asc' },
          include: {
            product: {
              select: { id: true, name: true, category: true, iconEmoji: true, tagline: true },
            },
          },
        },
        clientBundles: {
          where: { isActive: true },
          orderBy: { monthlyUnits: 'desc' },
          take: 5,
          include: {
            client: { select: { name: true, logoUrl: true, tier: true } },
          },
        },
      },
    });

    if (!bundle) throw new Error(`Bundle not found: ${bundleSlug}`);

    // For gadget: products NOT in bundle become add-ons
    let addOns: AddOn[] = getContextualAddOns(profile);
    if (segment === 'gadget') {
      const bundleProductIds = bundle.bundleProducts.map((bp) => bp.productId);
      const allProducts = await prisma.product.findMany({
        where: { isActive: true },
        select: { id: true, name: true, category: true, iconEmoji: true, tagline: true, basePrice: true, description: true },
      });
      addOns = allProducts
        .filter((p) => !bundleProductIds.includes(p.id))
        .map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.basePrice),
          isDefault: false,
          segment: 'gadget',
          icon: p.iconEmoji ?? '🛡️',
        }));
    }

    const products = bundle.bundleProducts.map((bp) => ({
      id: bp.product.id,
      name: bp.product.name,
      category: bp.product.category,
      iconEmoji: bp.product.iconEmoji,
      tagline: bp.product.tagline,
      isAnchor: bp.isAnchor,
    }));

    const similarClients = bundle.clientBundles.map((cb) => ({
      name: cb.client.name,
      logoUrl: cb.client.logoUrl,
      tier: cb.client.tier,
      monthlyUnits: cb.monthlyUnits,
    }));

    // Upsert Recommendation record
    await prisma.recommendation.upsert({
      where: { sessionId: session.id },
      create: {
        sessionId: session.id,
        recommendedBundleId: bundle.id,
        bundleName: bundle.name,
        aiResponseRaw: JSON.stringify({ bundleName: bundle.name, products: products.map((p) => p.name) }),
        whyThisCombo: bundle.whyThisBundle as any,
        objectionHandler: bundle.objectionHandler,
        similarClients: similarClients.map((c) => c.name),
        projectedAnnualRevenue: metrics.projectedAnnualRevenue,
        projectedAttachmentRate: metrics.attachRate,
        projectedPlanValue: metrics.planValue,
        fromCache: false,
      },
      update: {
        recommendedBundleId: bundle.id,
        bundleName: bundle.name,
        aiResponseRaw: JSON.stringify({ bundleName: bundle.name, products: products.map((p) => p.name) }),
        whyThisCombo: bundle.whyThisBundle as any,
        objectionHandler: bundle.objectionHandler,
        similarClients: similarClients.map((c) => c.name),
        projectedAnnualRevenue: metrics.projectedAnnualRevenue,
        projectedAttachmentRate: metrics.attachRate,
        projectedPlanValue: metrics.planValue,
        fromCache: false,
      },
    });

    // Mark session as complete + mark user onboarding done
    await prisma.session.update({
      where: { id: session.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        formData: {
          ...(session.formData as Record<string, unknown>),
          onboarding_complete: true,
        },
      },
    });

    if (session.userId) {
      await prisma.user.update({
        where: { id: session.userId },
        data: { onboardingDone: true },
      });
    }

    return {
      bundleSlug: bundle.slug,
      bundleName: bundle.name,
      bundleTagline: bundle.tagline,
      bundleDescription: bundle.description,
      whyThisBundle: bundle.whyThisBundle,
      objectionHandler: bundle.objectionHandler,
      products,
      addOns,
      metrics: {
        ...metrics,
        attachRateP10: bundle.attachRateP10 ? Number(bundle.attachRateP10) : null,
        attachRateP50: bundle.attachRateP50 ? Number(bundle.attachRateP50) : null,
        attachRateP90: bundle.attachRateP90 ? Number(bundle.attachRateP90) : null,
        averagePlanValue: Number(bundle.averagePlanValue),
      },
      similarClients,
    };
  }

  // ─── Get current profile status ─────────────────────────────────────────────

  async getProfileStatus(sessionToken: string): Promise<OnboardingStatus> {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { recommendation: true },
    });

    if (!session) throw new Error('Session not found');

    const formData = (session.formData as Record<string, unknown>) ?? {};
    const segment = (formData['segment'] as Segment | null) ?? null;
    const answers = (formData['onboarding_answers'] as Record<string, string>) ?? {};
    const isComplete = ((formData['onboarding_complete'] as boolean) ?? false) || !!session.recommendation;
    const totalSteps = segment ? getQuestionsForSegment(segment).length : 12;
    const currentStep = Object.keys(answers).length;

    let recommendation: OnboardingStatus['recommendation'] = null;

    if (session.recommendation) {
      const bundleSlug = await prisma.bundle
        .findUnique({ where: { id: session.recommendation.recommendedBundleId ?? '' } })
        .then((b) => b?.slug ?? '');

      const bundle = session.recommendation.recommendedBundleId
        ? await prisma.bundle.findUnique({
            where: { id: session.recommendation.recommendedBundleId },
            include: {
              bundleProducts: {
                orderBy: { sortOrder: 'asc' },
                include: {
                  product: {
                    select: { id: true, name: true, category: true, iconEmoji: true, tagline: true },
                  },
                },
              },
              clientBundles: {
                where: { isActive: true },
                take: 4,
                include: { client: { select: { name: true, logoUrl: true, tier: true } } },
              },
            },
          })
        : null;

      if (bundle && segment) {
        const profile = buildProfile(segment, answers);
        const metrics = projectRevenue(profile);
        let addOns: AddOn[] = getContextualAddOns(profile);

        if (segment === 'gadget') {
          const bundleProductIds = bundle.bundleProducts.map((bp) => bp.productId);
          const allProducts = await prisma.product.findMany({
            where: { isActive: true },
            select: { id: true, name: true, category: true, iconEmoji: true, tagline: true, basePrice: true, description: true },
          });
          addOns = allProducts
            .filter((p) => !bundleProductIds.includes(p.id))
            .map((p) => ({
              id: p.id, name: p.name, description: p.description,
              price: Number(p.basePrice), isDefault: false, segment: 'gadget', icon: p.iconEmoji ?? '🛡️',
            }));
        }

        recommendation = {
          bundleSlug,
          bundleName: bundle.name,
          bundleTagline: bundle.tagline,
          bundleDescription: bundle.description,
          whyThisBundle: bundle.whyThisBundle,
          objectionHandler: bundle.objectionHandler,
          products: bundle.bundleProducts.map((bp) => ({
            id: bp.product.id, name: bp.product.name, category: bp.product.category,
            iconEmoji: bp.product.iconEmoji, tagline: bp.product.tagline, isAnchor: bp.isAnchor,
          })),
          addOns,
          metrics: {
            ...metrics,
            attachRateP10: bundle.attachRateP10 ? Number(bundle.attachRateP10) : null,
            attachRateP50: bundle.attachRateP50 ? Number(bundle.attachRateP50) : null,
            attachRateP90: bundle.attachRateP90 ? Number(bundle.attachRateP90) : null,
            averagePlanValue: Number(bundle.averagePlanValue),
          },
          similarClients: bundle.clientBundles.map((cb) => ({
            name: cb.client.name, logoUrl: cb.client.logoUrl,
            tier: cb.client.tier, monthlyUnits: cb.monthlyUnits,
          })),
        };
      }
    }

    return { segment, currentStep, totalSteps, answers, isComplete, recommendation };
  }

  // ─── Get add-ons for a segment (thin wrapper for endpoint) ──────────────────

  async getAddOnsForSegment(segment: Segment, bundleSlug?: string): Promise<AddOn[]> {
    if (segment === 'travel')     return getContextualAddOns({ segment, answers: {}, partnerSubType: '', monthlyVolume: '', primaryGoal: '', distributionModel: '', preferredProtection: '' });
    if (segment === 'automobile') return getContextualAddOns({ segment, answers: {}, partnerSubType: '', monthlyVolume: '', primaryGoal: '', distributionModel: '', preferredProtection: '' });

    // gadget — derive from DB
    const bundleProductIds: string[] = [];
    if (bundleSlug) {
      const bundle = await prisma.bundle.findUnique({
        where: { slug: bundleSlug },
        select: { bundleProducts: { select: { productId: true } } },
      });
      bundle?.bundleProducts.forEach((bp) => bundleProductIds.push(bp.productId));
    }

    const allProducts = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, category: true, iconEmoji: true, tagline: true, basePrice: true, description: true },
    });

    return allProducts
      .filter((p) => !bundleProductIds.includes(p.id))
      .map((p) => ({
        id: p.id, name: p.name, description: p.description,
        price: Number(p.basePrice), isDefault: false, segment: 'gadget', icon: p.iconEmoji ?? '🛡️',
      }));
  }
}

export const onboardingService = new OnboardingService();
