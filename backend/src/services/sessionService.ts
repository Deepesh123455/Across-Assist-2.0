import { randomUUID } from 'crypto';
import { Prisma, SessionStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

export class SessionService {
  async createSession(ipAddress?: string, userAgent?: string) {
    const session = await prisma.session.create({
      data: {
        sessionToken: randomUUID(),
        currentStep: 1,
        status: SessionStatus.ACTIVE,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      },
    });
    return session;
  }

  async updateStep(sessionToken: string, currentStep: number, formData: any) {
    const existingSession = await prisma.session.findUnique({
      where: { sessionToken },
    });

    if (!existingSession) throw new Error('Session not found');

    const mergedFormData = {
      ...(existingSession.formData as Record<string, unknown> || {}),
      ...formData
    };

    return prisma.session.update({
      where: { sessionToken },
      data: {
        currentStep,
        formData: mergedFormData as Prisma.InputJsonValue
      },
    });
  }

  async captureEmail(sessionToken: string, email: string) {
    const session = await prisma.session.update({
      where: { sessionToken },
      data: { email },
    });

    await prisma.analyticsEvent.create({
      data: {
        sessionId: session.id,
        event: 'EMAIL_CAPTURED',
        properties: { email } as Prisma.InputJsonValue,
      },
    });

    return session;
  }

  async markSessionInactive(sessionToken: string) {
    return prisma.session.update({
      where: { sessionToken },
      data: {
        status: SessionStatus.ABANDONED,
        abandonedAt: new Date(),
      },
    });
  }

  async getSessionByResumeToken(resumeToken: string) {
    const abandonedEmail = await prisma.abandonedSessionEmail.findUnique({
      where: { resumeToken },
      include: {
        session: {
          include: {
            chatMessages: { orderBy: { messageIndex: 'asc' } },
            recommendation: true,
          },
        },
      },
    });

    if (!abandonedEmail || !abandonedEmail.session) {
      throw new Error('Invalid or expired resume token');
    }

    if (abandonedEmail.tokenExpiresAt && abandonedEmail.tokenExpiresAt < new Date()) {
      throw new Error('Resume link expired');
    }

    const session = abandonedEmail.session;

    await Promise.all([
      prisma.abandonedSessionEmail.update({
        where: { id: abandonedEmail.id },
        data: { tokenUsedAt: new Date(), clickedAt: new Date() },
      }),
      prisma.session.update({
        where: { id: session.id },
        data: {
          status: SessionStatus.RECOVERED,
          recoveredAt: new Date(),
          followUpClicked: true,
        },
      }),
    ]);

    let recommendation: Record<string, unknown> | null = null;
    if (session.recommendation) {
      try {
        const raw = JSON.parse(session.recommendation.aiResponseRaw) as Record<string, unknown>;
        recommendation = {
          ...raw,
          projectedAnnualRevenue: Number(session.recommendation.projectedAnnualRevenue ?? raw.projectedAnnualRevenue ?? 0),
        };
      } catch {
        recommendation = {
          bundleName: session.recommendation.bundleName,
          products: [],
          projectedAnnualRevenue: Number(session.recommendation.projectedAnnualRevenue ?? 0),
          reasons: (session.recommendation.whyThisCombo as string[]) ?? [],
          similarClients: (session.recommendation.similarClients as string[]) ?? [],
          objectionHandle: session.recommendation.objectionHandler ?? '',
        };
      }
    }

    return {
      sessionToken: session.sessionToken,
      currentStep: session.currentStep,
      formData: session.formData,
      email: session.email,
      name: session.name,
      companyName: session.companyName,
      chatMessages: session.chatMessages.map((m) => ({
        role: m.role,
        content: m.content,
        messageIndex: m.messageIndex,
      })),
      recommendation,
    };
  }
}

export const sessionService = new SessionService();
