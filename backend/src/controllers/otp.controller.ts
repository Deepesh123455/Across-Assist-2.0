import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendOtp, verifyOtp, abortOtp, demoLogin } from '../services/otp.service';


/**
 * POST /auth/otp/send
 * Body: { email: string }
 *
 * Sends a 6-digit OTP to the given email.
 * Returns { cooldownSeconds } so the client knows how long to block Resend.
 */
export const sendOtpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await sendOtp(req.body.email);
    res.status(StatusCodes.OK).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/otp/verify
 * Body: { email: string; code: string; sessionToken?: string }
 *
 * Verifies the OTP and, on success, returns the full AuthResponse
 * (user, tokens, sessionData) — same shape as the old /auth/login.
 */
export const verifyOtpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await verifyOtp({
      email: req.body.email,
      code: req.body.code,
      sessionToken: req.body.sessionToken,
    });
    res.status(StatusCodes.OK).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/otp/abort
 * Body: { email: string }
 *
 * "Wrong email?" escape hatch — nukes all OTP state for the email so the
 * user can start a completely fresh login attempt.
 */
export const abortOtpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await abortOtp(req.body.email);
    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/otp/demo-login
 * Body: { email: string; sessionToken?: string }
 *
 * Demo/testing bypass — skips OTP entirely and issues real JWT tokens.
 * Should be disabled or heavily restricted in production.
 */
export const demoLoginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await demoLogin(req.body.email, req.body.sessionToken);
    res.status(StatusCodes.OK).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
