import type { CSSProperties } from "react";
import { useGiro3D, type Rotacion } from "../hooks/useGiro3D";

interface Props {
    portada: string;
    contraportada?: string | undefined;
    titulo: string;
}

// Opacidad de la sombra sobre una cara que mira justo para atrás
const OSCURIDAD_MAX = 0.8;
// Cuánto recorre el reflejo de un borde al otro de la cara, en % del fondo
const RECORRIDO_REFLEJO = 45;

const rad = (grados: number) => (grados * Math.PI) / 180;

// Variables CSS de luz: cada cara se oscurece al alejarse de la cámara y el reflejo se corre con el giro
function iluminacion({ x, y }: Rotacion) {
    const cos = Math.cos(rad(y));
    return {
        "--luz-frente": (((1 - cos) / 2) * OSCURIDAD_MAX).toFixed(3),
        "--luz-dorso": (((1 + cos) / 2) * OSCURIDAD_MAX).toFixed(3),
        "--brillo": `${(50 + Math.sin(rad(y)) * RECORRIDO_REFLEJO + x).toFixed(1)}%`
    };
}

// La sombra en el piso se angosta cuando el cómic queda de canto
const anchoSombra = (y: number) => (0.06 + Math.abs(Math.cos(rad(y))) * 0.95).toFixed(3);

// Cómic "3D": se arrastra para girarlo y ver portada y contraportada
export function Comic3D({ portada, contraportada, titulo }: Props) {
    const { rot, muestraFrente, mostrarFrente, mostrarDorso, eventos } = useGiro3D();

    const estiloLibro = {
        transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        ...iluminacion(rot)
    } as CSSProperties;

    return (
        <div className="comic3d">
            <div
                className="escena"
                tabIndex={0}
                role="group"
                aria-roledescription="visor 3D"
                aria-label={`${titulo}. Arrastrá o usá las flechas para girarlo; Enter lo da vuelta.`}
                {...eventos}
            >
                <div className="libro" style={estiloLibro}>
                    <div className="cara frente">
                        <img src={portada} alt={titulo} draggable={false} />
                    </div>
                    {/* || y no ??: el admin guarda la contraportada vacía como "" */}
                    <div className="cara dorso">
                        <img src={contraportada || portada} alt={`${titulo} (contraportada)`} draggable={false} />
                    </div>
                    <div className="lomo" />
                    <div className="canto" />
                    <div className="arriba" />
                    <div className="abajo" />
                </div>
                <div className="piso" style={{ transform: `translateX(-50%) scaleX(${anchoSombra(rot.y)})` }} />
            </div>

            <div className="comic3d-botones">
                <button type="button" className={muestraFrente ? "activo" : ""} aria-pressed={muestraFrente} onClick={mostrarFrente}>
                    Portada
                </button>
                <button type="button" className={muestraFrente ? "" : "activo"} aria-pressed={!muestraFrente} onClick={mostrarDorso}>
                    Contraportada
                </button>
            </div>
        </div>
    );
}
