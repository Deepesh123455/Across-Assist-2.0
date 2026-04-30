import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/env';
import { AuthenticatedRequest } from '../types/express';
import { AppError } from './errorHandler';

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('No token provided', StatusCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthenticatedRequest['user'];
    req.user = payload;
    next();
  } catch {
    throw new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED);
  }
};
