import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../types/common';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = StatusCodes.OK,
): Response => {
  const response: ApiResponse<T> = { success: true, message, data };
  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(res: Response, data: T, message = 'Created'): Response => {
  return sendSuccess(res, data, message, StatusCodes.CREATED);
};

export const sendNoContent = (res: Response): Response => {
  return res.status(StatusCodes.NO_CONTENT).send();
};

export const sendError = (
  res: Response,
  message = 'Internal Server Error',
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  errors?: Record<string, string[]>,
): Response => {
  const response: ApiResponse = { success: false, message, errors };
  return res.status(statusCode).json(response);
};
