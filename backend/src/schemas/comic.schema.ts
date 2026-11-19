import { z } from 'zod';
import { MAX_LARGO_TAG, MAX_TAGS } from '../utils/tags.js';

const MAX_LARGO_TEXTO = 80;
const MAX_LARGO_URL = 500;

// El error de tipo distingue el campo que falta del que vino con otro tipo
const errorDeTipo = (esperado: string) => ({
    error: (issue: { input: unknown }) =>
        issue.input === undefined ? 'Es obligatorio' : `Tiene que ser ${esperado}`
});

const texto = (maximo: number) =>
    z.string(errorDeTipo('un texto'))
        .trim()
        .min(1, 'No puede estar vacío')
        .max(maximo, `No puede tener más de ${maximo} caracteres`);

const enteroPositivo = z.number(errorDeTipo('un número'))
    .int('Tiene que ser un número entero')
    .min(1, 'No puede ser menor a 1');

const urlDeImagen = texto(MAX_LARGO_URL)
    .pipe(z.url({ protocol: /^https?$/, error: 'Tiene que ser una URL que empiece con http:// o https://' }));

// Sin "activo": la baja se hace solo con DELETE. Los campos que no están acá se descartan
export const comicSchema = z.object({
    titulo: texto(MAX_LARGO_TEXTO),
    año: enteroPositivo,
    volumen: enteroPositivo,
    autor: texto(MAX_LARGO_TEXTO),
    saga: texto(MAX_LARGO_TEXTO),
    portada: urlDeImagen,
    // "" = sin contraportada (el visor 3D repite la portada); es lo que manda el admin con el campo vacío
    contraportada: urlDeImagen.or(z.literal('')).default(''),
    // La normalización (sin #, minúsculas, sin acentos) la hace el modelo
    tags: z.array(
        z.string(errorDeTipo('un texto')).max(MAX_LARGO_TAG, `Cada tag puede tener hasta ${MAX_LARGO_TAG} caracteres`),
        errorDeTipo('una lista')
    )
        .max(MAX_TAGS, `No puede tener más de ${MAX_TAGS} tags`)
        .default([])
}, 'El body tiene que ser un objeto JSON');

export type ComicInput = z.infer<typeof comicSchema>;
