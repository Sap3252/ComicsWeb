import { useSearchParams } from "react-router";
import { ORDENES, TIPOS, type FiltrosCatalogo } from "../api/api";
import { leerTags } from "../tags";

// Los filtros viven en la URL (/?tipo=libro&orden=votos&tags=manga,dc): se pueden compartir y funciona "atrás"
export function useFiltrosCatalogo() {
    const [params, setParams] = useSearchParams();

    const filtros: FiltrosCatalogo = {
        tags: leerTags(params.get("tags") ?? ""),
        tipo: TIPOS.find((t) => t === params.get("tipo")),
        orden: ORDENES.find((o) => o === params.get("orden"))
    };

    // Lo que no viene en cambios se mantiene; pasar tipo u orden como undefined los quita
    const cambiarFiltros = (cambios: Partial<FiltrosCatalogo>) => {
        const { tags, tipo, orden } = { ...filtros, ...cambios };
        const nuevos: Record<string, string> = {};
        if (tipo) nuevos.tipo = tipo;
        if (orden) nuevos.orden = orden;
        if (tags.length > 0) nuevos.tags = tags.join(",");
        setParams(nuevos);
    };

    return { ...filtros, cambiarFiltros };
}
