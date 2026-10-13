import type { Types } from 'mongoose';
import Voto from '../models/voto.js';

export interface ResumenVotos {
    puntaje: number;
    upvotes: number;
    downvotes: number;
}

export const RESUMEN_VACIO: ResumenVotos = { puntaje: 0, upvotes: 0, downvotes: 0 };

// Devuelve los votos de cada cómic, indexados por el id del cómic
export async function getResumenVotos(comicIds: Types.ObjectId[]): Promise<Map<string, ResumenVotos>> {
    const filas = await Voto.aggregate<{ _id: Types.ObjectId; upvotes: number; downvotes: number }>([
        { $match: { comic: { $in: comicIds } } },
        {
            $group: {
                _id: "$comic",
                upvotes: { $sum: { $cond: [{ $eq: ["$valor", 1] }, 1, 0] } },
                downvotes: { $sum: { $cond: [{ $eq: ["$valor", -1] }, 1, 0] } }
            }
        }
    ]);

    return new Map(filas.map((f) => [
        f._id.toString(),
        { puntaje: f.upvotes - f.downvotes, upvotes: f.upvotes, downvotes: f.downvotes }
    ]));
}
