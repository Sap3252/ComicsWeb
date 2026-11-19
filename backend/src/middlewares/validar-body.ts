import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

// Si el body no cumple el schema, parse lanza un ZodError que errorHandler responde como 400.
// Si lo cumple, el controller recibe el body ya validado: recortado y sin campos de más
export const validarBody = (schema: ZodType) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        req.body = schema.parse(req.body);
        next();
    };
