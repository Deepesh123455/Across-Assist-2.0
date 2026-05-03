import { NextFunction, Request, Response } from 'express';
import { ClientTier } from '@prisma/client';
import { prisma } from '../lib/prisma';

// ─── displayStat helper ───────────────────────────────────────────────────────

function formatUnits(units: number): string {
  if (units >= 100000) return `${(units / 100000).toFixed(2)}L units/month`;
  if (units >= 1000) return `${(units / 1000).toFixed(1)}K units/month`;
  return `${units} units/month`;
}

type ClientBundleWithClient = {
  monthlyUnits: number | null;
  testimonial: string | null;
  attachmentRate: unknown;
  revenueGenerated: unknown;
  client: {
    name: string;
    logoUrl: string | null;
    tier: ClientTier;
    isFeatured: boolean;
    city?: string | null;
    industry?: string | null;
  };
};

function computeSocialProof(clientBundles: ClientBundleWithClient[]) {
  const totalClients = clientBundles.length;
  const totalMonthlyUnits = clientBundles.reduce((sum, cb) => sum + (cb.monthlyUnits ?? 0), 0);
  const displayStat = `${totalClients} ${totalClients === 1 ? 'company' : 'companies'} · ${formatUnits(totalMonthlyUnits)}`;

  const topClients = clientBundles
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

  return { totalClients, totalMonthlyUnits, displayStat, topClients };
}

// ─── Shared Prisma include shapes ────────────────────────────────────────────

const bundleProductsInclude = {
  bundleProducts: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          category: true,
          iconEmoji: true,
          tagline: true,
        },
      },
    },
  },
} as const;

const clientBundlesListInclude = {
  clientBundles: {
    where: { isActive: true as const },
    include: {
      client: {
        select: {
          name: true,
          logoUrl: true,
          tier: true,
          isFeatured: true,
        },
      },
    },
  },
} as const;

const clientBundlesDetailInclude = {
  clientBundles: {
    where: { isActive: true as const },
    include: {
      client: {
        select: {
          name: true,
          logoUrl: true,
          tier: true,
          isFeatured: true,
          city: true,
          industry: true,
        },
      },
    },
  },
} as const;

// ─── Shape helpers ────────────────────────────────────────────────────────────

function shapeProducts(
  bundleProducts: {
    isAnchor: boolean;
    product: {
      id: string;
      name: string;
      category: string;
      iconEmoji: string | null;
      tagline: string | null;
    };
  }[],
) {
  return bundleProducts.map((bp) => ({
    id: bp.product.id,
    name: bp.product.name,
    category: bp.product.category,
    iconEmoji: bp.product.iconEmoji,
    tagline: bp.product.tagline,
    isAnchor: bp.isAnchor,
  }));
}

function shapeBundleCore(bundle: {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  targetClientType: unknown;
  targetGadgets: unknown;
  targetDistribution: unknown;
  targetGoal: unknown;
  averagePlanValue: unknown;
  attachmentRateBench: unknown;
  oemRevenueShare: unknown;
  retailerRevenueShare: unknown;
  nbfcRevenueShare: unknown;
  acrossAssistShare: unknown;
  whyThisBundle: unknown;
  objectionHandler: string;
  performanceData: unknown;
  isPopular: boolean;
  isActive: boolean;
}) {
  return {
    id: bundle.id,
    name: bundle.name,
    slug: bundle.slug,
    tagline: bundle.tagline,
    description: bundle.description,
    targetClientType: bundle.targetClientType,
    targetGadgets: bundle.targetGadgets,
    targetDistribution: bundle.targetDistribution,
    targetGoal: bundle.targetGoal,
    averagePlanValue: bundle.averagePlanValue,
    attachmentRateBench: bundle.attachmentRateBench,
    oemRevenueShare: bundle.oemRevenueShare,
    retailerRevenueShare: bundle.retailerRevenueShare,
    nbfcRevenueShare: bundle.nbfcRevenueShare,
    acrossAssistShare: bundle.acrossAssistShare,
    whyThisBundle: bundle.whyThisBundle,
    objectionHandler: bundle.objectionHandler,
    performanceData: bundle.performanceData,
    isPopular: bundle.isPopular,
    isActive: bundle.isActive,
  };
}

// ─── Controllers ─────────────────────────────────────────────────────────────

export const getBundles = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const bundles = await prisma.bundle.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        ...bundleProductsInclude,
        ...clientBundlesListInclude,
      },
    });

    const data = bundles.map((bundle) => ({
      ...shapeBundleCore(bundle),
      products: shapeProducts(bundle.bundleProducts),
      socialProof: computeSocialProof(bundle.clientBundles),
    }));

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

export const getBundleBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;

    const bundle = await prisma.bundle.findUnique({
      where: { slug },
      include: {
        ...bundleProductsInclude,
        ...clientBundlesDetailInclude,
      },
    });

    if (!bundle) {
      res.status(404).json({ success: false, error: 'Bundle not found' });
      return;
    }

    const data = {
      ...shapeBundleCore(bundle),
      products: shapeProducts(bundle.bundleProducts),
      socialProof: computeSocialProof(bundle.clientBundles),
      clientBundles: bundle.clientBundles.map((cb) => ({
        clientId: cb.clientId,
        name: cb.client.name,
        logoUrl: cb.client.logoUrl,
        tier: cb.client.tier,
        city: cb.client.city,
        industry: cb.client.industry,
        testimonial: cb.testimonial,
        monthlyUnits: cb.monthlyUnits,
        attachmentRate: cb.attachmentRate,
        revenueGenerated: cb.revenueGenerated,
      })),
    };

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
export const getMyBundle = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        primarySession: {
          include: {
            recommendation: true,
          },
        },
      },
    });

    if (!user?.primarySession?.recommendation?.recommendedBundleId) {
      res.status(404).json({ success: false, error: 'No recommendation found for this user' });
      return;
    }

    const bundleId = user.primarySession.recommendation.recommendedBundleId;

    const bundle = await prisma.bundle.findUnique({
      where: { id: bundleId },
      include: {
        ...bundleProductsInclude,
        ...clientBundlesDetailInclude,
      },
    });

    if (!bundle) {
      res.status(404).json({ success: false, error: 'Bundle not found' });
      return;
    }

    const data = {
      ...shapeBundleCore(bundle),
      products: shapeProducts(bundle.bundleProducts),
      socialProof: computeSocialProof(bundle.clientBundles),
      recommendation: user.primarySession.recommendation, // Include raw recommendation for metrics
      clientBundles: bundle.clientBundles.map((cb) => ({
        clientId: cb.clientId,
        name: cb.client.name,
        logoUrl: cb.client.logoUrl,
        tier: cb.client.tier,
        city: cb.client.city,
        industry: cb.client.industry,
        testimonial: cb.testimonial,
        monthlyUnits: cb.monthlyUnits,
        attachmentRate: cb.attachmentRate,
        revenueGenerated: cb.revenueGenerated,
      })),
    };

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
