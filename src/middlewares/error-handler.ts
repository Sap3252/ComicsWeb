import type { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { HttpError } from '../errors/http-error.js';

// express.json() lanza este error cuando el body no es JSON válido
const esBodyInvalido = (error: unknown): boolean =>
    error instanceof SyntaxError && 'body' in error;

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (error instanceof HttpError) {
        res.status(error.status).json({ message: error.message });
        return;
    }

    if (error instanceof MongooseError.CastError && error.path === '_id') {
        res.status(400).json({ message: 'ID inválido' });
        return;
    }

    if (error instanceof MongooseError.ValidationError || error instanceof MongooseError.CastError) {
        res.status(400).json({ message: 'Datos inválidos', error: error.message });
        return;
    }

    if (esBodyInvalido(error)) {
        res.status(400).json({ message: 'El body no es un JSON válido' });
        return;
    }

    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
};
