import { createContext, useContext, useState, type ReactNode } from "react";
import * as api from "../api/api";
import type { RespuestaAuth, Usuario } from "../api/api";

interface AuthContextValue {
    token: string | null;
    user: Usuario | null;
    login: (email: string, password: string) => Promise<void>;
    register: (nombre: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "auth";

// Lee la sesión guardada y la descarta si el token ya venció
function cargarSesion(): RespuestaAuth | null {
    try {
        const sesion = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as RespuestaAuth | null;
        if (!sesion) return null;

        const payload = JSON.parse(atob(sesion.token.split(".")[1]!.replace(/-/g, "+").replace(/_/g, "/")));
        if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        return sesion;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [sesion, setSesion] = useState<RespuestaAuth | null>(cargarSesion);

    const guardar = (nueva: RespuestaAuth) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nueva));
        setSesion(nueva);
    };

    const value: AuthContextValue = {
        token: sesion?.token ?? null,
        user: sesion?.user ?? null,
        login: async (email, password) => guardar(await api.login(email, password)),
        register: async (nombre, email, password) => guardar(await api.register(nombre, email, password)),
        logout: () => {
            localStorage.removeItem(STORAGE_KEY);
            setSesion(null);
        }
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
}
