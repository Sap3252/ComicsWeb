import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { Rol } from "../api/api";

// Ruta protegida por rol: exige estar logueado y tener alguno de los roles indicados
export function RoleRoute({ roles }: { roles: Rol[] }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (!roles.includes(user.rol)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
