import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { mensajeDeError, signUp } from "../api/auth-client";
import { ErrorDeCampo } from "../components/ErrorDeCampo";
import { LARGO_MINIMO_PASSWORD, registroSchema, type RegistroForm } from "../schemas/auth";

// Pública. El rol lo asigna el backend: todo registro nuevo es "user"
export function Register() {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegistroForm>({
        resolver: zodResolver(registroSchema)
    });

    const onSubmit = async ({ nombre, email, password }: RegistroForm) => {
        const { error } = await signUp.email({ name: nombre, email, password });
        if (error) {
            setError("root", { message: mensajeDeError(error) });
            return;
        }
        navigate("/", { replace: true });
    };

    return (
        <form className="acceso" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h1>Registrarse</h1>
            {errors.root && <p className="error">{errors.root.message}</p>}
            <input placeholder="Nombre" aria-invalid={Boolean(errors.nombre)} {...register("nombre")} />
            <ErrorDeCampo mensaje={errors.nombre?.message} />
            <input type="email" placeholder="Email" aria-invalid={Boolean(errors.email)} {...register("email")} />
            <ErrorDeCampo mensaje={errors.email?.message} />
            <input
                type="password"
                placeholder={`Contraseña (mínimo ${LARGO_MINIMO_PASSWORD})`}
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
            />
            <ErrorDeCampo mensaje={errors.password?.message} />
            <button type="submit" disabled={isSubmitting}>Crear cuenta</button>
            <p>¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></p>
        </form>
    );
}
