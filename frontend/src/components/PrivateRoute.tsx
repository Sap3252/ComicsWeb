import { Navigate, Outlet, useLocation } from "react-router";
import { useSession } from "../api/auth-client";

// Ruta privada: si no hay usuario logueado, redirige al login
export function PrivateRoute() {
    const { data: sesion, isPending } = useSession();
    const location = useLocation();

    // Al recargar, la sesión todavía se está pidiendo: esperar en vez de redirigir
    if (isPending) {
        return <p className="globo">Cargando...</p>;
    }

    if (!sesion) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}
