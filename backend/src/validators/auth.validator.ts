import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  companyName: z.string().min(1, 'Company name is required'),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  sessionToken: z.string().optional(),
  clientType: z.string().optional(),
});

// Alias for backward compat
export const registerSchema = signupSchema;

// ── OTP Login schemas ────────────────────────────────────────────────────────

/** Step 1 — request an OTP for this email */
export const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/** Step 2 — submit the received OTP code */
export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z
    .string()
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only digits'),
  sessionToken: z.string().optional(),
});

/** Abort — "Wrong email?" wipes all OTP state for that email */
export const abortOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type RegisterInput = SignupInput;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type AbortOtpInput = z.infer<typeof abortOtpSchema>;
