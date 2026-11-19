export type Tema = "claro" | "oscuro";

const STORAGE_KEY = "tema";

// El tema elegido a mano o, si nunca se eligió, el que pide el sistema
export function temaInicial(): Tema {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado === "claro" || guardado === "oscuro") return guardado;
    return matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "oscuro";
}

// Los colores de cada tema están en index.css, en :root[data-tema="..."]
export function aplicarTema(tema: Tema) {
    document.documentElement.dataset.tema = tema;
}

export const guardarTema = (tema: Tema) => localStorage.setItem(STORAGE_KEY, tema);
