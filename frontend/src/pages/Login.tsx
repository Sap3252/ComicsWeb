import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { mensajeDeError, signIn, useSession } from "../api/auth-client";

// Pública
export function Login() {
    const { data: sesion } = useSession();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Si llegó redirigido desde una ruta privada, vuelve ahí después del login
    const destino = (location.state as { from?: string } | null)?.from ?? "/";

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { error } = await signIn.email({ email, password });
        if (error) setError(mensajeDeError(error));
    };

    // Sale de la app hacia GitHub; al volver, Better Auth crea la sesión y redirige a callbackURL
    const ingresarConGithub = async () => {
        const { error } = await signIn.social({ provider: "github", callbackURL: destino });
        if (error) setError(mensajeDeError(error));
    };

    // Se redirige cuando useSession ya tiene la sesión, no apenas responde signIn:
    // si no, la ruta de destino todavía no la ve y vuelve a mandar al login
    if (sesion) {
        return <Navigate to={destino} replace />;
    }

    return (
        <form className="acceso" onSubmit={onSubmit}>
            <h1>Ingresar</h1>
            {error && <p className="error">{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Ingresar</button>
            <button type="button" onClick={ingresarConGithub}>Ingresar con GitHub</button>
            <p>¿No tenés cuenta? <Link to="/register">Registrate</Link></p>
        </form>
    );
}
