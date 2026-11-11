import { useState, type KeyboardEvent } from "react";
import { leerTags } from "../tags";

interface Props {
    // Tags que ya usan otros cómics
    existentes: string[];
    seleccionados: string[];
    onChange: (tags: string[]) => void;
}

// Elige los tags de un cómic: se marcan los que ya existen o se escriben nuevos
export function SelectorTags({ existentes, seleccionados, onChange }: Props) {
    const [nuevo, setNuevo] = useState("");

    // Los nuevos todavía no existen en ningún cómic: se muestran junto a los demás, ya marcados
    const opciones = [...new Set([...existentes, ...seleccionados])].sort();

    const alternar = (tag: string) =>
        onChange(seleccionados.includes(tag) ? seleccionados.filter((t) => t !== tag) : [...seleccionados, tag]);

    // Acá los tags se separan solo con comas: "ciencia ficción" es un único tag, "ciencia-ficcion"
    const agregarNuevo = () => {
        const nuevos = nuevo.split(",").flatMap((parte) => leerTags(parte.trim().replace(/\s+/g, "-")));
        onChange([...new Set([...seleccionados, ...nuevos])]);
        setNuevo("");
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        e.preventDefault(); // Enter agrega el tag en vez de enviar el formulario
        agregarNuevo();
    };

    return (
        <fieldset className="selector-tags">
            <legend>Tags (opcional)</legend>
            <div className="tags">
                {opciones.map((tag) => {
                    const marcado = seleccionados.includes(tag);
                    return (
                        <button
                            key={tag}
                            type="button"
                            className={marcado ? "tag activo" : "tag"}
                            aria-pressed={marcado}
                            onClick={() => alternar(tag)}
                        >
                            #{tag}
                        </button>
                    );
                })}
            </div>
            <div className="nuevo-tag">
                {/* onBlur: si se escribió un tag y se fue directo a "Guardar", no se pierde */}
                <input
                    aria-label="Nuevo tag"
                    placeholder="Nuevo tag"
                    value={nuevo}
                    onChange={(e) => setNuevo(e.target.value)}
                    onKeyDown={onKeyDown}
                    onBlur={agregarNuevo}
                />
                <button type="button" onClick={agregarNuevo}>Agregar tag</button>
            </div>
        </fieldset>
    );
}
