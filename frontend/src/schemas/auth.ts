import { z } from "zod";
import { email, texto } from "./campos";

// Límites de contraseña que exige Better Auth por defecto
export const LARGO_MINIMO_PASSWORD = 8;
const LARGO_MAXIMO_PASSWORD = 128;
const MAX_LARGO_NOMBRE = 80;

// En el login no se chequea el largo: una contraseña corta simplemente es incorrecta
export const loginSchema = z.object({
    email,
    password: z.string().min(1, "Es obligatoria")
});

export const registroSchema = z.object({
    nombre: texto(MAX_LARGO_NOMBRE),
    email,
    password: z.string()
        .min(LARGO_MINIMO_PASSWORD, `Tiene que tener al menos ${LARGO_MINIMO_PASSWORD} caracteres`)
        .max(LARGO_MAXIMO_PASSWORD, `No puede tener más de ${LARGO_MAXIMO_PASSWORD} caracteres`)
});

// Mismas reglas que el nombre del registro
export const nombreSchema = registroSchema.pick({ nombre: true });

export type LoginForm = z.infer<typeof loginSchema>;
export type RegistroForm = z.infer<typeof registroSchema>;
export type NombreForm = z.infer<typeof nombreSchema>;
