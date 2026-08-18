import type { Request, Response } from 'express';
import Comic from '../models/comics.js';

// GET /api/comics
export const getComics = async (_req: Request, res: Response): Promise<void> => {
    try {
        const comics = await Comic.find({ activo: true });
        res.json(comics);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cómics' });
    }
};

// GET /api/comics/:id
export const getComicById = async (req: Request, res: Response): Promise<void> => {
    try {
        const comic = await Comic.findById(req.params.id);
        if (!comic || !comic.activo) {
            res.status(404).json({ message: 'Cómic no encontrado' });
            return;
        }
        res.json(comic);
    } catch (error) {
        res.status(400).json({ message: 'ID inválido' });
    }
};

// POST /api/comics
export const createComic = async (req: Request, res: Response): Promise<void> => {
    try {
        const comic = await Comic.create(req.body);
        res.status(201).json(comic);
    } catch (error) {
        res.status(400).json({
            message: 'Error al crear el cómic',
            error: error instanceof Error ? error.message : error
        });
    }
};

// PUT /api/comics/:id
export const updateComic = async (req: Request, res: Response): Promise<void> => {
    try {
        const comic = await Comic.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!comic) {
            res.status(404).json({ message: 'Cómic no encontrado' });
            return;
        }
        res.json(comic);
    } catch (error) {
        res.status(400).json({
            message: 'Error al actualizar el cómic',
            error: error instanceof Error ? error.message : error
        });
    }
};

// DELETE /api/comics/:id  (borrado lógico)
export const deleteComic = async (req: Request, res: Response): Promise<void> => {
    try {
        const comic = await Comic.findByIdAndUpdate(
            req.params.id,
            { activo: false },
            { new: true }
        );
        if (!comic) {
            res.status(404).json({ message: 'Cómic no encontrado' });
            return;
        }
        res.json({ message: 'Cómic eliminado' });
    } catch (error) {
        res.status(400).json({ message: 'ID inválido' });
    }
};
