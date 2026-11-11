export const MAX_TAGS = 10;
export const MAX_LARGO_TAG = 30;

// Acentos y diéresis, pero no la virgulilla: la ñ se conserva
const ACENTOS = /[̀-̂̄-ͯ]/g;

// "#Ciencia Ficción" -> "ciencia-ficcion"
export function normalizarTag(tag: string): string {
    return tag
        .normalize('NFD').replace(ACENTOS, '').normalize('NFC')
        .toLowerCase()
        .trim()
        .replace(/^#+/, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9ñ-]/g, '');
}

// Acepta una lista o un texto como "#manga, #dc" y devuelve los tags normalizados, sin vacíos ni repetidos
export function normalizarTags(valor: unknown): string[] {
    let partes: unknown[] = [];

    if (Array.isArray(valor)) {
        partes = valor;
    } else if (typeof valor === 'string') {
        partes = valor.split(/[,\s]+/);
    }

    const tags = partes
        .filter((parte) => typeof parte === 'string')
        .map(normalizarTag)
        .filter((tag) => tag !== '');

    return [...new Set(tags)];
}
