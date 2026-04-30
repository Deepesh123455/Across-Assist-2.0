import cron from 'node-cron';
import { randomBytes } from 'crypto';
import { EmailType, SessionStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { sendAbandonmentEmail } from '../services/emailService';
import { env } from '../config/env';

const WARN_THRESHOLD = 50;

function generateResumeToken(): string {
  return randomBytes(32).toString('hex');
}

function buildResumeUrl(token: string): string {
  return `${env.FRONTEND_URL}/resume?token=${token}`;
}

// ─── Job 1: Detect newly abandoned sessions — runs every 15 minutes ───────────

async function runJob1() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const sessions = await prisma.session.findMany({
    where: {
      status: { in: [SessionStatus.ACTIVE, SessionStatus.ABANDONED] },
      email: { not: null },
      updatedAt: { lt: thirtyMinutesAgo },
      followUpSent: false,
    },
  });

  if (sessions.length > WARN_THRESHOLD) {
    console.warn(`[Cron Job1] WARNING: Processing ${sessions.length} sessions — approaching Resend free tier limit`);
  }

  for (const session of sessions) {
    try {
      const resumeToken = generateResumeToken();
      const resumeUrl = buildResumeUrl(resumeToken);
      const formData = session.formData as { clientType?: string; gadgetCategories?: string[] } | null;

      const ase = await prisma.abandonedSessionEmail.create({
        data: {
          sessionId: session.id,
          email: session.email!,
          emailType: EmailType.STEP_ABANDONED,
          resumeToken,
          tokenExpiresAt: sevenDaysLater,
          sentAt: new Date(),
        },
      });

      await sendAbandonmentEmail(
        session.email!,
        {
          name: session.name ?? 'there',
          companyName: session.companyName ?? 'your company',
          step: session.currentStep,
          resumeUrl,
          partnerType: formData?.clientType,
          gadgets: formData?.gadgetCategories,
        },
        'STEP_ABANDONED',
        resumeToken,
        session.id,
        ase.id,
      );

      await prisma.session.update({
        where: { id: session.id },
        data: {
          status: SessionStatus.ABANDONED,
          abandonedAt: session.abandonedAt ?? new Date(),
          followUpSent: true,
          followUpSentAt: new Date(),
        },
      });

      console.log(`[Cron Job1] Abandonment email sent to ${session.email}`);
    } catch (err) {
      console.error(`[Cron Job1] Failed for session ${session.id}:`, err);
    }
  }
}

// ─── Job 2: Send reminder 2 (24h after Email 1) — runs every hour ────────────

async function runJob2() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const alreadySentR2 = await prisma.abandonedSessionEmail.findMany({
    where: { emailType: EmailType.REMINDER_2 },
    select: { sessionId: true },
  });
  const alreadySentIds = alreadySentR2.map((r) => r.sessionId);

  const records = await prisma.abandonedSessionEmail.findMany({
    where: {
      emailType: EmailType.STEP_ABANDONED,
      sentAt: { lt: twentyFourHoursAgo },
      ...(alreadySentIds.length > 0 ? { sessionId: { notIn: alreadySentIds } } : {}),
    },
  });

  if (records.length > WARN_THRESHOLD) {
    console.warn(`[Cron Job2] WARNING: Processing ${records.length} records — approaching Resend free tier limit`);
  }

  for (const record of records) {
    try {
      const session = await prisma.session.findUnique({ where: { id: record.sessionId } });
      if (!session) continue;
      if (session.isConverted || session.status === SessionStatus.RECOVERED) continue;

      const resumeToken = generateResumeToken();
      const resumeUrl = buildResumeUrl(resumeToken);
      const formData = session.formData as { clientType?: string } | null;

      const ase = await prisma.abandonedSessionEmail.create({
        data: {
          sessionId: record.sessionId,
          email: record.email,
          emailType: EmailType.REMINDER_2,
          resumeToken,
          tokenExpiresAt: sevenDaysLater,
          sentAt: new Date(),
        },
      });

      await sendAbandonmentEmail(
        record.email,
        {
          name: session.name ?? 'there',
          companyName: session.companyName ?? 'your company',
          resumeUrl,
          partnerType: formData?.clientType,
          socialProofStat: '33 companies · 25L+ units/month protected',
        },
        'REMINDER_2',
        resumeToken,
        record.sessionId,
        ase.id,
      );

      console.log(`[Cron Job2] Reminder 2 sent to ${record.email}`);
    } catch (err) {
      console.error(`[Cron Job2] Failed for session ${record.sessionId}:`, err);
    }
  }
}

// ─── Job 3: Send reminder 3 (72h after Email 2) — runs every hour ────────────

async function runJob3() {
  const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
  const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const alreadySentR3 = await prisma.abandonedSessionEmail.findMany({
    where: { emailType: EmailType.REMINDER_3 },
    select: { sessionId: true },
  });
  const alreadySentIds = alreadySentR3.map((r) => r.sessionId);

  const records = await prisma.abandonedSessionEmail.findMany({
    where: {
      emailType: EmailType.REMINDER_2,
      sentAt: { lt: seventyTwoHoursAgo },
      ...(alreadySentIds.length > 0 ? { sessionId: { notIn: alreadySentIds } } : {}),
    },
  });

  if (records.length > WARN_THRESHOLD) {
    console.warn(`[Cron Job3] WARNING: Processing ${records.length} records — approaching Resend free tier limit`);
  }

  for (const record of records) {
    try {
      const session = await prisma.session.findUnique({ where: { id: record.sessionId } });
      if (!session) continue;
      if (session.isConverted || session.status === SessionStatus.RECOVERED) continue;

      const resumeToken = generateResumeToken();
      const resumeUrl = buildResumeUrl(resumeToken);
      const formData = session.formData as { clientType?: string } | null;

      const ase = await prisma.abandonedSessionEmail.create({
        data: {
          sessionId: record.sessionId,
          email: record.email,
          emailType: EmailType.REMINDER_3,
          resumeToken,
          tokenExpiresAt: sevenDaysLater,
          sentAt: new Date(),
        },
      });

      await sendAbandonmentEmail(
        record.email,
        {
          name: session.name ?? 'there',
          companyName: session.companyName ?? 'your company',
          resumeUrl,
          partnerType: formData?.clientType,
        },
        'REMINDER_3',
        resumeToken,
        record.sessionId,
        ase.id,
      );

      console.log(`[Cron Job3] Reminder 3 sent to ${record.email}`);
    } catch (err) {
      console.error(`[Cron Job3] Failed for session ${record.sessionId}:`, err);
    }
  }
}

// ─── Register all three jobs ──────────────────────────────────────────────────

export function startAbandonmentCron(): void {
  cron.schedule('*/15 * * * *', async () => {
    try { await runJob1(); } catch (err) { console.error('[Cron Job1] Uncaught error:', err); }
  });

  cron.schedule('0 * * * *', async () => {
    try { await runJob2(); } catch (err) { console.error('[Cron Job2] Uncaught error:', err); }
  });

  cron.schedule('0 * * * *', async () => {
    try { await runJob3(); } catch (err) { console.error('[Cron Job3] Uncaught error:', err); }
  });
}
