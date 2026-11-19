import type { NextFunction, Request, Response } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth, type Rol } from '../config/auth.js';

// Ruta privada: exige la cookie de sesión de Better Auth
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const sesion = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

    if (!sesion) {
        res.status(401).json({ message: 'No autenticado: iniciá sesión' });
        return;
    }

    req.user = { id: sesion.user.id, role: sesion.user.role ?? "user" };
    next();
};

// Ruta protegida por rol: se usa DESPUÉS de authMiddleware
export const requireRole = (...roles: Rol[]) =>
    (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }

        if (!roles.some((rol) => rol === req.user?.role)) {
            res.status(403).json({ message: `Acceso denegado: se requiere rol ${roles.join(' o ')}` });
            return;
        }

        next();
    };
