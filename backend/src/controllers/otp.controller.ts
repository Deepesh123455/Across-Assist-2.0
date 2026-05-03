import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { 
  sendOtp, 
  verifyOtp, 
  abortOtp, 
  demoLogin, 
  getMe, 
  refreshToken as refreshSvc 
} from '../services/otp.service';
import { prisma } from '../lib/prisma';

export const sendOtpHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await sendOtp(req.body.email);
    res.status(StatusCodes.OK).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const verifyOtpHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await verifyOtp(req.body);
    res.status(StatusCodes.OK).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const abortOtpHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await abortOtp(req.body.email);
    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const demoLoginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await demoLogin(req.body.email, req.body.sessionToken);
    res.status(StatusCodes.OK).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getMeHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getMe(req.user!.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const checkEmailHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.query as { email?: string };
    if (!email) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: 'email required' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    res.json({ success: true, data: { exists: !!user } });
  } catch (error) {
    next(error);
  }
};

export const refreshHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: 'refreshToken required' });
      return;
    }
    const result = await refreshSvc(refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const logoutHandler = async (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out' });
};
