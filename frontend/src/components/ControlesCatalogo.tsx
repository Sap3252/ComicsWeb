import { NOMBRE_ORDEN, ORDENES, TIPOS, type Orden, type Tipo } from "../api/api";

const ETIQUETA_TIPO: Record<Tipo, string> = { comic: "Cómics", libro: "Libros" };

interface Props {
    tipo: Tipo | undefined;
    orden: Orden | undefined;
    onTipo: (tipo: Tipo | undefined) => void;
    onOrden: (orden: Orden | undefined) => void;
}

// Filtro por tipo y orden del listado
export function ControlesCatalogo({ tipo, orden, onTipo, onOrden }: Props) {
    return (
        <div className="acciones controles-catalogo">
            <button className={tipo ? "" : "activo"} onClick={() => onTipo(undefined)}>Todo</button>
            {TIPOS.map((t) => (
                <button key={t} className={tipo === t ? "activo" : ""} onClick={() => onTipo(t)}>
                    {ETIQUETA_TIPO[t]}
                </button>
            ))}
            <label className="orden">
                Ordenar por
                <select value={orden ?? ""} onChange={(e) => onOrden(ORDENES.find((o) => o === e.target.value))}>
                    <option value="">Sin ordenar</option>
                    {ORDENES.map((o) => <option key={o} value={o}>{NOMBRE_ORDEN[o]}</option>)}
                </select>
            </label>
        </div>
    );
}
