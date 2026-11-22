import { NOMBRE_TIPO, type Comic } from "../api/api";

// Cartucho con el tipo, la saga, el volumen y el año
export function LeyendaEdicion({ comic }: { comic: Comic }) {
    return <p className="leyenda">{NOMBRE_TIPO[comic.tipo]} · {comic.saga} · Vol. {comic.volumen} · {comic.año}</p>;
}
