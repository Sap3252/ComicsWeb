import { Navigate, Outlet, useLocation } from "react-router";
import { useSession } from "../api/auth-client";

// Ruta privada: si no hay usuario logueado, redirige al login
export function PrivateRoute() {
    const { data: sesion, isPending } = useSession();
    const location = useLocation();

    // Al recargar (F5) la sesión todavía se está pidiendo: redirigir ahora mandaría al login a alguien logueado
    if (isPending) {
        return <p className="globo">Cargando...</p>;
    }

    if (!sesion) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}
