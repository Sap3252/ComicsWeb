import { useSession } from "../api/auth-client";

// Privada: PrivateRoute ya esperó la sesión
export function Perfil() {
    const { data: sesion } = useSession();

    // Nunca pasa detrás de PrivateRoute; el if es para que TypeScript sepa que hay sesión
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
