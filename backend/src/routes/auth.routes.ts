import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { sendOtpSchema, verifyOtpSchema, abortOtpSchema } from '../validators/auth.validator';
import { authenticate } from '../middlewares/auth';
import { 
  sendOtpHandler, 
  verifyOtpHandler, 
  abortOtpHandler, 
  demoLoginHandler,
  getMeHandler,
  checkEmailHandler,
  refreshHandler,
  logoutHandler
} from '../controllers/otp.controller';
import { z } from 'zod';

export const authRouter = Router();

// ── OTP Login flow ────────────────────────────────────────────────────────────
authRouter.post('/otp/send',       validate(sendOtpSchema),   sendOtpHandler);
authRouter.post('/otp/verify',     validate(verifyOtpSchema), verifyOtpHandler);
authRouter.post('/otp/abort',      validate(abortOtpSchema),  abortOtpHandler);

// ── Demo bypass ───────────────────────────────────────────────────────────────
authRouter.post(
  '/otp/demo-login',
  validate(z.object({ email: z.string().email(), sessionToken: z.string().nullish() })),
  demoLoginHandler,
);

// ── Profile & Token ───────────────────────────────────────────────────────────
authRouter.get('/me', authenticate, getMeHandler);
authRouter.get('/check-email', checkEmailHandler);
authRouter.post('/refresh-token', refreshHandler);
authRouter.post('/logout', logoutHandler);
