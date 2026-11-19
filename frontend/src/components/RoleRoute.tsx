import { Navigate, Outlet, useLocation } from "react-router";
import { useSession } from "../api/auth-client";
import type { Rol } from "../api/api";

// Ruta protegida por rol: exige estar logueado y tener alguno de los roles indicados
export function RoleRoute({ roles }: { roles: Rol[] }) {
    const { data: sesion, isPending } = useSession();
    const location = useLocation();

    // Mientras se pide la sesión no se sabe el rol: esperar en vez de redirigir
    if (isPending) {
        return <p className="globo">Cargando...</p>;
    }

    if (!sesion) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (!roles.some((rol) => rol === sesion.user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
