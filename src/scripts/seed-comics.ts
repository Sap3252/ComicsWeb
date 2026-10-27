// Carga en la base un catálogo de cómics conocidos, o los actualiza si ya están
// (se identifican por saga + volumen, así que se puede correr varias veces).
// Las URLs de las portadas se buscan en Wikipedia al correr el script: necesita internet.
// Uso: npm run seed                -> guarda los cómics en la base
//      npm run seed -- --dry-run   -> solo muestra lo que encontró, sin tocar la base
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Comic, { type IComic } from "../models/comics.js";

const WIKIPEDIA = "https://en.wikipedia.org/w/api.php";
const WIKI_DEATH_NOTE = "https://deathnote.fandom.com/api.php";
// Wikimedia pide que los scripts que usan su API se identifiquen
const USER_AGENT = "ComicsWeb-seed/1.0 (https://github.com/sap3252/comicsweb)";

// Imagen alojada en una wiki (MediaWiki): la imagen principal de un artículo o un archivo puntual
type Imagen = { api: string; articulo: string } | { api: string; archivo: string };

type ComicSeed = Omit<IComic, "portada" | "contraportada" | "activo"> & {
    portada: Imagen;
    contraportada?: Imagen;
};

// En los artículos de Wikipedia sobre un cómic, la imagen principal es su portada
const wikipedia = (articulo: string): Imagen => ({ api: WIKIPEDIA, articulo });

// año: primera publicación de ese volumen o historia
const COMICS: ComicSeed[] = [
    { saga: "Las aventuras de Tintín", volumen: 1, titulo: "Tintín en el país de los soviets", año: 1930, autor: "Hergé", portada: wikipedia("Tintin in the Land of the Soviets") },
    { saga: "Las aventuras de Tintín", volumen: 2, titulo: "Tintín en el Congo", año: 1931, autor: "Hergé", portada: wikipedia("Tintin in the Congo") },
    { saga: "Las aventuras de Tintín", volumen: 3, titulo: "Tintín en América", año: 1932, autor: "Hergé", portada: wikipedia("Tintin in America") },
    { saga: "Las aventuras de Tintín", volumen: 4, titulo: "Los cigarros del faraón", año: 1934, autor: "Hergé", portada: wikipedia("Cigars of the Pharaoh") },
    { saga: "Las aventuras de Tintín", volumen: 5, titulo: "El loto azul", año: 1936, autor: "Hergé", portada: wikipedia("The Blue Lotus") },

    { saga: "Astérix", volumen: 1, titulo: "Astérix el galo", año: 1961, autor: "René Goscinny y Albert Uderzo", portada: wikipedia("Asterix the Gaul") },
    { saga: "Astérix", volumen: 2, titulo: "La hoz de oro", año: 1962, autor: "René Goscinny y Albert Uderzo", portada: wikipedia("Asterix and the Golden Sickle") },
    { saga: "Astérix", volumen: 3, titulo: "Astérix y los godos", año: 1963, autor: "René Goscinny y Albert Uderzo", portada: wikipedia("Asterix and the Goths") },
    { saga: "Astérix", volumen: 4, titulo: "Astérix gladiador", año: 1964, autor: "René Goscinny y Albert Uderzo", portada: wikipedia("Asterix the Gladiator") },
    { saga: "Astérix", volumen: 5, titulo: "La vuelta a la Galia", año: 1965, autor: "René Goscinny y Albert Uderzo", portada: wikipedia("Asterix and the Banquet") },

    { saga: "Dragon Ball", volumen: 1, titulo: "Son Goku y sus amigos", año: 1985, autor: "Akira Toriyama", portada: wikipedia("Dragon Ball (manga)") },
    { saga: "Akira", volumen: 1, titulo: "Akira", año: 1984, autor: "Katsuhiro Otomo", portada: wikipedia("Akira (manga)") },
    {
        saga: "One Piece", volumen: 1, titulo: "Romance Dawn", año: 1997, autor: "Eiichiro Oda",
        // La imagen principal del artículo es la del tomo 61
        portada: { api: WIKIPEDIA, archivo: "One Piece, Volume 1.jpg" }
    },
    { saga: "Naruto", volumen: 1, titulo: "Uzumaki Naruto", año: 2000, autor: "Masashi Kishimoto", portada: wikipedia("Naruto") },
    {
        saga: "Death Note", volumen: 1, titulo: "Aburrimiento", año: 2004, autor: "Tsugumi Ohba y Takeshi Obata",
        portada: wikipedia("Death Note"),
        // Contraportada de la edición de Norma Editorial
        contraportada: { api: WIKI_DEATH_NOTE, archivo: "Vol01 Spanish Norma Editorial back cover.jpg" }
    },

    { saga: "Watchmen", volumen: 1, titulo: "Watchmen", año: 1986, autor: "Alan Moore y Dave Gibbons", portada: wikipedia("Watchmen") },
    { saga: "Batman: El regreso del Caballero Oscuro", volumen: 1, titulo: "El regreso del Caballero Oscuro", año: 1986, autor: "Frank Miller", portada: wikipedia("The Dark Knight Returns") },
    { saga: "Batman: Año Uno", volumen: 1, titulo: "Año Uno", año: 1987, autor: "Frank Miller y David Mazzucchelli", portada: wikipedia("Batman: Year One") },
    { saga: "Batman: La broma asesina", volumen: 1, titulo: "La broma asesina", año: 1988, autor: "Alan Moore y Brian Bolland", portada: wikipedia("Batman: The Killing Joke") },
    { saga: "V de Vendetta", volumen: 1, titulo: "V de Vendetta", año: 1982, autor: "Alan Moore y David Lloyd", portada: wikipedia("V for Vendetta") },
    { saga: "The Sandman", volumen: 1, titulo: "Preludios y nocturnos", año: 1989, autor: "Neil Gaiman", portada: wikipedia("The Sandman: Preludes & Nocturnes") },
    { saga: "Maus", volumen: 1, titulo: "Mi padre sangra historia", año: 1986, autor: "Art Spiegelman", portada: wikipedia("Maus") },
    { saga: "Persépolis", volumen: 1, titulo: "Persépolis", año: 2000, autor: "Marjane Satrapi", portada: wikipedia("Persepolis (comics)") },

    { saga: "Action Comics", volumen: 1, titulo: "Superman", año: 1938, autor: "Jerry Siegel y Joe Shuster", portada: wikipedia("Action Comics 1") },
    { saga: "Detective Comics", volumen: 27, titulo: "El caso del sindicato químico", año: 1939, autor: "Bill Finger y Bob Kane", portada: wikipedia("Detective Comics 27") },
    {
        saga: "Amazing Fantasy", volumen: 15, titulo: "Spider-Man", año: 1962, autor: "Stan Lee y Steve Ditko",
        // La imagen principal del artículo es la del #7
        portada: { api: WIKIPEDIA, archivo: "Amazing Fantasy 15.jpg" }
    },

    { saga: "El Eternauta", volumen: 1, titulo: "El Eternauta", año: 1957, autor: "Héctor Germán Oesterheld y Francisco Solano López", portada: wikipedia("The Eternaut") }
];

interface RespuestaWiki {
    query?: {
        pages?: {
            original?: { source: string };
            imageinfo?: { url: string }[];
        }[];
    };
}

// Devuelve la URL directa de la imagen, o null si la wiki no la tiene
async function buscarImagen(imagen: Imagen): Promise<string | null> {
    const params = new URLSearchParams({ action: "query", format: "json", formatversion: "2", redirects: "1" });

    if ("articulo" in imagen) {
        params.set("titles", imagen.articulo);
        params.set("prop", "pageimages");
        params.set("piprop", "original");
        // Las portadas no son imágenes libres: sin esto la API no las devuelve
        params.set("pilicense", "any");
    } else {
        params.set("titles", `File:${imagen.archivo}`);
        params.set("prop", "imageinfo");
        params.set("iiprop", "url");
    }

    const res = await fetch(`${imagen.api}?${params}`, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) throw new Error(`${new URL(imagen.api).host} respondió ${res.status}`);

    const data = (await res.json()) as RespuestaWiki;
    const pagina = data.query?.pages?.[0];
    const url = pagina?.original?.source ?? pagina?.imageinfo?.[0]?.url;
    return url ? sinSeguimiento(url) : null;
}

// Wikipedia agrega parámetros utm_* a las URLs; no hacen falta para mostrar la imagen
function sinSeguimiento(url: string): string {
    const u = new URL(url);
    for (const clave of [...u.searchParams.keys()]) {
        if (clave.startsWith("utm_")) u.searchParams.delete(clave);
    }
    return u.toString();
}

const dryRun = process.argv.includes("--dry-run");
if (!dryRun) await connectDB();

const fallidos: string[] = [];
let encontrados = 0;

for (const { portada, contraportada, ...datos } of COMICS) {
    const nombre = `${datos.saga} #${datos.volumen}: ${datos.titulo}`;

    try {
        const urlPortada = await buscarImagen(portada);
        if (!urlPortada) {
            fallidos.push(`${nombre} (no se encontró la portada)`);
            continue;
        }
        const urlContraportada = contraportada ? await buscarImagen(contraportada) : null;

        console.log(`✔ ${nombre}\n    portada:       ${urlPortada}`);
        if (urlContraportada) console.log(`    contraportada: ${urlContraportada}`);
        encontrados++;

        if (dryRun) continue;
        await Comic.updateOne(
            { saga: datos.saga, volumen: datos.volumen },
            { $set: { ...datos, portada: urlPortada, ...(urlContraportada ? { contraportada: urlContraportada } : {}) } },
            { upsert: true, runValidators: true }
        );
    } catch (error) {
        fallidos.push(`${nombre} (${error instanceof Error ? error.message : error})`);
    }
}

console.log(`\n${encontrados} de ${COMICS.length} cómics con portada${dryRun ? " (--dry-run: no se guardó nada)" : " guardados en la base"}`);
if (fallidos.length > 0) {
    console.log("No se cargaron:");
    for (const f of fallidos) console.log(`  - ${f}`);
}

if (!dryRun) await mongoose.disconnect();
