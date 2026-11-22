import Comic from '../models/comics.js';
import { HttpError } from '../errors/http-error.js';
import type { ResumenVotos } from './votos.service.js';

export const ORDENES = ['votos', 'nuevos', 'viejos', 'nombre'] as const;
export type Orden = (typeof ORDENES)[number];

interface ComicOrdenable {
    titulo: string;
    año: number;
    votos: ResumenVotos;
}

const COMPARADORES: Record<Orden, (a: ComicOrdenable, b: ComicOrdenable) => number> = {
    votos: (a, b) => b.votos.puntaje - a.votos.puntaje,
    nuevos: (a, b) => b.año - a.año,
    viejos: (a, b) => a.año - b.año,
    nombre: (a, b) => a.titulo.localeCompare(b.titulo, 'es')
};

// En los empates queda el orden de carga (sort es estable): los tomos de una saga siguen juntos y en orden
export function ordenar<T extends ComicOrdenable>(comics: T[], orden: Orden | undefined): T[] {
    return orden ? [...comics].sort(COMPARADORES[orden]) : comics;
}

// Devuelve el cómic si existe y no fue dado de baja; si no, lanza un 404
export async function getComicActivo(id: string) {
    const comic = await Comic.findById(id);

    if (!comic || !comic.activo) {
        throw new HttpError(404, 'Cómic no encontrado');
    }

    return comic;
}
