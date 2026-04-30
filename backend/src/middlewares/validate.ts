import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate =
  (schema: AnyZodObject, target: ValidationTarget = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req[target] = schema.parse(req[target]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        error.errors.forEach((e) => {
          const key = e.path.join('.');
          errors[key] = [...(errors[key] ?? []), e.message];
        });
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }
      next(error);
    }
  };
