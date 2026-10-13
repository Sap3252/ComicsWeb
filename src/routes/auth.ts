import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.js';

export const authRouter = Router();

// Rutas públicas
authRouter.post('/register', register);
authRouter.post('/login', login);

// Ruta privada (cualquier usuario autenticado)
authRouter.get('/me', requireAuth, me);
