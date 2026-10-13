import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { type IUserDocument } from '../models/user.js';
import { signToken } from '../config/jwt.js';

const toPublicUser = (user: IUserDocument) => ({
    id: user._id.toString(),
    nombre: user.nombre,
    email: user.email,
    rol: user.rol
});

// POST /api/auth/register  (pública)
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, email, password } = req.body ?? {};

        // El rol NO se toma del body: todo registro nuevo es "usuario"
        const user = await User.create({ nombre, email, password });
        const token = signToken({ id: user._id.toString(), rol: user.rol });

        res.status(201).json({ token, user: toPublicUser(user) });
    } catch (error) {
        if ((error as { code?: number }).code === 11000) {
            res.status(409).json({ message: 'El email ya está registrado' });
            return;
        }
        res.status(400).json({
            message: 'Error al registrar el usuario',
            error: error instanceof Error ? error.message : error
        });
    }
};

// POST /api/auth/login  (pública)
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body ?? {};

        if (typeof email !== 'string' || typeof password !== 'string') {
            res.status(400).json({ message: 'Email y contraseña son obligatorios' });
            return;
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }

        const token = signToken({ id: user._id.toString(), rol: user.rol });
        res.json({ token, user: toPublicUser(user) });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

// GET /api/auth/me  (privada)
export const me = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.json(toPublicUser(user));
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};
