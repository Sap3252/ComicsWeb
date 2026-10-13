import { useEffect, useState } from "react";
import { Link } from "react-router";
import * as api from "../api/api";
import type { Comic, TipoVoto } from "../api/api";
import { useAuth } from "../context/AuthContext";

// Pública: cualquiera ve los cómics; los usuarios logueados además pueden votar
export function Home() {
    const { token } = useAuth();
    const [comics, setComics] = useState<Comic[]>([]);
    const [misVotos, setMisVotos] = useState<Record<string, TipoVoto | null>>({});
    const [error, setError] = useState("");

    useEffect(() => {
        api.getComics().then(setComics).catch((e: Error) => setError(e.message));
    }, []);

    // Como en Reddit: votar lo mismo otra vez quita el voto
    const votar = async (comic: Comic, tipo: TipoVoto) => {
        if (!token) return;
        try {
            const r = misVotos[comic._id] === tipo
                ? await api.quitarVoto(comic._id, token)
                : await api.votar(comic._id, tipo, token);

            const { puntaje, upvotes, downvotes } = r;
            setComics((cs) => cs.map((c) => (c._id === r.comicId ? { ...c, votos: { puntaje, upvotes, downvotes } } : c)));
            setMisVotos((v) => ({ ...v, [r.comicId]: r.miVoto }));
        } catch (e) {
            setError((e as Error).message);
        }
    };

    return (
        <>
            <h1>Cómics</h1>
            {error && <p className="error">{error}</p>}
            {!token && <p><Link to="/login">Ingresá</Link> para votar.</p>}
            {comics.length === 0 && !error && <p>No hay cómics cargados.</p>}

            {comics.map((comic) => (
                <div key={comic._id} className="comic">
                    <div className="votos">
                        {token && (
                            <button className={misVotos[comic._id] === "up" ? "activo" : ""} onClick={() => votar(comic, "up")}>▲</button>
                        )}
                        <strong>{comic.votos.puntaje}</strong>
                        {token && (
                            <button className={misVotos[comic._id] === "down" ? "activo" : ""} onClick={() => votar(comic, "down")}>▼</button>
                        )}
                    </div>
                    <img src={comic.portada} alt={comic.titulo} />
                    <div>
                        <h3>{comic.titulo}</h3>
                        <p>{comic.saga} - Vol. {comic.volumen} ({comic.año})</p>
                        <p>{comic.autor}</p>
                    </div>
                </div>
            ))}
        </>
    );
}
