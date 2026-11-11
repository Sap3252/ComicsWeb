import type { Comic } from "../api/api";

// Cartucho con la saga, el volumen y el año de un cómic
export function LeyendaEdicion({ comic }: { comic: Comic }) {
    return <p className="leyenda">{comic.saga} · Vol. {comic.volumen} · {comic.año}</p>;
}
