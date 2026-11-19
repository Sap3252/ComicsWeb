import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { mensajeDeError, signUp } from "../api/auth-client";

// Mínimo que exige Better Auth por defecto
const LARGO_MINIMO_PASSWORD = 8;

// Pública. El rol lo asigna el backend: todo registro nuevo es "user"
export function Register() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { error } = await signUp.email({ name: nombre, email, password });
        if (error) {
            setError(mensajeDeError(error));
            return;
        }
        navigate("/", { replace: true });
    };

    return (
        <form className="acceso" onSubmit={onSubmit}>
            <h1>Registrarse</h1>
            {error && <p className="error">{error}</p>}
            <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input
                type="password"
                placeholder={`Contraseña (mínimo ${LARGO_MINIMO_PASSWORD})`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={LARGO_MINIMO_PASSWORD}
            />
            <button type="submit">Crear cuenta</button>
            <p>¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></p>
        </form>
    );
}
