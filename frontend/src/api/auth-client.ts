import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

// Sin baseURL: usa el mismo origen del frontend (/api/auth), que Vite o Render reenvían al backend
export const authClient = createAuthClient({ plugins: [adminClient()] });

export const { useSession, signIn, signUp, signOut } = authClient;

// Better Auth responde en inglés; se traducen los errores que puede ver el usuario
const MENSAJES_DE_ERROR: Record<string, string> = {
    INVALID_EMAIL_OR_PASSWORD: "Email o contraseña incorrectos",
    INVALID_EMAIL: "El email no es válido",
    PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 8 caracteres",
    USER_ALREADY_EXISTS: "El email ya está registrado",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "El email ya está registrado"
};

export function mensajeDeError(error: { code?: string | undefined; message?: string | undefined }): string {
    return (error.code && MENSAJES_DE_ERROR[error.code]) || error.message || "Ocurrió un error";
}
