import { useEffect, useState, type FormEvent } from "react";
import * as api from "../api/api";
import type { Comic, ComicInput } from "../api/api";
import { useAuth } from "../context/AuthContext";

const VACIO: ComicInput = { titulo: "", año: new Date().getFullYear(), volumen: 1, autor: "", saga: "", portada: "" };

const CAMPOS: { name: keyof ComicInput; label: string; type: "text" | "number" }[] = [
    { name: "titulo", label: "Título", type: "text" },
    { name: "saga", label: "Saga", type: "text" },
    { name: "volumen", label: "Volumen", type: "number" },
    { name: "autor", label: "Autor", type: "text" },
    { name: "año", label: "Año", type: "number" },
    { name: "portada", label: "URL de la portada", type: "text" }
];

// Protegida por rol: solo admin. Alta, edición y baja de cómics
export function Admin() {
    const { token } = useAuth();
    const [comics, setComics] = useState<Comic[]>([]);
    const [form, setForm] = useState<ComicInput>(VACIO);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

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
        const { titulo, año, volumen, autor, saga, portada } = comic;
        setEditandoId(comic._id);
        setForm({ titulo, año, volumen, autor, saga, portada });
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
            <h1>Administrar cómics</h1>
            {mensaje && <p className="ok">{mensaje}</p>}
            {error && <p className="error">{error}</p>}

            <form onSubmit={onSubmit}>
                <h2>{editandoId ? "Editar cómic" : "Nuevo cómic"}</h2>
                {CAMPOS.map(({ name, label, type }) => (
                    <label key={name}>
                        {label}
                        <input
                            type={type}
                            placeholder={label}
                            value={form[name]}
                            onChange={(e) => setForm({ ...form, [name]: type === "number" ? Number(e.target.value) : e.target.value })}
                            required
                        />
                    </label>
                ))}
                <button type="submit">{editandoId ? "Guardar cambios" : "Agregar"}</button>
                {editandoId && <button type="button" onClick={cancelar}>Cancelar</button>}
            </form>

            <h2>Cómics cargados</h2>
            <table>
                <tbody>
                    {comics.map((comic) => (
                        <tr key={comic._id}>
                            <td>{comic.titulo} (Vol. {comic.volumen})</td>
                            <td>Puntaje: {comic.votos.puntaje}</td>
                            <td>
                                <button onClick={() => editar(comic)}>Editar</button>
                                <button onClick={() => eliminar(comic)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
