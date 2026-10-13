import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../config/jwt.js';
import type { Rol } from '../models/user.js';

// Ruta privada: exige un token válido en el header "Authorization: Bearer <token>"
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ message: 'No autenticado: falta el token' });
        return;
    }

    try {
        req.user = verifyToken(header.slice("Bearer ".length));
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

// Ruta protegida por rol: se usa DESPUÉS de requireAuth
export const requireRole = (...roles: Rol[]) =>
    (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }

        if (!roles.includes(req.user.rol)) {
            res.status(403).json({ message: `Acceso denegado: se requiere rol ${roles.join(' o ')}` });
            return;
        }

        next();
    };
