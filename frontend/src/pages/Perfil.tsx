import { useSession } from "../api/auth-client";

// Privada
export function Perfil() {
    const { data: sesion } = useSession();

    // Solo para TypeScript: PrivateRoute ya garantiza la sesión
    if (!sesion) return null;

    return (
        <>
            <h1 className="titular">Mi perfil</h1>
            <ul className="ficha">
                <li><strong>Nombre</strong> {sesion.user.name}</li>
                <li><strong>Email</strong> {sesion.user.email}</li>
                <li><strong>Rol</strong> {sesion.user.role}</li>
            </ul>
        </>
    );
}
