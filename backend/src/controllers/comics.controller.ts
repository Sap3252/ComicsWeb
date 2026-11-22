import type { Request, Response } from 'express';
import Comic, { TIPOS } from '../models/comics.js';
import { HttpError } from '../errors/http-error.js';
import type { ComicInput } from '../schemas/comic.schema.js';
import { getComicActivo } from '../services/comics.service.js';
import { getResumenVotos, getResumenVotosDe, RESUMEN_VACIO } from '../services/votos.service.js';
import { normalizarTags } from '../utils/tags.js';

// GET /api/comics              -> todo el catálogo
// GET /api/comics?tags=a,b     -> solo los que tienen todos esos tags
// GET /api/comics?tipo=libro   -> solo cómics o solo libros
export const getComics = async (req: Request, res: Response): Promise<void> => {
    const tags = normalizarTags(req.query.tags);
    const tipo = TIPOS.find((t) => t === req.query.tipo);
    const comics = await Comic.find({
        activo: true,
        ...(tags.length > 0 ? { tags: { $all: tags } } : {}),
        ...(tipo ? { tipo } : {})
    });
    const votos = await getResumenVotos(comics.map((c) => c._id));

    res.json(comics.map((c) => ({
        ...c.toObject(),
        votos: votos.get(c._id.toString()) ?? RESUMEN_VACIO
    })));
};

// GET /api/comics/:id
export const getComicById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const comic = await getComicActivo(req.params.id);

    res.json({ ...comic.toObject(), votos: await getResumenVotosDe(comic._id) });
};

// POST /api/comics  (body validado con comicSchema)
export const createComic = async (req: Request<Record<string, string>, unknown, ComicInput>, res: Response): Promise<void> => {
    const comic = await Comic.create(req.body);

    res.status(201).json(comic);
};

// PUT /api/comics/:id  (body validado con comicSchema)
export const updateComic = async (req: Request<{ id: string }, unknown, ComicInput>, res: Response): Promise<void> => {
    const comic = await Comic.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!comic) {
        throw new HttpError(404, 'Cómic no encontrado');
    }

    res.json(comic);
};

// DELETE /api/comics/:id  (borrado lógico)
export const deleteComic = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const comic = await Comic.findByIdAndUpdate(req.params.id, { activo: false });

    if (!comic) {
        throw new HttpError(404, 'Cómic no encontrado');
    }

    res.json({ message: 'Cómic eliminado' });
};
