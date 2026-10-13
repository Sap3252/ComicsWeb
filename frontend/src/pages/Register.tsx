import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

// Pública
export function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await register(nombre, email, password);
            navigate("/", { replace: true });
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Registrarse</h1>
            {error && <p className="error">{error}</p>}
            <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña (mínimo 6)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <button type="submit">Crear cuenta</button>
            <p>¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></p>
        </form>
    );
}
