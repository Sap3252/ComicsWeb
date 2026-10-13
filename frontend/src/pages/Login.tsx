import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

// Pública
export function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Si llegó redirigido desde una ruta privada, vuelve ahí después del login
    const destino = (location.state as { from?: string } | null)?.from ?? "/";

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate(destino, { replace: true });
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Ingresar</h1>
            {error && <p className="error">{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Ingresar</button>
            <p>¿No tenés cuenta? <Link to="/register">Registrate</Link></p>
        </form>
    );
}
