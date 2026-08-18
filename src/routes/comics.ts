import { Router } from 'express';
import {
    getComics,
    getComicById,
    createComic,
    updateComic,
    deleteComic
} from '../controllers/comics.controller.js';

export const comicsRouter = Router();

comicsRouter.get('/', getComics);
comicsRouter.get('/:id', getComicById);
comicsRouter.post('/', createComic);
comicsRouter.put('/:id', updateComic);
comicsRouter.delete('/:id', deleteComic);
