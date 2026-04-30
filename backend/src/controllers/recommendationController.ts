import { NextFunction, Request, Response } from 'express';
import {
  ClientType,
  DistributionModel,
  GadgetCategory,
  MonthlyVolumeRange,
  PrimaryGoal,
} from '@prisma/client';
import { prisma } from '../lib/prisma';
import { groqService } from '../services/groqService';
import { sessionService } from '../services/sessionService';
import { calculateRevenue, formatDisplayStat } from '../services/revenueService';

// ─── Enum mapping helpers ─────────────────────────────────────────────────────

const clientTypeMap: Record<string, ClientType> = {
  'OEM/Brand': ClientType.OEM,
  'NBFC/Fintech': ClientType.NBFC,
  Retailer: ClientType.RETAILER,
  Marketplace: ClientType.MARKETPLACE,
  Telecom: ClientType.TELECOM,
};

const gadgetCategoryMap: Record<string, GadgetCategory> = {
  Smartphones: GadgetCategory.SMARTPHONES,
  'Laptops/Tablets': GadgetCategory.LAPTOPS_TABLETS,
  TVs: GadgetCategory.TVS,
  'Large Appliances': GadgetCategory.LARGE_APPLIANCES,
  Wearables: GadgetCategory.WEARABLES,
  'Refurbished Devices': GadgetCategory.REFURBISHED_DEVICES,
};

const volumeMap: Record<string, MonthlyVolumeRange> = {
  'Under 5K units': MonthlyVolumeRange.UNDER_5K,
  '5K–50K': MonthlyVolumeRange.RANGE_5K_50K,
  '50K–5L': MonthlyVolumeRange.RANGE_50K_5L,
  '5L+ units': MonthlyVolumeRange.ABOVE_5L,
};

const goalMap: Record<string, PrimaryGoal> = {
  'Post-warranty revenue': PrimaryGoal.POST_WARRANTY_REVENUE,
  'Additional revenue per device': PrimaryGoal.ADDITIONAL_REVENUE_PER_DEVICE,
  'Reduce repair complaints': PrimaryGoal.REDUCE_REPAIR_COMPLAINTS,
  'Beat competitors': PrimaryGoal.BEAT_COMPETITORS,
  'Bundle with EMI/financing': PrimaryGoal.BUNDLE_WITH_EMI,
};

const distributionMap: Record<string, DistributionModel> = {
  'Offline retail': DistributionModel.OFFLINE_RETAIL,
  'Online/e-commerce': DistributionModel.ONLINE_ECOMMERCE,
  'NBFC EMI': DistributionModel.NBFC_EMI,
  'Direct-to-consumer': DistributionModel.DIRECT_TO_CONSUMER,
  Mixed: DistributionModel.MIXED,
};

// ─── Controllers ─────────────────────────────────────────────────────────────

export const generate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { sessionToken, partnerType, products, volume, goal, distribution } = req.body;

    if (!partnerType || !products?.length || !volume || !goal || !distribution) {
      res.status(400).json({
        success: false,
        error: 'All 5 form fields are required: partnerType, products, volume, goal, distribution',
      });
      return;
    }

    // ── Session handling ──
    let session;
    let returnedToken: string;

    if (sessionToken) {
      try {
        const updated = await sessionService.updateStep(sessionToken, 5, {
          partnerType,
          products,
          volume,
          goal,
          distribution,
        });
        session = updated;
        returnedToken = sessionToken;
      } catch {
        // Session not found — create a new one
        const created = await sessionService.createSession(
          req.ip,
          req.get('user-agent')
        );
        session = created;
        returnedToken = created.sessionToken;
      }
    } else {
      const created = await sessionService.createSession(
        req.ip,
        req.get('user-agent')
      );
      session = created;
      returnedToken = created.sessionToken;
    }

    // ── Fetch DB context for Groq ──
    const [bundles, allClientBundles] = await Promise.all([
      prisma.bundle.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true, tagline: true, description: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.clientBundle.findMany({
        where: { isActive: true },
        include: {
          client: {
            select: {
              name: true,
              tier: true,
              industry: true,
              clientType: true,
              isFeatured: true,
              logoUrl: true,
            },
          },
        },
      }),
    ]);

    const mappedClientType = clientTypeMap[partnerType];
    const similarClients = mappedClientType
      ? allClientBundles.filter((cb) => cb.client.clientType === mappedClientType)
      : allClientBundles;

    // ── Call Groq ──
    const { result: groqResult, metadata } = await groqService.generateRecommendation(
      { partnerType, products, volume, goal, distribution },
      { bundles, similarClients },
    );

    // ── Compute revenue ──
    const revenue = calculateRevenue(
      partnerType,
      volume,
      1200,
      groqResult.projectedAnnualRevenue,
    );

    // ── Find matched bundle & build socialProof ──
    const matchedBundle = bundles.find(
      (b) =>
        b.name.toLowerCase() === groqResult.bundleName.toLowerCase() ||
        groqResult.bundleName.toLowerCase().includes(b.name.toLowerCase()) ||
        b.name.toLowerCase().includes(groqResult.bundleName.toLowerCase()),
    );

    const bundleClientBundles = matchedBundle
      ? allClientBundles.filter((cb) => cb.bundleId === matchedBundle.id)
      : [];

    const totalClients = bundleClientBundles.length;
    const totalMonthlyUnits = bundleClientBundles.reduce(
      (sum, cb) => sum + (cb.monthlyUnits ?? 0),
      0,
    );
    const displayStat = formatDisplayStat(totalClients, totalMonthlyUnits);

    const topClients = bundleClientBundles
      .filter((cb) => cb.client.isFeatured)
      .sort((a, b) => (b.monthlyUnits ?? 0) - (a.monthlyUnits ?? 0))
      .slice(0, 3)
      .map((cb) => ({
        name: cb.client.name,
        logoUrl: cb.client.logoUrl,
        tier: cb.client.tier,
        monthlyUnits: cb.monthlyUnits,
        testimonial: cb.testimonial,
      }));

    const socialProof = { totalClients, totalMonthlyUnits, displayStat, topClients };

    // ── Save recommendation ──
    await prisma.recommendation.upsert({
      where: { sessionId: session.id },
      create: {
        sessionId: session.id,
        inputClientType: mappedClientType ?? null,
        inputGadgets: (products as string[])
          .map((p: string) => gadgetCategoryMap[p])
          .filter(Boolean),
        inputVolume: volumeMap[volume] ?? null,
        inputGoal: goalMap[goal] ?? null,
        inputDistribution: distributionMap[distribution] ?? null,
        recommendedBundleId: matchedBundle?.id ?? null,
        bundleName: groqResult.bundleName,
        aiResponseRaw: JSON.stringify(groqResult),
        whyThisCombo: groqResult.reasons,
        objectionHandler: groqResult.objectionHandle,
        similarClients: groqResult.similarClients,
        projectedAnnualRevenue: revenue.projectedAnnualRevenue,
        tokensUsed: metadata.tokensUsed,
        modelUsed: metadata.modelUsed,
        generationMs: metadata.generationMs,
        fromCache: false,
      },
      update: {
        inputClientType: mappedClientType ?? null,
        inputGadgets: (products as string[])
          .map((p: string) => gadgetCategoryMap[p])
          .filter(Boolean),
        inputVolume: volumeMap[volume] ?? null,
        inputGoal: goalMap[goal] ?? null,
        inputDistribution: distributionMap[distribution] ?? null,
        recommendedBundleId: matchedBundle?.id ?? null,
        bundleName: groqResult.bundleName,
        aiResponseRaw: JSON.stringify(groqResult),
        whyThisCombo: groqResult.reasons,
        objectionHandler: groqResult.objectionHandle,
        similarClients: groqResult.similarClients,
        projectedAnnualRevenue: revenue.projectedAnnualRevenue,
        tokensUsed: metadata.tokensUsed,
        modelUsed: metadata.modelUsed,
        generationMs: metadata.generationMs,
        fromCache: false,
      },
    });

    res.json({
      success: true,
      data: {
        sessionToken: returnedToken,
        recommendation: groqResult,
        socialProof,
        revenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { sessionToken, feedbackRating, feedbackNote } = req.body;

    if (!sessionToken || !feedbackRating) {
      res.status(400).json({ success: false, error: 'sessionToken and feedbackRating are required' });
      return;
    }

    const recommendation = await prisma.recommendation.findUnique({
      where: { sessionId: sessionToken },
    });

    if (!recommendation) {
      res.status(404).json({ success: false, error: 'Recommendation not found' });
      return;
    }

    await prisma.recommendation.update({
      where: { sessionId: sessionToken },
      data: { feedbackRating, feedbackNote: feedbackNote ?? null },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
