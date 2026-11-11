import { Link } from "react-router";
import type { Comic, TipoVoto } from "../api/api";
import { LeyendaEdicion } from "./LeyendaEdicion";
import { Tags } from "./Tags";

interface Props {
    comic: Comic;
    // Tags que ya están en la búsqueda
    filtro: string[];
    miVoto: TipoVoto | null;
    puedeVotar: boolean;
    onVotar: (tipo: TipoVoto) => void;
}

// Viñeta de un cómic en la lista: portada, datos y la tira de votos al pie
export function TarjetaComic({ comic, filtro, miVoto, puedeVotar, onVotar }: Props) {
    const detalle = `/comic/${comic._id}`;

    return (
        <article className="comic">
            <Link to={detalle} className="comic-portada">
                <img src={comic.portada} alt={comic.titulo} />
            </Link>
            <div className="comic-info">
                <LeyendaEdicion comic={comic} />
                <h3><Link to={detalle}>{comic.titulo}</Link></h3>
                <p className="autor">{comic.autor}</p>
                <Tags tags={comic.tags} filtro={filtro} />
            </div>
            <div className="votos">
                {puedeVotar && (
                    <button aria-label="Votar a favor" className={miVoto === "up" ? "activo" : ""} onClick={() => onVotar("up")}>▲</button>
                )}
                <strong>{comic.votos.puntaje}</strong>
                {puedeVotar && (
                    <button aria-label="Votar en contra" className={miVoto === "down" ? "activo contra" : ""} onClick={() => onVotar("down")}>▼</button>
                )}
            </div>
        </article>
    );
}
