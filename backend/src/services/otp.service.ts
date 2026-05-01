/**
 * OTP Service — Enterprise-grade One-Time Password Login
 *
 * Flow:
 *  1. sendOtp(email)   — rate-limit → generate → hash → store → dispatch email
 *  2. verifyOtp(...)   — lock-check → load payload → bcrypt compare → issue tokens
 *  3. abortOtp(email)  — nuke all 4 Redis keys → fresh slate
 *
 * Every Redis interaction uses the key-factory from lib/otpKeys.ts so there
 * is exactly one place that owns key names and TTLs.
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { AppError } from '../middlewares/errorHandler';
import {
  otpCodeKey,
  otpCooldownKey,
  otpAttemptsKey,
  otpLockedKey,
  OTP_TTL,
  OTP_MAX_ATTEMPTS,
  OTP_MAX_SENDS,
  OtpPayload,
} from '../lib/otpKeys';
import { sendOtpEmail } from './emailService';
import { env } from '../config/env';
import jwt from 'jsonwebtoken';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateOtpCode(): string {
  // Cryptographically secure 6-digit code (000000 – 999999)
  const bytes = crypto.randomBytes(4);
  const num = bytes.readUInt32BE(0) % 1_000_000;
  return num.toString().padStart(6, '0');
}

interface MergeResult {
  sessionToken: string | null;
  recommendation: Record<string, unknown> | null;
  formData: Record<string, unknown> | null;
}

function generateTokens(id: string, email: string, role: string) {
  const accessToken = jwt.sign({ id, email, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
  const refreshToken = jwt.sign({ id, email }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
  return { accessToken, refreshToken };
}

async function mergeSession(
  userId: string,
  email: string,
  sessionToken?: string,
): Promise<MergeResult> {
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

  const rec = session.recommendation;
  let recommendation: Record<string, unknown> | null = null;
  if (rec) {
    const whyThisCombo = Array.isArray(rec.whyThisCombo) ? rec.whyThisCombo : [];
    const similarClients = Array.isArray(rec.similarClients) ? rec.similarClients : [];
    recommendation = {
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

  return {
    sessionToken: session.sessionToken as string,
    recommendation,
    formData: (session.formData as Record<string, unknown> | null) ?? null,
  };
}

// ---------------------------------------------------------------------------
// sendOtp
// ---------------------------------------------------------------------------

export interface SendOtpResult {
  /** How many seconds the caller must wait before requesting another OTP */
  cooldownSeconds: number;
}

export async function sendOtp(email: string): Promise<SendOtpResult> {
  const normalised = email.toLowerCase().trim();

  // ── 1. Load user if they exist ──────────────────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { email: normalised },
    select: { id: true, isActive: true, name: true },
  });

  if (user && !user.isActive) {
    throw new AppError('This account has been deactivated.', StatusCodes.FORBIDDEN);
  }

  // ── 2. Cooldown check ─────────────────────────────────────────────────────
  const cooldownKey = otpCooldownKey(normalised);
  const cooldownTtl = await redis.ttl(cooldownKey);

  if (cooldownTtl > 0) {
    throw new AppError(
      `Please wait ${cooldownTtl} seconds before requesting another code.`,
      StatusCodes.TOO_MANY_REQUESTS,
      { cooldownSeconds: cooldownTtl },
    );
  }

  // ── 3. Max-sends guard (prevent OTP bombing even across multiple windows) ──
  const codeKey = otpCodeKey(normalised);
  const existingRaw = await redis.get(codeKey);
  if (existingRaw) {
    const existing: OtpPayload = JSON.parse(existingRaw);
    if (existing.sendCount >= OTP_MAX_SENDS) {
      throw new AppError(
        'Maximum OTP requests reached. Please wait for your current code to expire.',
        StatusCodes.TOO_MANY_REQUESTS,
        { cooldownSeconds: OTP_TTL.CODE },
      );
    }
  }

  // ── 4. Generate and hash the OTP ──────────────────────────────────────────
  const code = generateOtpCode();
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n========================================`);
    console.log(`🔑 DEVELOPMENT OTP CODE FOR ${normalised}: ${code}`);
    console.log(`========================================\n`);
  }

  const codeHash = await bcrypt.hash(code, 10);
  const now = Date.now();
  const sendCount = existingRaw ? (JSON.parse(existingRaw) as OtpPayload).sendCount + 1 : 1;

  const payload: OtpPayload = {
    codeHash,
    issuedAt: new Date(now).toISOString(),
    expiresAt: now + OTP_TTL.CODE * 1000,
    email: normalised,
    sendCount,
  };

  // ── 5. Persist to Redis ───────────────────────────────────────────────────
  // Store OTP payload with hard expiry
  await redis.set(codeKey, JSON.stringify(payload), 'EX', OTP_TTL.CODE);
  // Set cooldown only if it doesn't exist — NX prevents resetting the timer
  // on a concurrent race condition. ioredis accepts the options object form.
  await redis.set(cooldownKey, '1', 'EX', OTP_TTL.RESEND_COOLDOWN, 'NX' as any);

  // ── 6. Dispatch the email ──────────────────────────────────────────────────
  const displayName = user?.name || normalised.split('@')[0];
  await sendOtpEmail(normalised, code, displayName);

  return { cooldownSeconds: OTP_TTL.RESEND_COOLDOWN };
}

// ---------------------------------------------------------------------------
// verifyOtp
// ---------------------------------------------------------------------------

export interface VerifyOtpInput {
  email: string;
  code: string;
  sessionToken?: string;
}

export async function verifyOtp(input: VerifyOtpInput) {
  const normalised = input.email.toLowerCase().trim();

  // ── 1. Lock check ─────────────────────────────────────────────────────────
  const lockedKey = otpLockedKey(normalised);
  const lockTtl = await redis.ttl(lockedKey);
  if (lockTtl > 0) {
    const minutesLeft = Math.ceil(lockTtl / 60);
    throw new AppError(
      `Account is temporarily locked. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`,
      StatusCodes.FORBIDDEN,
      { remainingSeconds: lockTtl },
    );
  }

  // ── 2. Load OTP payload ───────────────────────────────────────────────────
  const codeKey = otpCodeKey(normalised);
  const raw = await redis.get(codeKey);

  if (!raw) {
    throw new AppError(
      'OTP has expired. Please request a new one.',
      StatusCodes.GONE,
    );
  }

  const payload: OtpPayload = JSON.parse(raw);

  // Sanity-check the embedded expiry (defence-in-depth against TTL drift)
  if (Date.now() > payload.expiresAt) {
    await redis.del(codeKey);
    throw new AppError(
      'OTP has expired. Please request a new one.',
      StatusCodes.GONE,
    );
  }

  // ── 3. Compare the submitted code against the stored hash ─────────────────
  const attemptsKey = otpAttemptsKey(normalised);
  const isValid = await bcrypt.compare(input.code, payload.codeHash);

  if (!isValid) {
    // Increment attempts counter
    const attempts = await redis.incr(attemptsKey);

    // Set TTL on first increment
    if (attempts === 1) {
      await redis.expire(attemptsKey, OTP_TTL.ATTEMPTS_WINDOW);
    }

    if (attempts >= OTP_MAX_ATTEMPTS) {
      // Lock the email — intentionally NOT resetting on further attempts
      const pipeline = redis.pipeline();
      pipeline.set(lockedKey, '1', 'EX', OTP_TTL.LOCK);
      pipeline.del(codeKey);
      pipeline.del(attemptsKey);
      await pipeline.exec();

      throw new AppError(
        `Too many incorrect attempts. Account locked for ${OTP_TTL.LOCK / 60} minutes.`,
        StatusCodes.FORBIDDEN,
        { remainingSeconds: OTP_TTL.LOCK },
      );
    }

    const remaining = OTP_MAX_ATTEMPTS - attempts;
    throw new AppError(
      `Incorrect code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
      StatusCodes.UNAUTHORIZED,
      { attemptsRemaining: remaining },
    );
  }

  // ── 4. Success — clean up all OTP keys ───────────────────────────────────
  const pipeline = redis.pipeline();
  pipeline.del(codeKey);
  pipeline.del(attemptsKey);
  pipeline.del(lockedKey);
  pipeline.del(otpCooldownKey(normalised));
  await pipeline.exec();

  // ── 5. Load or create user and issue tokens ──────────────────────────────
  let user = await prisma.user.findUnique({ where: { email: normalised } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: normalised,
        name: normalised.split('@')[0],
        companyName: normalised.split('@')[1]?.split('.')[0] || 'Unknown',
        role: 'CLIENT',
        isVerified: true,
        isEmailVerified: true,
      },
    });
  } else if (!user.isActive) {
    throw new AppError('Account deactivated.', StatusCodes.UNAUTHORIZED);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const mergeResult = await mergeSession(user.id, user.email, input.sessionToken);

  let sessionToken = mergeResult.sessionToken;
  let recommendation = mergeResult.recommendation;
  let formData = mergeResult.formData;

  if (!sessionToken && user.primarySessionId) {
    const primary = await prisma.session.findUnique({
      where: { id: user.primarySessionId },
      include: { recommendation: true },
    });
    if (primary) {
      sessionToken = primary.sessionToken;
      const rec = primary.recommendation as any;
      if (rec) {
        const whyThisCombo = Array.isArray(rec.whyThisCombo) ? rec.whyThisCombo : [];
        const similarClients = Array.isArray(rec.similarClients) ? rec.similarClients : [];
        recommendation = {
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
      formData = (primary.formData as Record<string, unknown> | null) ?? null;
    }
  }

  const tokens = generateTokens(user.id, user.email, String(user.role));

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
    tokens,
    sessionData: {
      sessionToken: sessionToken ?? input.sessionToken ?? null,
      recommendation,
      formData,
    },
  };
}

// ---------------------------------------------------------------------------
// abortOtp — "Wrong email?" escape hatch
// ---------------------------------------------------------------------------

export async function abortOtp(email: string): Promise<void> {
  const normalised = email.toLowerCase().trim();

  // Delete all 4 keys atomically — this gives the user a completely clean slate
  const pipeline = redis.pipeline();
  pipeline.del(otpCodeKey(normalised));
  pipeline.del(otpCooldownKey(normalised));
  pipeline.del(otpAttemptsKey(normalised));
  pipeline.del(otpLockedKey(normalised));
  await pipeline.exec();
}

// ---------------------------------------------------------------------------
// demoLogin — OTP bypass for demonstration / testing
//
// Issues real JWT tokens for any registered, active user WITHOUT requiring
// an OTP code.  This is gated by the DEMO_MODE env flag so it can be
// completely disabled in production.
// ---------------------------------------------------------------------------

export async function demoLogin(email: string, sessionToken?: string) {
  const normalised = email.toLowerCase().trim();

  let user = await prisma.user.findUnique({ where: { email: normalised } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: normalised,
        name: normalised.split('@')[0],
        companyName: normalised.split('@')[1]?.split('.')[0] || 'Unknown',
        role: 'CLIENT',
        isVerified: true,
        isEmailVerified: true,
      },
    });
  }
  if (!user.isActive) {
    throw new AppError('This account has been deactivated.', StatusCodes.FORBIDDEN);
  }

  // Nuke any pending OTP state so the demo doesn't leave orphaned keys
  const pipeline = redis.pipeline();
  pipeline.del(otpCodeKey(normalised));
  pipeline.del(otpCooldownKey(normalised));
  pipeline.del(otpAttemptsKey(normalised));
  pipeline.del(otpLockedKey(normalised));
  await pipeline.exec();

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const mergeResult = await mergeSession(user.id, user.email, sessionToken);
  let resolvedSession = mergeResult.sessionToken;
  let recommendation   = mergeResult.recommendation;
  let formData         = mergeResult.formData;

  if (!resolvedSession && user.primarySessionId) {
    const primary = await prisma.session.findUnique({
      where: { id: user.primarySessionId },
      include: { recommendation: true },
    });
    if (primary) {
      resolvedSession = primary.sessionToken;
      const rec = primary.recommendation as any;
      if (rec) {
        const whyThisCombo  = Array.isArray(rec.whyThisCombo) ? rec.whyThisCombo : [];
        const similarClients = Array.isArray(rec.similarClients) ? rec.similarClients : [];
        recommendation = {
          bundleName: rec.bundleName ?? '',
          products: whyThisCombo, reasons: whyThisCombo, whyThisCombo,
          projectedAnnualRevenue: Number(rec.projectedAnnualRevenue ?? 0),
          similarClients,
          objectionHandle: rec.objectionHandler ?? '',
          objectionHandler: rec.objectionHandler ?? '',
          attachmentRate: rec.attachmentRate ?? 0.3,
          recommendedPlanValue: rec.recommendedPlanValue ?? 1200,
        };
      }
      formData = (primary.formData as Record<string, unknown> | null) ?? null;
    }
  }

  const tokens = generateTokens(user.id, user.email, String(user.role));

  return {
    user: {
      id: user.id, email: user.email, name: user.name,
      companyName: user.companyName, phone: user.phone,
      role: user.role, clientType: user.clientType,
      lastLoginAt: user.lastLoginAt, createdAt: user.createdAt,
      onboardingDone: user.onboardingDone,
    },
    tokens,
    sessionData: {
      sessionToken: resolvedSession ?? sessionToken ?? null,
      recommendation,
      formData,
    },
  };
}
