// URL del backend. Se puede cambiar con VITE_API_URL en frontend/.env
const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export type Rol = "usuario" | "admin";

export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    rol: Rol;
}

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
    votos: Votos;
}

export type ComicInput = Omit<Comic, "_id" | "votos">;

export type TipoVoto = "up" | "down";

export interface RespuestaVoto extends Votos {
    comicId: string;
    miVoto: TipoVoto | null;
}

export interface RespuestaAuth {
    token: string;
    user: Usuario;
}

// Hace el fetch, agrega el token si hay y convierte los errores del backend en Error
async function request<T>(path: string, method = "GET", body?: unknown, token?: string | null): Promise<T> {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;

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

// Auth
export const login = (email: string, password: string) =>
    request<RespuestaAuth>("/auth/login", "POST", { email, password });

export const register = (nombre: string, email: string, password: string) =>
    request<RespuestaAuth>("/auth/register", "POST", { nombre, email, password });

export const getPerfil = (token: string) =>
    request<Usuario>("/auth/me", "GET", undefined, token);

// Cómics
export const getComics = () => request<Comic[]>("/comics");

export const crearComic = (comic: ComicInput, token: string) =>
    request<Comic>("/comics", "POST", comic, token);

export const editarComic = (id: string, comic: ComicInput, token: string) =>
    request<Comic>(`/comics/${id}`, "PUT", comic, token);

export const eliminarComic = (id: string, token: string) =>
    request<{ message: string }>(`/comics/${id}`, "DELETE", undefined, token);

// Votos
export const votar = (id: string, tipo: TipoVoto, token: string) =>
    request<RespuestaVoto>(`/comics/${id}/votos`, "POST", { tipo }, token);

export const quitarVoto = (id: string, token: string) =>
    request<RespuestaVoto>(`/comics/${id}/votos`, "DELETE", undefined, token);
