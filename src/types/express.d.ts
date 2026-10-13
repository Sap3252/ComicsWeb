import type { Rol } from '../models/user.js';

// Datos del usuario autenticado que el middleware requireAuth deja en req.user
export interface AuthUser {
    id: string;
    rol: Rol;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
