import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import * as api from "../api/api";
import type { Comic } from "../api/api";
import { Comic3D } from "../components/Comic3D";
import { LeyendaEdicion } from "../components/LeyendaEdicion";
import { Tags } from "../components/Tags";

// Pública: un cómic con el visor 3D para ver portada y contraportada
export function ComicDetalle() {
    const { id } = useParams();
    const [comic, setComic] = useState<Comic | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        api.getComic(id).then(setComic).catch((e: Error) => setError(e.message));
    }, [id]);

    return (
        <>
            <p className="leyenda"><Link to="/">← Volver a la lista</Link></p>
            {error && <p className="error">{error}</p>}
            {!comic && !error && <p className="globo">Cargando...</p>}

            {comic && (
                <div className="detalle">
                    <Comic3D portada={comic.portada} contraportada={comic.contraportada} titulo={comic.titulo} />
                    <div className="vineta">
                        <LeyendaEdicion comic={comic} />
                        <h1>{comic.titulo}</h1>
                        <p>{comic.autor}</p>
                        <Tags tags={comic.tags} />
                        <p className="puntaje">Puntaje: <strong>{comic.votos.puntaje}</strong> (▲ {comic.votos.upvotes} / ▼ {comic.votos.downvotes})</p>
                        <p className="pista">Arrastrá el cómic para girarlo.</p>
                    </div>
                </div>
            )}
        </>
    );
}
