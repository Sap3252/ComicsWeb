import { Link, Navigate, NavLink, Route, Routes } from "react-router";
import { useAuth } from "./context/AuthContext";
import { useTema } from "./hooks/useTema";
import { PrivateRoute } from "./components/PrivateRoute";
import { RoleRoute } from "./components/RoleRoute";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Perfil } from "./pages/Perfil";
import { Admin } from "./pages/Admin";
import { ComicDetalle } from "./pages/ComicDetalle";

export function App() {
    const { user, logout } = useAuth();
    const { tema, alternar } = useTema();

    return (
        <>
            <nav>
                <Link to="/" className="marca">ComicsWeb</Link>
                <NavLink to="/" end>Inicio</NavLink>
                {user ? (
                    <>
                        <NavLink to="/perfil">Perfil</NavLink>
                        {user.rol === "admin" && <NavLink to="/admin">Admin</NavLink>}
                        <span className="leyenda">Hola, {user.nombre}</span>
                        <button onClick={logout}>Salir</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Ingresar</NavLink>
                        <NavLink to="/register">Registrarse</NavLink>
                    </>
                )}
                <button className="boton-tema" onClick={alternar}>
                    {tema === "oscuro" ? "☀ Modo claro" : "☾ Modo oscuro"}
                </button>
            </nav>

            <main>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/comic/:id" element={<ComicDetalle />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Rutas privadas: cualquier usuario logueado */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/perfil" element={<Perfil />} />
                    </Route>

                    {/* Rutas privadas protegidas por rol: solo admin */}
                    <Route element={<RoleRoute roles={["admin"]} />}>
                        <Route path="/admin" element={<Admin />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </>
    );
}
