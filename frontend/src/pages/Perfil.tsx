import { useEffect, useState } from "react";
import * as api from "../api/api";
import type { Usuario } from "../api/api";
import { useAuth } from "../context/AuthContext";

// Privada: los datos se piden a GET /api/auth/me, que también es privada en el backend
export function Perfil() {
    const { token } = useAuth();
    const [perfil, setPerfil] = useState<Usuario | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return;
        api.getPerfil(token).then(setPerfil).catch((e: Error) => setError(e.message));
    }, [token]);

    return (
        <>
            <h1>Mi perfil</h1>
            {error && <p className="error">{error}</p>}
            {perfil && (
                <ul>
                    <li><strong>Nombre:</strong> {perfil.nombre}</li>
                    <li><strong>Email:</strong> {perfil.email}</li>
                    <li><strong>Rol:</strong> {perfil.rol}</li>
                </ul>
            )}
        </>
    );
}
