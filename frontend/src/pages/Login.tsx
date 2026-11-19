import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLocation } from "react-router";
import { mensajeDeError, signIn, useSession } from "../api/auth-client";
import { ErrorDeCampo } from "../components/ErrorDeCampo";
import { loginSchema, type LoginForm } from "../schemas/auth";

// Pública
export function Login() {
    const { data: sesion } = useSession();
    const location = useLocation();
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });

    // Si llegó redirigido desde una ruta privada, vuelve ahí después del login
    const destino = (location.state as { from?: string } | null)?.from ?? "/";

    // Los errores del servidor van en "root": no son de un campo y React Hook Form los limpia al reenviar
    const onSubmit = async ({ email, password }: LoginForm) => {
        const { error } = await signIn.email({ email, password });
        if (error) setError("root", { message: mensajeDeError(error) });
    };

    // Sale de la app hacia GitHub; al volver, Better Auth crea la sesión y redirige a callbackURL
    const ingresarConGithub = async () => {
        const { error } = await signIn.social({ provider: "github", callbackURL: destino });
        if (error) setError("root", { message: mensajeDeError(error) });
    };

    // Se redirige cuando useSession ya tiene la sesión, no apenas responde signIn:
    // si no, la ruta de destino todavía no la ve y vuelve a mandar al login
    if (sesion) {
        return <Navigate to={destino} replace />;
    }

    return (
        <form className="acceso" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h1>Ingresar</h1>
            {errors.root && <p className="error">{errors.root.message}</p>}
            <input type="email" placeholder="Email" aria-invalid={Boolean(errors.email)} {...register("email")} />
            <ErrorDeCampo mensaje={errors.email?.message} />
            <input type="password" placeholder="Contraseña" aria-invalid={Boolean(errors.password)} {...register("password")} />
            <ErrorDeCampo mensaje={errors.password?.message} />
            <button type="submit" disabled={isSubmitting}>Ingresar</button>
            <button type="button" onClick={ingresarConGithub}>Ingresar con GitHub</button>
            <p>¿No tenés cuenta? <Link to="/register">Registrate</Link></p>
        </form>
    );
}
