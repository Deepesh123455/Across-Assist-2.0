import nodemailer from 'nodemailer';
import { EmailType } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

const FROM = `Across Assist <${env.EMAIL_FROM}>`;

// ─── Shared layout helpers ────────────────────────────────────────────────────

const header = () => `
  <div style="background:#1A56DB;padding:24px 32px;text-align:center;">
    <div style="color:#fff;font-family:system-ui,-apple-system,sans-serif;font-size:20px;font-weight:800;letter-spacing:3px;">ACROSS ASSIST</div>
    <div style="color:rgba(255,255,255,0.75);font-size:12px;margin-top:4px;letter-spacing:1px;">Trust | Care | Protect</div>
  </div>`;

const footer = () => `
  <div style="padding:24px 32px;text-align:center;border-top:1px solid #E2E8F0;margin-top:32px;">
    <p style="color:#94A3B8;font-size:12px;margin:0 0 8px;">You're receiving this because you started a bundle recommendation on acrossassist.com.</p>
    <p style="color:#CBD5E1;font-size:11px;margin:0;">If you no longer wish to receive these emails, you can ignore this message.</p>
  </div>`;

const wrap = (content: string) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8FAFF;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFF;padding:32px 16px;">
    <tr><td align="center">
      <div style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;">
        ${header()}
        <div style="padding:32px;">
          ${content}
        </div>
        ${footer()}
      </div>
    </td></tr>
  </table>
</body>
</html>`;

const ctaButton = (label: string, href: string) =>
  `<div style="text-align:center;margin:28px 0 12px;">
    <a href="${href}" style="display:inline-block;background:#F97316;color:#fff;padding:16px 32px;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none;">${label}</a>
  </div>`;

const progressBar = (filled: number, total = 5) => {
  const segs = Array.from({ length: total }, (_, i) =>
    `<div style="flex:1;height:8px;border-radius:4px;background:${i < filled ? '#1A56DB' : '#E2E8F0'};${i > 0 ? 'margin-left:4px;' : ''}"></div>`
  ).join('');
  return `<div style="display:flex;gap:0;margin:16px 0;">${segs}</div>`;
};

// ─── Template 1 — Step Abandoned ─────────────────────────────────────────────

interface StepAbandonedData {
  name: string;
  companyName: string;
  step: number;
  resumeUrl: string;
  partnerType?: string;
  gadgets?: string[];
  openTrackingUrl?: string;
}

function buildStepAbandonedEmail(data: StepAbandonedData): { subject: string; html: string } {
  const completed = Math.max(0, data.step - 1);
  const progressFill = progressBar(completed);

  const contextCard = (data.partnerType || (data.gadgets && data.gadgets.length > 0))
    ? `<div style="background:#F8FAFF;border:1px solid #E2E8F0;border-radius:8px;padding:16px;margin:20px 0;font-size:13px;color:#64748B;">
        ${data.partnerType ? `<div><strong style="color:#0F172A;">Partner type:</strong> ${data.partnerType}</div>` : ''}
        ${data.gadgets?.length ? `<div style="margin-top:6px;"><strong style="color:#0F172A;">Categories:</strong> ${data.gadgets.join(', ')}</div>` : ''}
      </div>`
    : '';

  const tracking = data.openTrackingUrl
    ? `<img src="${data.openTrackingUrl}" width="1" height="1" style="display:none;" alt="" />`
    : '';

  const content = `
    <h1 style="font-size:24px;font-weight:800;color:#0F172A;margin:0 0 12px;">You were so close, ${data.name}</h1>
    <p style="color:#64748B;font-size:15px;margin:0 0 8px;">You completed <strong>${completed} of 5 steps</strong>. Your progress is saved — pick up exactly where you left off.</p>
    ${progressFill}
    ${contextCard}
    ${ctaButton('Resume My Recommendation →', data.resumeUrl)}
    <p style="text-align:center;color:#94A3B8;font-size:13px;margin-top:8px;">Takes less than 2 minutes to complete</p>
    ${tracking}`;

  return {
    subject: `Your Across Assist bundle recommendation is saved, ${data.name} 🔐`,
    html: wrap(content),
  };
}

// ─── Template 2 — Reminder 2 ─────────────────────────────────────────────────

interface Reminder2Data {
  name: string;
  companyName: string;
  resumeUrl: string;
  partnerType?: string;
  socialProofStat?: string;
  openTrackingUrl?: string;
}

function buildReminder2Email(data: Reminder2Data): { subject: string; html: string } {
  const socialBlock = data.socialProofStat
    ? `<div style="background:#F8FAFF;border:1px solid #E2E8F0;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
        <div style="font-size:18px;font-weight:800;color:#1A56DB;margin-bottom:6px;">${data.socialProofStat}</div>
        <div style="font-size:13px;color:#64748B;">Your recommended bundle is already working for similar partners</div>
      </div>`
    : '';

  const pills = [
    '₹9 Cr+ partner revenue generated',
    '33 institutional clients',
    '28–45% avg attachment rate',
  ].map(
    (s) =>
      `<div style="flex:1;min-width:140px;background:#F8FAFF;border:1px solid #E2E8F0;border-radius:8px;padding:12px 8px;text-align:center;font-size:12px;font-weight:700;color:#0F172A;">${s}</div>`,
  ).join('');

  const tracking = data.openTrackingUrl
    ? `<img src="${data.openTrackingUrl}" width="1" height="1" style="display:none;" alt="" />`
    : '';

  const content = `
    <h1 style="font-size:24px;font-weight:800;color:#0F172A;margin:0 0 12px;">Still thinking it over, ${data.name}?</h1>
    ${socialBlock}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin:16px 0;">${pills}</div>
    <p style="color:#64748B;font-size:15px;margin:16px 0;">Your personalized bundle recommendation is still saved. Most partners who complete the form are surprised by the revenue projection.</p>
    ${ctaButton('See My Revenue Projection →', data.resumeUrl)}
    <p style="text-align:center;color:#94A3B8;font-size:13px;margin-top:8px;">Your saved session expires in 5 days</p>
    ${tracking}`;

  return {
    subject: `Companies like yours are already earning with Across Assist, ${data.name}`,
    html: wrap(content),
  };
}

// ─── Template 3 — Reminder 3 (personal-style) ────────────────────────────────

interface Reminder3Data {
  name: string;
  companyName: string;
  resumeUrl: string;
  partnerType?: string;
  openTrackingUrl?: string;
}

function buildReminder3Email(data: Reminder3Data): { subject: string; html: string } {
  const mailtoHref = `mailto:deepesh.thakur@invisiblecto.ai?subject=Partnership%20Enquiry%20from%20${encodeURIComponent(data.companyName)}`;

  const tracking = data.openTrackingUrl
    ? `<img src="${data.openTrackingUrl}" width="1" height="1" style="display:none;" alt="" />`
    : '';

  const content = `
    <p style="font-size:16px;color:#0F172A;margin:0 0 16px;">Hi ${data.name},</p>
    <p style="color:#64748B;font-size:15px;line-height:1.7;margin:0 0 16px;">I noticed you started exploring Across Assist's bundle recommendation for <strong>${data.companyName}</strong> but didn't get a chance to finish.</p>
    <p style="color:#64748B;font-size:15px;line-height:1.7;margin:0 0 28px;">Was there something specific that wasn't clear, or would it help to speak with someone on our team directly?</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin:0 0 32px;">
      <a href="${data.resumeUrl}" style="display:inline-block;background:#F97316;color:#fff;padding:14px 24px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;">Complete My Recommendation →</a>
      <a href="${mailtoHref}" style="display:inline-block;background:#fff;color:#1A56DB;border:2px solid #1A56DB;padding:14px 24px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;">Talk to the Team →</a>
    </div>
    <p style="color:#64748B;font-size:14px;margin:0;">Warm regards,<br><strong style="color:#0F172A;">Deepesh Thakur</strong><br>Across Assist Partnerships</p>
    ${tracking}`;

  return {
    subject: `Quick question, ${data.name} — was something missing?`,
    html: wrap(content),
  };
}

// ─── Welcome Email ────────────────────────────────────────────────────────────

function buildWelcomeEmail(name: string, companyName: string): { subject: string; html: string } {
  const bullets = [
    'Our team will review your bundle recommendation and reach out within 24 hours',
    'You can explore your dashboard and track your onboarding progress',
    'Your AI recommendation and revenue projection are saved and ready to share',
  ].map((b) => `<li style="color:#64748B;font-size:14px;line-height:1.7;margin-bottom:8px;">${b}</li>`).join('');

  const content = `
    <h1 style="font-size:24px;font-weight:800;color:#0F172A;margin:0 0 8px;">Welcome to Across Assist, ${name}! 🎉</h1>
    <p style="color:#64748B;font-size:15px;margin:0 0 24px;">Your partnership journey starts here, ${companyName}.</p>
    <div style="background:#F8FAFF;border:1px solid #E2E8F0;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="font-weight:700;color:#0F172A;font-size:14px;margin:0 0 12px;">What happens next:</p>
      <ul style="margin:0;padding-left:20px;">${bullets}</ul>
    </div>
    ${ctaButton('Go to My Dashboard →', `${env.FRONTEND_URL}/dashboard`)}`;

  return {
    subject: `Welcome to Across Assist, ${name} 🎉`,
    html: wrap(content),
  };
}

// ─── Main send methods ────────────────────────────────────────────────────────

type AbandonmentEmailType = 'STEP_ABANDONED' | 'REMINDER_2' | 'REMINDER_3';

export async function sendAbandonmentEmail(
  to: string,
  data: StepAbandonedData | Reminder2Data | Reminder3Data,
  emailType: AbandonmentEmailType,
  _resumeToken: string,
  _sessionId: string,
  abandonedEmailId: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const trackingBase = `${env.BACKEND_URL}/api/${process.env.API_VERSION ?? 'v1'}/track`;
  const openUrl = `${trackingBase}/email-open/${abandonedEmailId}`;
  const clickUrl = `${trackingBase}/email-click/${abandonedEmailId}`;

  let subject: string;
  let html: string;

  if (emailType === 'STEP_ABANDONED') {
    ({ subject, html } = buildStepAbandonedEmail({ ...(data as StepAbandonedData), openTrackingUrl: openUrl, resumeUrl: clickUrl }));
  } else if (emailType === 'REMINDER_2') {
    ({ subject, html } = buildReminder2Email({ ...(data as Reminder2Data), openTrackingUrl: openUrl, resumeUrl: clickUrl }));
  } else {
    ({ subject, html } = buildReminder3Email({ ...(data as Reminder3Data), openTrackingUrl: openUrl, resumeUrl: clickUrl }));
  }

  const prismaEmailType = emailType as unknown as EmailType;

  try {
    const info = await transporter.sendMail({ from: FROM, to, subject, html });
    const resendId = info.messageId ?? null;

    await prisma.emailLog.create({
      data: {
        toEmail: to,
        emailType: prismaEmailType,
        subject,
        status: 'DELIVERED',
        provider: 'resend',
        messageId: resendId ?? abandonedEmailId,
        sentAt: new Date(),
      },
    });

    return { success: true, messageId: resendId ?? undefined };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Email] Failed to send ${emailType} to ${to}:`, msg);

    await prisma.emailLog.create({
      data: {
        toEmail: to,
        emailType: prismaEmailType,
        subject,
        status: 'FAILED',
        provider: 'nodemailer',
        error: msg,
        sentAt: new Date(),
      },
    }).catch(() => {});

    return { success: false, error: msg };
  }
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
  companyName: string,
): Promise<{ success: boolean }> {
  const { subject, html } = buildWelcomeEmail(name, companyName);
  try {
    const info = await transporter.sendMail({ from: FROM, to, subject, html });
    await prisma.emailLog.create({
      data: {
        toEmail: to,
        emailType: EmailType.WELCOME,
        subject,
        status: 'DELIVERED',
        provider: 'nodemailer',
        messageId: info.messageId ?? null,
        sentAt: new Date(),
      },
    });
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Email] Failed to send welcome email:', msg);
    return { success: false };
  }
}

// ─── OTP Login Email ──────────────────────────────────────────────────────────

function buildOtpEmail(name: string, code: string): { subject: string; html: string } {
  const digits = code.split('').map(
    (d) =>
      `<span style="display:inline-block;width:48px;height:60px;line-height:60px;text-align:center;font-size:28px;font-weight:800;color:#0F172A;background:#F8FAFF;border:2px solid #E2E8F0;border-radius:10px;margin:0 4px;">${d}</span>`,
  ).join('');

  const content = `
    <h1 style="font-size:24px;font-weight:800;color:#0F172A;margin:0 0 8px;">Your sign-in code</h1>
    <p style="color:#64748B;font-size:15px;margin:0 0 32px;">Hi ${name}, use the code below to sign in to Across Assist. It expires in <strong>10 minutes</strong>.</p>
    <div style="text-align:center;margin:0 0 32px;">${digits}</div>
    <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
      <p style="color:#92400E;font-size:13px;margin:0;font-weight:600;">⚠️ Never share this code with anyone. Across Assist will never ask for it.</p>
    </div>
    <p style="color:#94A3B8;font-size:12px;margin:0;text-align:center;">If you didn't request this code, you can safely ignore this email.</p>`;

  return {
    subject: `${code} is your Across Assist sign-in code`,
    html: wrap(content),
  };
}

/**
 * Send a 6-digit OTP code to the user's email address.
 * Called by otp.service.ts during the sendOtp flow.
 */
export async function sendOtpEmail(
  to: string,
  code: string,
  name: string = 'there',
): Promise<{ success: boolean }> {
  const { subject, html } = buildOtpEmail(name, code);
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Email] Failed to send OTP email:', msg);
    // We still throw so the calling service knows the email was not dispatched
    throw new Error(`Failed to send OTP email: ${msg}`);
  }
}
