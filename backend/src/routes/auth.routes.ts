import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { signupSchema, sendOtpSchema, verifyOtpSchema, abortOtpSchema } from '../validators/auth.validator';
import { authenticate } from '../middlewares/auth';
import { signup, getMe, checkEmail, refresh, logout } from '../controllers/auth.controller';
import { sendOtpHandler, verifyOtpHandler, abortOtpHandler, demoLoginHandler } from '../controllers/otp.controller';
import { z } from 'zod';

export const authRouter = Router();

// ── Registration ──────────────────────────────────────────────────────────────
authRouter.post('/signup', validate(signupSchema), signup);

// ── OTP Login flow ────────────────────────────────────────────────────────────
authRouter.post('/otp/send',       validate(sendOtpSchema),   sendOtpHandler);
authRouter.post('/otp/verify',     validate(verifyOtpSchema), verifyOtpHandler);
authRouter.post('/otp/abort',      validate(abortOtpSchema),  abortOtpHandler);

// ── Demo bypass (no OTP required) ─────────────────────────────────────────────
// Accepts any registered email and returns real JWT tokens.
// Restrict or remove in production as needed.
authRouter.post(
  '/otp/demo-login',
  validate(z.object({ email: z.string().email(), sessionToken: z.string().nullish() })),
  demoLoginHandler,
);

// ── Protected & utility ───────────────────────────────────────────────────────
authRouter.get('/me', authenticate, getMe);
authRouter.get('/check-email', checkEmail);
authRouter.post('/refresh-token', refresh);
authRouter.post('/logout', logout);
