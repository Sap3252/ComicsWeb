import type { Request, Response } from 'express';
import type { Types } from 'mongoose';
import Voto from '../models/voto.js';
import { getComicActivo } from '../services/comics.service.js';
import { getResumenVotosDe } from '../services/votos.service.js';
import type { VotoInput } from '../schemas/voto.schema.js';

// Votos del cómic + el voto del usuario logueado
const respuestaVotos = async (comicId: Types.ObjectId, usuarioId: string) => {
    const resumen = await getResumenVotosDe(comicId);
    const miVoto = await Voto.findOne({ usuario: usuarioId, comic: comicId });

    return {
        comicId: comicId.toString(),
        ...resumen,
        miVoto: miVoto ? (miVoto.valor === 1 ? "up" : "down") : null
    };
};

// POST /api/comics/:id/votos  (privada)
// Si el usuario ya había votado, se reemplaza su voto
export const votar = async (req: Request<{ id: string }, unknown, VotoInput>, res: Response): Promise<void> => {
    const { tipo } = req.body;
    const comic = await getComicActivo(req.params.id);
    const usuarioId = req.user!.id;

    await Voto.findOneAndUpdate(
        { usuario: usuarioId, comic: comic._id },
        { valor: tipo === "up" ? 1 : -1 },
        { upsert: true, runValidators: true }
    );

    res.json(await respuestaVotos(comic._id, usuarioId));
};

// DELETE /api/comics/:id/votos  (privada)
export const quitarVoto = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const comic = await getComicActivo(req.params.id);
    const usuarioId = req.user!.id;

    await Voto.deleteOne({ usuario: usuarioId, comic: comic._id });

    res.json(await respuestaVotos(comic._id, usuarioId));
};
