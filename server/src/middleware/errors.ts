import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { isProd } from '../config/env';
import { ApiError } from '../utils/http';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  let status = 500;
  let message = 'Something went wrong';
  let details: unknown;

  if (error instanceof ApiError) {
    status = error.status;
    message = error.message;
    details = error.details;
  } else if (error instanceof ZodError) {
    status = 400;
    message = error.issues[0]?.message ?? 'Invalid request';
    details = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message
    }));
  } else if (error instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Validation failed';
    details = Object.values(error.errors).map((err) => err.message);
  } else if (error instanceof mongoose.Error.CastError) {
    status = 400;
    message = 'Invalid identifier';
  } else if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: number }).code === 11000
  ) {
    status = 409;
    message = 'That record already exists';
  } else if (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    typeof (error as { type?: unknown }).type === 'string'
  ) {
    const type = (error as { type: string }).type;
    if (type === 'StripeSignatureVerificationError') {
      status = 400;
      message = 'Invalid Stripe webhook signature';
    } else if (type.startsWith('Stripe')) {
      status = 402;
      message = 'The payment provider rejected this request';
      details = isProd ? undefined : (error as { message?: string }).message;
    }
  }

  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, error);
  }

  res.status(status).json({
    error: message,
    ...(details ? { details } : {}),
    ...(!isProd && status >= 500 && error instanceof Error ? { stack: error.stack } : {})
  });
}
