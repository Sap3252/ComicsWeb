import { z } from "zod";

// Mismos mensajes que el backend (backend/src/schemas): el usuario ve lo mismo valide quien valide.
// Un input numérico vacío llega como NaN (valueAsNumber), así que también cuenta como "falta"
const errorDeTipo = (esperado: string) => ({
    error: (issue: { input: unknown }) =>
        issue.input === undefined || Number.isNaN(issue.input) ? "Es obligatorio" : `Tiene que ser ${esperado}`
});

export const texto = (maximo: number) =>
    z.string(errorDeTipo("un texto"))
        .trim()
        .min(1, "No puede estar vacío")
        .max(maximo, `No puede tener más de ${maximo} caracteres`);

export const enteroPositivo = z.number(errorDeTipo("un número"))
    .int("Tiene que ser un número entero")
    .min(1, "No puede ser menor a 1");

export const email = z.email("El email no es válido");
