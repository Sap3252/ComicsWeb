import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { type IUserDocument } from '../models/user.js';
import { signToken } from '../config/jwt.js';
import { HttpError } from '../errors/http-error.js';

// Código de MongoDB para "clave duplicada" en un índice único (acá, el email)
const CLAVE_DUPLICADA = 11000;

const toPublicUser = (user: IUserDocument) => ({
    id: user._id.toString(),
    nombre: user.nombre,
    email: user.email,
    rol: user.rol
});

const respuestaAuth = (user: IUserDocument) => ({
    token: signToken({ id: user._id.toString(), rol: user.rol }),
    user: toPublicUser(user)
});

// POST /api/auth/register  (pública)
export const register = async (req: Request, res: Response): Promise<void> => {
    const { nombre, email, password } = req.body ?? {};

    try {
        // El rol NO se toma del body: todo registro nuevo es "usuario"
        const user = await User.create({ nombre, email, password });

        res.status(201).json(respuestaAuth(user));
    } catch (error) {
        if ((error as { code?: number }).code === CLAVE_DUPLICADA) {
            throw new HttpError(409, 'El email ya está registrado');
        }
        throw error;
    }
};

// POST /api/auth/login  (pública)
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body ?? {};

    if (typeof email !== 'string' || typeof password !== 'string') {
        throw new HttpError(400, 'Email y contraseña son obligatorios');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new HttpError(401, 'Credenciales inválidas');
    }

    res.json(respuestaAuth(user));
};

// GET /api/auth/me  (privada)
export const me = async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.user?.id);

    if (!user) {
        throw new HttpError(404, 'Usuario no encontrado');
    }

    res.json(toPublicUser(user));
};
