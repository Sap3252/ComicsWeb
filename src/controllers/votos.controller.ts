import type { Request, Response } from 'express';
import type { Types } from 'mongoose';
import Comic from '../models/comics.js';
import Voto from '../models/voto.js';
import { getResumenVotos, RESUMEN_VACIO } from '../services/votos.service.js';

// Votos del cómic + el voto del usuario logueado
const respuestaVotos = async (comicId: Types.ObjectId, usuarioId: string) => {
    const resumen = (await getResumenVotos([comicId])).get(comicId.toString()) ?? RESUMEN_VACIO;
    const miVoto = await Voto.findOne({ usuario: usuarioId, comic: comicId });

    return {
        comicId: comicId.toString(),
        ...resumen,
        miVoto: miVoto ? (miVoto.valor === 1 ? "up" : "down") : null
    };
};

// POST /api/comics/:id/votos  body: { "tipo": "up" | "down" }  (privada)
// Si el usuario ya había votado, se reemplaza su voto
export const votar = async (req: Request, res: Response): Promise<void> => {
    const { tipo } = req.body ?? {};

    if (tipo !== "up" && tipo !== "down") {
        res.status(400).json({ message: 'El tipo de voto debe ser "up" o "down"' });
        return;
    }

    try {
        const comic = await Comic.findById(req.params.id);
        if (!comic || !comic.activo) {
            res.status(404).json({ message: 'Cómic no encontrado' });
            return;
        }

        const usuarioId = req.user!.id;
        await Voto.findOneAndUpdate(
            { usuario: usuarioId, comic: comic._id },
            { valor: tipo === "up" ? 1 : -1 },
            { upsert: true, runValidators: true }
        );

        res.json(await respuestaVotos(comic._id, usuarioId));
    } catch (error) {
        res.status(400).json({ message: 'ID inválido' });
    }
};

// DELETE /api/comics/:id/votos  (privada)
export const quitarVoto = async (req: Request, res: Response): Promise<void> => {
    try {
        const comic = await Comic.findById(req.params.id);
        if (!comic || !comic.activo) {
            res.status(404).json({ message: 'Cómic no encontrado' });
            return;
        }

        const usuarioId = req.user!.id;
        await Voto.deleteOne({ usuario: usuarioId, comic: comic._id });

        res.json(await respuestaVotos(comic._id, usuarioId));
    } catch (error) {
        res.status(400).json({ message: 'ID inválido' });
    }
};
