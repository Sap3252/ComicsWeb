// Datos del usuario autenticado que el middleware authMiddleware deja en req.user
// role es string y no Rol: Better Auth lo guarda como texto libre
export interface AuthUser {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
