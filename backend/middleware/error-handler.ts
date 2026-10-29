import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/http';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error instanceof ApiError ? error.status : 500;
  const message =
    status >= 500
      ? 'Internal server error'
      : error instanceof Error
        ? error.message
        : 'Request failed';

  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, error);
  }

  res.status(status).json({
    error: message,
    ...(error instanceof ApiError && error.details ? { details: error.details } : {})
  });
};
