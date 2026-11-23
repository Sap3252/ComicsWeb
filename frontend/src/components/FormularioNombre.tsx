import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mensajeDeError, updateUser } from "../api/auth-client";
import { nombreSchema, type NombreForm } from "../schemas/auth";
import { ErrorDeCampo } from "./ErrorDeCampo";

// Al guardar, Better Auth vuelve a pedir la sesión: el nombre se actualiza solo en el perfil y en el nav
export function FormularioNombre({ nombreActual }: { nombreActual: string }) {
    const [mensaje, setMensaje] = useState("");
    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting, isDirty } } = useForm<NombreForm>({
        resolver: zodResolver(nombreSchema),
        defaultValues: { nombre: nombreActual }
    });

    const onSubmit = async ({ nombre }: NombreForm) => {
        setMensaje("");
        const { error } = await updateUser({ name: nombre });
        if (error) {
            setError("root", { message: mensajeDeError(error) });
            return;
        }
        reset({ nombre });
        setMensaje("Nombre actualizado");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2>Cambiar nombre</h2>
            {mensaje && <p className="ok">{mensaje}</p>}
            {errors.root && <p className="error">{errors.root.message}</p>}
            <label>
                Nombre
                <input aria-invalid={Boolean(errors.nombre)} {...register("nombre")} />
                <ErrorDeCampo mensaje={errors.nombre?.message} />
            </label>
            <button type="submit" disabled={isSubmitting || !isDirty}>Guardar</button>
        </form>
    );
}
