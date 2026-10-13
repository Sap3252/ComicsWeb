import { Link, Navigate, Route, Routes } from "react-router";
import { useAuth } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { RoleRoute } from "./components/RoleRoute";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Perfil } from "./pages/Perfil";
import { Admin } from "./pages/Admin";

export function App() {
    const { user, logout } = useAuth();

    return (
        <>
            <nav>
                <Link to="/">Inicio</Link>
                {user ? (
                    <>
                        <Link to="/perfil">Perfil</Link>
                        {user.rol === "admin" && <Link to="/admin">Admin</Link>}
                        <span>Hola, {user.nombre}</span>
                        <button onClick={logout}>Salir</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Ingresar</Link>
                        <Link to="/register">Registrarse</Link>
                    </>
                )}
            </nav>

            <main>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<Home />} />
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
