import { NextFunction, Request, Response } from 'express';
import { ClientTier, ClientType } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const getClients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, tier, featured } = req.query;

    const where: {
      isActive: boolean;
      clientType?: ClientType;
      tier?: ClientTier;
      isFeatured?: boolean;
    } = { isActive: true };

    if (type) where.clientType = type as ClientType;
    if (tier) where.tier = tier as ClientTier;
    if (featured === 'true') where.isFeatured = true;

    const clients = await prisma.client.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        clientBundles: {
          where: { isActive: true },
          include: {
            bundle: { select: { name: true } },
          },
        },
      },
    });

    const data = clients.map((client) => ({
      id: client.id,
      name: client.name,
      slug: client.slug,
      logoUrl: client.logoUrl,
      website: client.website,
      clientType: client.clientType,
      industry: client.industry,
      tier: client.tier,
      city: client.city,
      state: client.state,
      partnershipSince: client.partnershipSince,
      monthlyVolume: client.monthlyVolume,
      isFeatured: client.isFeatured,
      description: client.description,
      clientBundles: client.clientBundles.map((cb) => ({
        bundleId: cb.bundleId,
        bundleName: cb.bundle.name,
        monthlyUnits: cb.monthlyUnits,
        attachmentRate: cb.attachmentRate,
        testimonial: cb.testimonial,
        startedAt: cb.startedAt,
      })),
    }));

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

export const getClientBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params;

    const client = await prisma.client.findUnique({
      where: { slug },
      include: {
        clientBundles: {
          include: {
            bundle: {
              select: { name: true, tagline: true, averagePlanValue: true },
            },
          },
        },
      },
    });

    if (!client) {
      res.status(404).json({ success: false, error: 'Client not found' });
      return;
    }

    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};
