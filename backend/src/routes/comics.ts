import { Router } from 'express';
import {
    getComics,
    getComicById,
    createComic,
    updateComic,
    deleteComic
} from '../controllers/comics.controller.js';
import { votar, quitarVoto } from '../controllers/votos.controller.js';
import { authMiddleware, requireRole } from '../middlewares/auth.js';
import { validarBody } from '../middlewares/validar-body.js';
import { comicSchema } from '../schemas/comic.schema.js';
import { votoSchema } from '../schemas/voto.schema.js';

export const comicsRouter = Router();

// Rutas públicas: cualquiera puede ver los cómics y sus votos
comicsRouter.get('/', getComics);
comicsRouter.get('/:id', getComicById);

// Rutas privadas: solo usuarios autenticados pueden votar
comicsRouter.post('/:id/votos', authMiddleware, validarBody(votoSchema), votar);
comicsRouter.delete('/:id/votos', authMiddleware, quitarVoto);

// Rutas privadas protegidas por rol: solo el admin gestiona el catálogo.
// validarBody va después de los middlewares de auth: sin sesión o sin permisos responde 401/403 antes que 400
comicsRouter.post('/', authMiddleware, requireRole('admin'), validarBody(comicSchema), createComic);
comicsRouter.put('/:id', authMiddleware, requireRole('admin'), validarBody(comicSchema), updateComic);
comicsRouter.delete('/:id', authMiddleware, requireRole('admin'), deleteComic);
