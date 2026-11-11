import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import * as api from "../api/api";
import type { Comic, TipoVoto } from "../api/api";
import { TarjetaComic } from "../components/TarjetaComic";
import { useAuth } from "../context/AuthContext";
import { leerTags } from "../tags";

// Las portadas de la primera fila se piden enseguida; el resto, al acercarse a la pantalla
const PORTADAS_PRIORITARIAS = 4;

// Pública: cualquiera ve los cómics y los busca por tags; los usuarios logueados además pueden votar
export function Home() {
    const { token } = useAuth();
    const [comics, setComics] = useState<Comic[]>([]);
    const [cargando, setCargando] = useState(true);
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
            .catch((e: Error) => vigente && setError(e.message))
            .finally(() => vigente && setCargando(false));
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
            <h1 className="titular">Cómics</h1>
            {error && <p className="error">{error}</p>}
            {!token && <p className="leyenda"><Link to="/login">Ingresá</Link> para votar.</p>}

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
                <p className="tags filtro">
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

            {!cargando && comics.length === 0 && !error && (
                <p className="globo">{filtro.length > 0 ? "Ningún cómic tiene esos tags." : "No hay cómics cargados."}</p>
            )}

            <div className="comics">
                {comics.map((comic, posicion) => (
                    <TarjetaComic
                        key={comic._id}
                        comic={comic}
                        filtro={filtro}
                        miVoto={misVotos[comic._id] ?? null}
                        puedeVotar={token !== null}
                        portadaPrioritaria={posicion < PORTADAS_PRIORITARIAS}
                        onVotar={(tipo) => votar(comic, tipo)}
                    />
                ))}
            </div>
        </>
    );
}
