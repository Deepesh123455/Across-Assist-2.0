/**
 * Auth Service — Enterprise-grade One-Time Password Login & Session Management
 *
 * This service handles:
 *  1. OTP flow (send, verify, abort)
 *  2. Demo bypass login
 *  3. Token refresh
 *  4. User profile retrieval (getMe)
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import { AppError } from '../middlewares/errorHandler';
import { env } from '../config/env';
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

// ---------------------------------------------------------------------------
// Types & Helpers
// ---------------------------------------------------------------------------

interface MergeResult {
  sessionToken: string | null;
  recommendation: Record<string, unknown> | null;
  formData: Record<string, unknown> | null;
}

function generateOtpCode(): string {
  const bytes = crypto.randomBytes(4);
  const num = bytes.readUInt32BE(0) % 1_000_000;
  return num.toString().padStart(6, '0');
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

function extractRecommendation(rec: any): Record<string, unknown> | null {
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
    if (session && session.userId && session.userId !== userId) {
      session = null;
    }
  }

  if (!session) {
    session = await prisma.session.findFirst({
      where: { email: { equals: email, mode: 'insensitive' as any }, isConverted: false },
      include: { recommendation: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  if (!session) return { sessionToken: null, recommendation: null, formData: null };

  await prisma.session.update({
    where: { id: session.id },
    data: { userId, isConverted: true, status: 'COMPLETED' as any, followUpSent: true },
  });

  if (session.recommendation) {
    await prisma.user.update({
      where: { id: userId },
      data: { onboardingDone: true, primarySessionId: session.id },
    });
  }

  return {
    sessionToken: session.sessionToken as string,
    recommendation: extractRecommendation(session.recommendation),
    formData: (session.formData as Record<string, unknown> | null) ?? null,
  };
}

// ---------------------------------------------------------------------------
// OTP Flow
// ---------------------------------------------------------------------------

export async function sendOtp(email: string) {
  const normalised = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalised },
    select: { id: true, isActive: true, name: true },
  });

  if (user && !user.isActive) {
    throw new AppError('This account has been deactivated.', StatusCodes.FORBIDDEN);
  }

  const cooldownKey = otpCooldownKey(normalised);
  const cooldownTtl = await redis.ttl(cooldownKey);
  if (cooldownTtl > 0) {
    throw new AppError(
      `Please wait ${cooldownTtl} seconds before requesting another code.`,
      StatusCodes.TOO_MANY_REQUESTS,
      { cooldownSeconds: cooldownTtl },
    );
  }

  const codeKey = otpCodeKey(normalised);
  const existingRaw = await redis.get(codeKey);
  const sendCount = existingRaw ? (JSON.parse(existingRaw) as OtpPayload).sendCount + 1 : 1;

  if (sendCount > OTP_MAX_SENDS) {
    throw new AppError('Maximum OTP requests reached.', StatusCodes.TOO_MANY_REQUESTS);
  }

  const code = generateOtpCode();
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔑 [DEV] OTP for ${normalised}: ${code}\n`);
  }

  const codeHash = await bcrypt.hash(code, 10);
  const now = Date.now();
  const payload: OtpPayload = {
    codeHash,
    issuedAt: new Date(now).toISOString(),
    expiresAt: now + OTP_TTL.CODE * 1000,
    email: normalised,
    sendCount,
  };

  await redis.set(codeKey, JSON.stringify(payload), 'EX', OTP_TTL.CODE);
  await redis.set(cooldownKey, '1', 'EX', OTP_TTL.RESEND_COOLDOWN, 'NX' as any);

  const displayName = user?.name || normalised.split('@')[0];
  await sendOtpEmail(normalised, code, displayName);

  return { cooldownSeconds: OTP_TTL.RESEND_COOLDOWN };
}

export async function verifyOtp(input: { email: string; code: string; sessionToken?: string }) {
  const normalised = input.email.toLowerCase().trim();

  // 1. Lock check
  const lockedKey = otpLockedKey(normalised);
  const lockTtl = await redis.ttl(lockedKey);
  if (lockTtl > 0) {
    throw new AppError('Account is temporarily locked.', StatusCodes.FORBIDDEN);
  }

  // 2. Load OTP
  const codeKey = otpCodeKey(normalised);
  const raw = await redis.get(codeKey);
  if (!raw) throw new AppError('OTP has expired.', StatusCodes.GONE);

  const payload: OtpPayload = JSON.parse(raw);
  const isValid = await bcrypt.compare(input.code, payload.codeHash);

  if (!isValid) {
    const attempts = await redis.incr(otpAttemptsKey(normalised));
    if (attempts === 1) await redis.expire(otpAttemptsKey(normalised), OTP_TTL.ATTEMPTS_WINDOW);
    
    if (attempts >= OTP_MAX_ATTEMPTS) {
      await redis.set(lockedKey, '1', 'EX', OTP_TTL.LOCK);
      await redis.del(codeKey);
      throw new AppError('Too many attempts. Account locked.', StatusCodes.FORBIDDEN);
    }
    throw new AppError('Incorrect code.', StatusCodes.UNAUTHORIZED);
  }

  // 3. Cleanup
  await redis.del(codeKey, otpAttemptsKey(normalised), lockedKey, otpCooldownKey(normalised));

  // 4. User Session
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

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const mergeResult = await mergeSession(user.id, user.email, input.sessionToken);

  const tokens = generateTokens(user.id, user.email, String(user.role));
  return {
    user: { ...user, onboardingDone: user.onboardingDone || !!mergeResult.recommendation },
    tokens,
    sessionData: mergeResult,
  };
}

export async function abortOtp(email: string) {
  const normalised = email.toLowerCase().trim();
  await redis.del(otpCodeKey(normalised), otpCooldownKey(normalised), otpAttemptsKey(normalised), otpLockedKey(normalised));
}

// ---------------------------------------------------------------------------
// Demo & Profile
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

  await redis.del(otpCodeKey(normalised), otpCooldownKey(normalised), otpAttemptsKey(normalised), otpLockedKey(normalised));
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const mergeResult = await mergeSession(user.id, user.email, sessionToken);
  const tokens = generateTokens(user.id, user.email, String(user.role));

  return {
    user: { ...user, onboardingDone: user.onboardingDone || !!mergeResult.recommendation },
    tokens,
    sessionData: mergeResult,
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { primarySession: { include: { recommendation: true, chatMessages: { take: 50 } } } },
  });
  if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

  return {
    user: { ...user, onboardingDone: user.onboardingDone || !!user.primarySession?.recommendation },
    sessionToken: user.primarySession?.sessionToken ?? null,
    recommendation: extractRecommendation(user.primarySession?.recommendation),
    formData: user.primarySession?.formData ?? null,
    chatCount: user.primarySession?.chatMessages?.length ?? 0,
  };
}

export async function refreshToken(token: string) {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; email: string };
    const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { role: true } });
    return { tokens: generateTokens(payload.id, payload.email, String(user?.role ?? 'CLIENT')) };
  } catch {
    throw new AppError('Invalid refresh token', StatusCodes.UNAUTHORIZED);
  }
}
