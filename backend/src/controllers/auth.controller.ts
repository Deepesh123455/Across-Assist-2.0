import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../lib/prisma';
import { authService } from '../services/auth.service';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.getMe(req.user!.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const checkEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.query as { email?: string };
    if (!email) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: 'email query param required' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    res.json({ success: true, data: { exists: !!user } });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: 'refreshToken is required' });
      return;
    }
    const result = await authService.refreshToken(refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Logged out successfully' });
};
