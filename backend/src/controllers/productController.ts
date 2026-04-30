import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const shapeProduct = (
  product: Awaited<ReturnType<typeof prisma.product.findMany>>[number] & {
    bundleProducts: {
      bundleId: string;
      isAnchor: boolean;
      bundle: { id: string; name: string; slug: string };
    }[];
  },
) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  category: product.category,
  tagline: product.tagline,
  description: product.description,
  iconEmoji: product.iconEmoji,
  basePrice: product.basePrice,
  claimFrequency: product.claimFrequency,
  avgClaimCost: product.avgClaimCost,
  coverageItems: product.coverageItems,
  applicableGadgets: product.applicableGadgets,
  bundles: product.bundleProducts.map((bp) => ({
    bundleId: bp.bundleId,
    bundleName: bp.bundle.name,
    bundleSlug: bp.bundle.slug,
    isAnchor: bp.isAnchor,
  })),
});

const bundleProductInclude = {
  bundleProducts: {
    include: {
      bundle: { select: { id: true, name: true, slug: true } },
    },
  },
} as const;

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: bundleProductInclude,
    });

    const data = products.map(shapeProduct);
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: bundleProductInclude,
    });

    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    res.json({ success: true, data: shapeProduct(product) });
  } catch (error) {
    next(error);
  }
};
