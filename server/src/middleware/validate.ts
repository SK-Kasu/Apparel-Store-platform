import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated: NonNullable<Request['validated']> = {};

      if (schemas.body) validated.body = schemas.body.parse(req.body);
      if (schemas.query) validated.query = schemas.query.parse(req.query);
      if (schemas.params) validated.params = schemas.params.parse(req.params);

      req.validated = validated;
      next();
    } catch (error) {
      next(error);
    }
  };
}
