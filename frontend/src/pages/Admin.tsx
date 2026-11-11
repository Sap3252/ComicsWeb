import { useEffect, useState, type FormEvent } from "react";
import * as api from "../api/api";
import type { Comic, ComicInput } from "../api/api";
import { SelectorTags } from "../components/SelectorTags";
import { useAuth } from "../context/AuthContext";
import { escribirTags } from "../tags";

const VACIO: ComicInput = { titulo: "", año: new Date().getFullYear(), volumen: 1, autor: "", saga: "", portada: "", contraportada: "", tags: [] };

// Los tags no están acá: se eligen con SelectorTags
const CAMPOS: { name: Exclude<keyof ComicInput, "tags">; label: string; type: "text" | "number"; opcional?: boolean }[] = [
    { name: "titulo", label: "Título", type: "text" },
    { name: "saga", label: "Saga", type: "text" },
    { name: "volumen", label: "Volumen", type: "number" },
    { name: "autor", label: "Autor", type: "text" },
    { name: "año", label: "Año", type: "number" },
    { name: "portada", label: "URL de la portada", type: "text" },
    { name: "contraportada", label: "URL de la contraportada", type: "text", opcional: true }
];

// Protegida por rol: solo admin. Alta, edición y baja de cómics
export function Admin() {
    const { token } = useAuth();
    const [comics, setComics] = useState<Comic[]>([]);
    const [form, setForm] = useState<ComicInput>(VACIO);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const tagsExistentes = [...new Set(comics.flatMap((comic) => comic.tags))];

    const cargar = () => api.getComics().then(setComics).catch((e: Error) => setError(e.message));

    useEffect(() => {
        cargar();
    }, []);

    const ejecutar = async (accion: () => Promise<unknown>, ok: string) => {
        setError("");
        setMensaje("");
        try {
            await accion();
            setMensaje(ok);
            await cargar();
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const editar = (comic: Comic) => {
        const { titulo, año, volumen, autor, saga, portada, tags } = comic;
        setEditandoId(comic._id);
        setForm({ titulo, año, volumen, autor, saga, portada, contraportada: comic.contraportada ?? "", tags });
    };

    const cancelar = () => {
        setEditandoId(null);
        setForm(VACIO);
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!token) return;
        const id = editandoId;
        ejecutar(async () => {
            if (id) await api.editarComic(id, form, token);
            else await api.crearComic(form, token);
            cancelar();
        }, id ? "Cómic actualizado" : "Cómic creado");
    };

    const eliminar = (comic: Comic) => {
        if (!token || !confirm(`¿Eliminar "${comic.titulo}"?`)) return;
        ejecutar(() => api.eliminarComic(comic._id, token), "Cómic eliminado");
    };

    return (
        <>
            <h1 className="titular">Administrar cómics</h1>
            {mensaje && <p className="ok">{mensaje}</p>}
            {error && <p className="error">{error}</p>}

            <form onSubmit={onSubmit}>
                <h2>{editandoId ? "Editar cómic" : "Nuevo cómic"}</h2>
                {CAMPOS.map(({ name, label, type, opcional }) => (
                    <label key={name}>
                        {opcional ? `${label} (opcional)` : label}
                        <input
                            type={type}
                            placeholder={label}
                            value={form[name] ?? ""}
                            onChange={(e) => setForm({ ...form, [name]: type === "number" ? Number(e.target.value) : e.target.value })}
                            required={!opcional}
                        />
                    </label>
                ))}
                <SelectorTags existentes={tagsExistentes} seleccionados={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
                <div className="acciones">
                    <button type="submit">{editandoId ? "Guardar cambios" : "Agregar"}</button>
                    {editandoId && <button type="button" onClick={cancelar}>Cancelar</button>}
                </div>
            </form>

            <h2 className="subtitulo">Cómics cargados</h2>
            <div className="tabla">
                <table>
                    <tbody>
                        {comics.map((comic) => (
                            <tr key={comic._id}>
                                <td>{comic.titulo} (Vol. {comic.volumen})</td>
                                <td>{escribirTags(comic.tags)}</td>
                                <td>Puntaje: {comic.votos.puntaje}</td>
                                <td>
                                    <button onClick={() => editar(comic)}>Editar</button>
                                    <button className="peligro" onClick={() => eliminar(comic)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
