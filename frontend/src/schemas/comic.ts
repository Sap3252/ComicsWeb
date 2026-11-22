import { z } from "zod";
import { TIPOS } from "../api/api";
import { enteroPositivo, texto } from "./campos";

// Los límites son los del backend (backend/src/schemas/comic.schema.ts)
const MAX_LARGO_TEXTO = 80;
const MAX_LARGO_URL = 500;
const MAX_TAGS = 10;
const MAX_LARGO_TAG = 30;

const urlDeImagen = texto(MAX_LARGO_URL)
    .pipe(z.url({ protocol: /^https?$/, error: "Tiene que ser una URL que empiece con http:// o https://" }));

export const comicSchema = z.object({
    tipo: z.enum(TIPOS, "Tiene que ser cómic o libro"),
    titulo: texto(MAX_LARGO_TEXTO),
    año: enteroPositivo,
    volumen: enteroPositivo,
    autor: texto(MAX_LARGO_TEXTO),
    saga: texto(MAX_LARGO_TEXTO),
    portada: urlDeImagen,
    // "" = sin contraportada
    contraportada: urlDeImagen.or(z.literal("")),
    // Se valida la lista entera: el error queda en un solo lugar
    tags: z.array(z.string())
        .max(MAX_TAGS, `No puede tener más de ${MAX_TAGS} tags`)
        .refine((tags) => tags.every((tag) => tag.length <= MAX_LARGO_TAG), `Cada tag puede tener hasta ${MAX_LARGO_TAG} caracteres`)
});

export type ComicForm = z.infer<typeof comicSchema>;
