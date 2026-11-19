// Mismo origen: Vite y Render reenvían /api al backend, así viaja la cookie de sesión
const API_URL = "/api";

export type Rol = "user" | "admin";

export interface Votos {
    puntaje: number;
    upvotes: number;
    downvotes: number;
}

export interface Comic {
    _id: string;
    titulo: string;
    año: number;
    volumen: number;
    autor: string;
    saga: string;
    portada: string;
    contraportada?: string;
    tags: string[];
    votos: Votos;
}

export type ComicInput = Omit<Comic, "_id" | "votos">;

export type TipoVoto = "up" | "down";

export interface RespuestaVoto extends Votos {
    comicId: string;
    miVoto: TipoVoto | null;
}

interface RespuestaError {
    message?: string;
    error?: string;
    errores?: { campo: string; mensaje: string }[];
}

// Zod manda el detalle en "errores"; Mongoose, en "error"
function textoDeError(data: RespuestaError | null, status: number): string {
    const mensaje = data?.message ?? `Error ${status}`;
    const detalle = data?.errores?.map(({ campo, mensaje }) => `${campo}: ${mensaje}`).join(" · ") ?? data?.error;
    return detalle ? `${mensaje} — ${detalle}` : mensaje;
}

async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const res = await fetch(API_URL + path, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : null
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(textoDeError(data, res.status));
    }
    return data as T;
}

// Cómics
// Con tags, trae solo los cómics que los tienen todos
export const getComics = (tags: string[] = []) =>
    request<Comic[]>(tags.length > 0 ? `/comics?tags=${encodeURIComponent(tags.join(","))}` : "/comics");

export const getComic = (id: string) => request<Comic>(`/comics/${id}`);

export const crearComic = (comic: ComicInput) =>
    request<Comic>("/comics", "POST", comic);

export const editarComic = (id: string, comic: ComicInput) =>
    request<Comic>(`/comics/${id}`, "PUT", comic);

export const eliminarComic = (id: string) =>
    request<{ message: string }>(`/comics/${id}`, "DELETE");

// Votos
export const votar = (id: string, tipo: TipoVoto) =>
    request<RespuestaVoto>(`/comics/${id}/votos`, "POST", { tipo });

export const quitarVoto = (id: string) =>
    request<RespuestaVoto>(`/comics/${id}/votos`, "DELETE");
