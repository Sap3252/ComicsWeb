import Comic from '../models/comics.js';
import { HttpError } from '../errors/http-error.js';

// Devuelve el cómic si existe y no fue dado de baja; si no, lanza un 404
export async function getComicActivo(id: string) {
    const comic = await Comic.findById(id);

    if (!comic || !comic.activo) {
        throw new HttpError(404, 'Cómic no encontrado');
    }

    return comic;
}
