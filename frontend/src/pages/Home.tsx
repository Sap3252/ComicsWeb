import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import * as api from "../api/api";
import type { Comic, TipoVoto } from "../api/api";
import { Tags } from "../components/Tags";
import { useAuth } from "../context/AuthContext";
import { leerTags } from "../tags";

// Pública: cualquiera ve los cómics y los busca por tags; los usuarios logueados además pueden votar
export function Home() {
    const { token } = useAuth();
    const [comics, setComics] = useState<Comic[]>([]);
    const [misVotos, setMisVotos] = useState<Record<string, TipoVoto | null>>({});
    const [error, setError] = useState("");
    const [busqueda, setBusqueda] = useState("");

    // El filtro vive en la URL (/?tags=manga,dc): se puede compartir y funciona el botón "atrás"
    const [params, setParams] = useSearchParams();
    const tagsEnUrl = params.get("tags") ?? "";
    const filtro = leerTags(tagsEnUrl);

    useEffect(() => {
        // Si el filtro cambia antes de que llegue la respuesta, la respuesta vieja se descarta
        let vigente = true;
        api.getComics(leerTags(tagsEnUrl))
            .then((lista) => vigente && setComics(lista))
            .catch((e: Error) => vigente && setError(e.message));
        return () => {
            vigente = false;
        };
    }, [tagsEnUrl]);

    const filtrar = (tags: string[]) => setParams(tags.length > 0 ? { tags: tags.join(",") } : {});

    const buscar = (e: FormEvent) => {
        e.preventDefault();
        filtrar([...new Set([...filtro, ...leerTags(busqueda)])]);
        setBusqueda("");
    };

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

            <form className="buscador" onSubmit={buscar}>
                <input
                    aria-label="Buscar por tags"
                    placeholder="Buscar por tags: #manga #aventura"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button type="submit">Buscar</button>
            </form>

            {filtro.length > 0 && (
                <p className="tags">
                    Con todos estos tags:
                    {filtro.map((tag) => (
                        <button
                            key={tag}
                            className="tag activo"
                            aria-label={`Quitar el tag ${tag}`}
                            onClick={() => filtrar(filtro.filter((t) => t !== tag))}
                        >
                            #{tag} ✕
                        </button>
                    ))}
                    <button onClick={() => filtrar([])}>Limpiar</button>
                </p>
            )}

            {comics.length === 0 && !error && (
                <p>{filtro.length > 0 ? "Ningún cómic tiene esos tags." : "No hay cómics cargados."}</p>
            )}

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
                    <Link to={`/comic/${comic._id}`}>
                        <img src={comic.portada} alt={comic.titulo} />
                    </Link>
                    <div>
                        <h3><Link to={`/comic/${comic._id}`}>{comic.titulo}</Link></h3>
                        <p>{comic.saga} - Vol. {comic.volumen} ({comic.año})</p>
                        <p>{comic.autor}</p>
                        <Tags tags={comic.tags} filtro={filtro} />
                    </div>
                </div>
            ))}
        </>
    );
}
