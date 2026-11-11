// Acentos y diéresis, pero no la virgulilla: la ñ se conserva
const ACENTOS = /[̀-̂̄-ͯ]/g;

// Misma normalización que hace el backend al guardar (src/utils/tags.ts), para mostrar el tag como va a quedar
const normalizarTag = (tag: string) =>
    tag
        .normalize("NFD").replace(ACENTOS, "").normalize("NFC")
        .toLowerCase()
        .replace(/^#+/, "")
        .replace(/[^a-z0-9ñ-]/g, "");

// "#Manga, #dc" -> ["manga", "dc"]
export function leerTags(texto: string): string[] {
    const tags = texto
        .split(/[\s,]+/)
        .map(normalizarTag)
        .filter((tag) => tag !== "");

    return [...new Set(tags)];
}

export const escribirTags = (tags: string[]) => tags.map((tag) => `#${tag}`).join(" ");

// Enlace a la lista de cómics filtrada por esos tags
export const rutaConTags = (tags: string[]) =>
    tags.length > 0 ? `/?tags=${encodeURIComponent(tags.join(","))}` : "/";
