import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import * as api from "../api/api";
import type { Comic, TipoVoto } from "../api/api";
import { ControlesCatalogo } from "../components/ControlesCatalogo";
import { TarjetaComic } from "../components/TarjetaComic";
import { useSession } from "../api/auth-client";
import { useFiltrosCatalogo } from "../hooks/useFiltrosCatalogo";
import { leerTags } from "../tags";

// Las portadas de la primera fila se piden enseguida; el resto, al acercarse a la pantalla
const PORTADAS_PRIORITARIAS = 4;

// Pública: cualquiera ve y busca cómics y libros; los usuarios logueados además votan
export function Home() {
    const { data: sesion, isPending } = useSession();
    const [comics, setComics] = useState<Comic[]>([]);
    const [cargando, setCargando] = useState(true);
    const [misVotos, setMisVotos] = useState<Record<string, TipoVoto | null>>({});
    const [error, setError] = useState("");
    const [busqueda, setBusqueda] = useState("");

    const { tags: filtro, tipo, orden, cambiarFiltros } = useFiltrosCatalogo();
    // Texto y no la lista: un array nuevo en cada render volvería a disparar el efecto
    const tagsEnUrl = filtro.join(",");

    useEffect(() => {
        // Si el filtro cambia antes de que llegue la respuesta, la respuesta vieja se descarta
        let vigente = true;
        api.getComics({ tags: filtro, tipo, orden })
            .then((lista) => vigente && setComics(lista))
            .catch((e: Error) => vigente && setError(e.message))
            .finally(() => vigente && setCargando(false));
        return () => {
            vigente = false;
        };
    }, [tagsEnUrl, tipo, orden]);

    const filtrar = (tags: string[]) => cambiarFiltros({ tags });

    const buscar = (e: FormEvent) => {
        e.preventDefault();
        filtrar([...new Set([...filtro, ...leerTags(busqueda)])]);
        setBusqueda("");
    };

    // Como en Reddit: votar lo mismo otra vez quita el voto
    const votar = async (comic: Comic, tipo: TipoVoto) => {
        if (!sesion) return;
        try {
            const r = misVotos[comic._id] === tipo
                ? await api.quitarVoto(comic._id)
                : await api.votar(comic._id, tipo);

            const { puntaje, upvotes, downvotes } = r;
            setComics((cs) => cs.map((c) => (c._id === r.comicId ? { ...c, votos: { puntaje, upvotes, downvotes } } : c)));
            setMisVotos((v) => ({ ...v, [r.comicId]: r.miVoto }));
        } catch (e) {
            setError((e as Error).message);
        }
    };

    return (
        <>
            <h1 className="titular">Catálogo</h1>
            {error && <p className="error">{error}</p>}
            {!isPending && !sesion && <p className="leyenda"><Link to="/login">Ingresá</Link> para votar.</p>}

            <ControlesCatalogo
                tipo={tipo}
                orden={orden}
                onTipo={(nuevo) => cambiarFiltros({ tipo: nuevo })}
                onOrden={(nuevo) => cambiarFiltros({ orden: nuevo })}
            />

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
                <p className="globo">{filtro.length > 0 || tipo ? "No hay nada con esos filtros." : "El catálogo está vacío."}</p>
            )}

            <div className="comics">
                {comics.map((comic, posicion) => (
                    <TarjetaComic
                        key={comic._id}
                        comic={comic}
                        filtro={filtro}
                        miVoto={misVotos[comic._id] ?? null}
                        puedeVotar={Boolean(sesion)}
                        portadaPrioritaria={posicion < PORTADAS_PRIORITARIAS}
                        onVotar={(tipo) => votar(comic, tipo)}
                    />
                ))}
            </div>
        </>
    );
}
