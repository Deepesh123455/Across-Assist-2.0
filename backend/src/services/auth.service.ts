import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';
import { AppError } from '../middlewares/errorHandler';

function mapClientType(str?: string): any {
  if (!str) return undefined;
  const map: Record<string, string> = {
    'OEM/Brand': 'OEM',
    'NBFC/Fintech': 'NBFC',
    Retailer: 'RETAILER',
    Marketplace: 'MARKETPLACE',
    Telecom: 'TELECOM',
  };
  return map[str] ?? undefined;
}

interface RegisterData {
  name: string;
  email: string;
  companyName: string;
  phone?: string;
  password: string;
  sessionToken?: string;
  clientType?: string;
}

interface MergeResult {
  sessionToken: string | null;
  recommendation: Record<string, unknown> | null;
  formData: Record<string, unknown> | null;
}

export class AuthService {
  async register(data: RegisterData) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new AppError('An account with this email already exists', StatusCodes.CONFLICT);

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        phone: data.phone,
        passwordHash,
        role: 'CLIENT' as any,
        isVerified: false,
        isActive: true,
        onboardingDone: false,
        clientType: mapClientType(data.clientType),
        lastLoginAt: new Date(),
      },
    });

    const mergeResult = await this.mergeSession(user.id, user.email, data.sessionToken);

    if (mergeResult.sessionToken) {
      const linked = await prisma.session.findUnique({
        where: { sessionToken: mergeResult.sessionToken },
        select: { id: true },
      });
      if (linked) {
        await prisma.user.update({ where: { id: user.id }, data: { primarySessionId: linked.id } });
      }
    }

    const tokens = this.generateTokens(user.id, user.email, String(user.role));

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        companyName: user.companyName,
        phone: user.phone,
        role: user.role,
        clientType: user.clientType,
        createdAt: user.createdAt,
      },
      tokens,
      sessionData: {
        sessionToken: mergeResult.sessionToken ?? data.sessionToken ?? null,
        recommendation: mergeResult.recommendation,
        formData: mergeResult.formData,
      },
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        primarySession: {
          include: {
            recommendation: true,
            chatMessages: { orderBy: { messageIndex: 'asc' }, take: 50 },
          },
        },
      },
    });
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        companyName: user.companyName,
        phone: user.phone,
        role: user.role,
        clientType: user.clientType,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        onboardingDone: user.onboardingDone,
      },
      sessionToken: user.primarySession?.sessionToken ?? null,
      recommendation: this.extractRecommendation(user.primarySession?.recommendation ?? null),
      formData: (user.primarySession?.formData as Record<string, unknown> | null) ?? null,
      chatCount: user.primarySession?.chatMessages?.length ?? 0,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; email: string };
      const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { role: true } });
      return { tokens: this.generateTokens(payload.id, payload.email, String(user?.role ?? 'CLIENT')) };
    } catch {
      throw new AppError('Invalid refresh token', StatusCodes.UNAUTHORIZED);
    }
  }

  private async mergeSession(userId: string, email: string, sessionToken?: string): Promise<MergeResult> {
    let session: any = null;

    if (sessionToken) {
      session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { recommendation: true },
      });
    }

    if (!session) {
      session = await prisma.session.findFirst({
        where: { email, isConverted: false, status: { not: 'COMPLETED' as any } },
        include: { recommendation: true },
        orderBy: { updatedAt: 'desc' },
      });
    }

    if (!session) return { sessionToken: null, recommendation: null, formData: null };

    await prisma.session.update({
      where: { id: session.id },
      data: { userId, isConverted: true, status: 'COMPLETED' as any, followUpSent: true },
    });

    return {
      sessionToken: session.sessionToken as string,
      recommendation: this.extractRecommendation(session.recommendation),
      formData: (session.formData as Record<string, unknown> | null) ?? null,
    };
  }

  private extractRecommendation(rec: any): Record<string, unknown> | null {
    if (!rec) return null;
    const whyThisCombo = Array.isArray(rec.whyThisCombo) ? rec.whyThisCombo : [];
    const similarClients = Array.isArray(rec.similarClients) ? rec.similarClients : [];
    return {
      bundleName: rec.bundleName ?? '',
      products: whyThisCombo,
      reasons: whyThisCombo,
      whyThisCombo,
      projectedAnnualRevenue: Number(rec.projectedAnnualRevenue ?? 0),
      similarClients,
      objectionHandle: rec.objectionHandler ?? '',
      objectionHandler: rec.objectionHandler ?? '',
      attachmentRate: rec.attachmentRate ?? 0.3,
      recommendedPlanValue: rec.recommendedPlanValue ?? 1200,
    };
  }

  private generateTokens(id: string, email: string, role: string) {
    const accessToken = jwt.sign({ id, email, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
    const refreshToken = jwt.sign({ id, email }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });
    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
