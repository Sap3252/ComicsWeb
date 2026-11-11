import { Link } from "react-router";
import { rutaConTags } from "../tags";

interface Props {
    tags: string[];
    // Tags que ya están en la búsqueda: al tocar uno nuevo se suma a estos
    filtro?: string[];
}

// Tags de un cómic: cada uno lleva a la lista filtrada por ese tag
export function Tags({ tags, filtro = [] }: Props) {
    if (tags.length === 0) return null;

    return (
        <p className="tags">
            {tags.map((tag) => (
                <Link
                    key={tag}
                    to={rutaConTags([...new Set([...filtro, tag])])}
                    className={filtro.includes(tag) ? "tag activo" : "tag"}
                >
                    #{tag}
                </Link>
            ))}
        </p>
    );
}
