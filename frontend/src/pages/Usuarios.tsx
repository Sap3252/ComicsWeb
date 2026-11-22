import { useEffect, useState } from "react";
import type { UserWithRole } from "better-auth/plugins/admin";
import { authClient, mensajeDeError, useSession } from "../api/auth-client";
import type { Rol } from "../api/api";

const ROLES: Rol[] = ["user", "admin"];

// Protegida por rol: solo admin. Lista los usuarios y les cambia el rol
export function Usuarios() {
    const { data: sesion } = useSession();
    const [usuarios, setUsuarios] = useState<UserWithRole[]>([]);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const cargar = async () => {
        const { data, error } = await authClient.admin.listUsers({ query: { sortBy: "name", sortDirection: "asc" } });
        if (error) {
            setError(mensajeDeError(error));
            return;
        }
        setUsuarios(data.users);
    };

    useEffect(() => {
        cargar();
    }, []);

    const cambiarRol = async (usuario: UserWithRole, role: Rol) => {
        setError("");
        setMensaje("");
        const { error } = await authClient.admin.setRole({ userId: usuario.id, role });
        if (error) {
            setError(mensajeDeError(error));
            return;
        }
        setMensaje(`${usuario.name} ahora es ${role}`);
        await cargar();
    };

    return (
        <>
            <h1 className="titular">Administrar usuarios</h1>
            {mensaje && <p className="ok">{mensaje}</p>}
            {error && <p className="error">{error}</p>}

            <div className="tabla">
                <table>
                    <tbody>
                        {usuarios.map((usuario) => {
                            // El admin no puede quitarse su propio rol: se quedaría afuera del panel
                            const esUnoMismo = usuario.id === sesion?.user.id;
                            return (
                                <tr key={usuario.id}>
                                    <td>{usuario.name}{esUnoMismo && " (vos)"}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        <select
                                            aria-label={`Rol de ${usuario.name}`}
                                            value={usuario.role ?? "user"}
                                            disabled={esUnoMismo}
                                            onChange={(e) => cambiarRol(usuario, e.target.value as Rol)}
                                        >
                                            {ROLES.map((rol) => <option key={rol} value={rol}>{rol}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}
