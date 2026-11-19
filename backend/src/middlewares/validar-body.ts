import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

// Si el body no cumple el schema, errorHandler responde el ZodError como 400
export const validarBody = (schema: ZodType) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        req.body = schema.parse(req.body);
        next();
    };
