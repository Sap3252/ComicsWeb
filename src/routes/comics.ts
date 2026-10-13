import { Router } from 'express';
import {
    getComics,
    getComicById,
    createComic,
    updateComic,
    deleteComic
} from '../controllers/comics.controller.js';
import { votar, quitarVoto } from '../controllers/votos.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

export const comicsRouter = Router();

// Rutas públicas: cualquiera puede ver los cómics y sus votos
comicsRouter.get('/', getComics);
comicsRouter.get('/:id', getComicById);

// Rutas privadas: solo usuarios autenticados pueden votar
comicsRouter.post('/:id/votos', requireAuth, votar);
comicsRouter.delete('/:id/votos', requireAuth, quitarVoto);

// Rutas privadas protegidas por rol: solo el admin gestiona el catálogo
comicsRouter.post('/', requireAuth, requireRole('admin'), createComic);
comicsRouter.put('/:id', requireAuth, requireRole('admin'), updateComic);
comicsRouter.delete('/:id', requireAuth, requireRole('admin'), deleteComic);
