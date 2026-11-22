import { NavLink, Outlet } from "react-router";

// Protegida por rol: solo admin. Cada pestaña es una ruta hija de /admin
export function PanelAdmin() {
    return (
        <>
            <div className="pestanas" aria-label="Secciones del panel de admin">
                <NavLink to="/admin" end>Cómics</NavLink>
                <NavLink to="/admin/usuarios">Usuarios</NavLink>
            </div>
            <Outlet />
        </>
    );
}
