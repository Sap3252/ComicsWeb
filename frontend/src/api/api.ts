// Mismo origen: Vite y Render reenvían /api al backend, así viaja la cookie de sesión
const API_URL = "/api";

export type Rol = "user" | "admin";

export const TIPOS = ["comic", "libro"] as const;
export type Tipo = (typeof TIPOS)[number];
export const NOMBRE_TIPO: Record<Tipo, string> = { comic: "Cómic", libro: "Libro" };

export const ORDENES = ["votos", "nuevos", "viejos", "nombre"] as const;
export type Orden = (typeof ORDENES)[number];
export const NOMBRE_ORDEN: Record<Orden, string> = {
    votos: "Más votados",
    nuevos: "Más nuevos",
    viejos: "Más viejos",
    nombre: "Nombre (A-Z)"
};

export interface FiltrosCatalogo {
    tags: string[];
    tipo: Tipo | undefined;
    orden: Orden | undefined;
}

export interface Votos {
    puntaje: number;
    upvotes: number;
    downvotes: number;
}

export interface Comic {
    _id: string;
    tipo: Tipo;
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
// Con tags, trae solo los que los tienen todos; con tipo, solo cómics o solo libros; con orden, ordenados
export const getComics = ({ tags = [], tipo, orden }: Partial<FiltrosCatalogo> = {}) => {
    const params = new URLSearchParams();
    if (tags.length > 0) params.set("tags", tags.join(","));
    if (tipo) params.set("tipo", tipo);
    if (orden) params.set("orden", orden);
    const query = params.toString();
    return request<Comic[]>(query ? `/comics?${query}` : "/comics");
};

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
