// Mismo origen que el frontend: Vite (en local) y Render (en producción) reenvían /api al backend.
// Así el navegador manda la cookie de sesión de Better Auth en cada pedido
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

// Hace el fetch y convierte los errores del backend en Error
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
        const mensaje = data?.message ?? `Error ${res.status}`;
        throw new Error(data?.error ? `${mensaje}: ${data.error}` : mensaje);
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
