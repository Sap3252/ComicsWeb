import jwt from 'jsonwebtoken';
import { ROLES, type Rol } from '../models/user.js';
import type { AuthUser } from '../types/express.js';

function getSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("falta JWT_SECRET en el .env");
    }

    return secret;
}

export function signToken(user: AuthUser): string {
    return jwt.sign({ rol: user.rol }, getSecret(), {
        subject: user.id,
        expiresIn: "1h"
    });
}

// Devuelve el usuario del token o lanza un error si es inválido / expiró
export function verifyToken(token: string): AuthUser {
    const payload = jwt.verify(token, getSecret());

    if (
        typeof payload === "string" ||
        !payload.sub ||
        !ROLES.includes(payload.rol as Rol)
    ) {
        throw new Error("Token con formato inválido");
    }

    return { id: payload.sub, rol: payload.rol as Rol };
}
