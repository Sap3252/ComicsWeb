import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

export interface Rotacion {
    x: number;
    y: number;
}

interface Arrastre {
    inicioX: number; // posición del puntero al empezar
    inicioY: number;
    rotInicial: Rotacion;
    ultimoT: number; // momento y giro del último movimiento, para medir la velocidad
    ultimaY: number;
    velocidad: number; // grados por ms
}

const MEDIA_VUELTA = 180;
// Tres cuartos de perfil: se ven la portada y el lomo
const REPOSO: Rotacion = { x: -8, y: 26 };
const GRADOS_POR_PIXEL = 0.5;
// La inclinación vertical se limita para que no quede dado vuelta
const INCLINACION_MAX = 30;
const VELOCIDAD_MAX = 1.2;
// Desde esta velocidad (grados por ms), soltar cuenta como tirón
const VELOCIDAD_TIRON = 0.3;
// Si el puntero se quedó quieto más que esto antes de soltar, no hubo tirón
const PAUSA_SIN_TIRON_MS = 90;
const DURACION_ENCAJE_MS = 700;
const DURACION_VUELTA_MS = 650;
const DURACION_TECLA_MS = 220;

const PASOS_TECLADO: Partial<Record<string, Rotacion>> = {
    ArrowLeft: { x: 0, y: -15 },
    ArrowRight: { x: 0, y: 15 },
    ArrowUp: { x: 5, y: 0 },
    ArrowDown: { x: -5, y: 0 }
};

const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const inclinar = (x: number) => limitar(x, -INCLINACION_MAX, INCLINACION_MAX);

// Ángulo más cercano a y que muestra la cara pedida (0 = frente, 180 = dorso)
const anguloDeCara = (y: number, cara: 0 | 180) => Math.round((y - cara) / 360) * 360 + cara;

// Cara donde encaja al soltar: la más cercana o, con un tirón, la siguiente
function caraAlSoltar(y: number, velocidad: number): number {
    const mediasVueltas = y / MEDIA_VUELTA;
    if (Math.abs(velocidad) < VELOCIDAD_TIRON) return Math.round(mediasVueltas) * MEDIA_VUELTA;
    const siguiente = velocidad > 0 ? Math.floor(mediasVueltas) + 1 : Math.ceil(mediasVueltas) - 1;
    return siguiente * MEDIA_VUELTA;
}

// Giro de un objeto de dos caras: se arrastra con el puntero o se gira con el teclado,
// y al soltarlo encaja mostrando el frente o el dorso
export function useGiro3D() {
    const [rot, setRot] = useState<Rotacion>(REPOSO);
    const arrastre = useRef<Arrastre | null>(null);
    const animacion = useRef<number | null>(null);

    const detenerAnimacion = () => {
        if (animacion.current !== null) cancelAnimationFrame(animacion.current);
        animacion.current = null;
    };

    useEffect(() => detenerAnimacion, []);

    // Anima el giro hasta destino (salta directo si el sistema pide reducir el movimiento)
    const girarHasta = (destino: Rotacion, duracionMs = DURACION_VUELTA_MS) => {
        detenerAnimacion();
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setRot(destino);
            return;
        }
        const desde = rot;
        const inicio = performance.now();
        const cuadro = (ahora: number) => {
            const avance = Math.min(1, (ahora - inicio) / duracionMs);
            const suavizado = 1 - (1 - avance) ** 3;
            setRot({
                x: desde.x + (destino.x - desde.x) * suavizado,
                y: desde.y + (destino.y - desde.y) * suavizado
            });
            animacion.current = avance < 1 ? requestAnimationFrame(cuadro) : null;
        };
        animacion.current = requestAnimationFrame(cuadro);
    };

    const onPointerDown = (e: PointerEvent<HTMLElement>) => {
        if (e.button !== 0) return;
        detenerAnimacion();
        e.currentTarget.setPointerCapture(e.pointerId); // sigue el arrastre aunque el mouse salga del elemento
        arrastre.current = {
            inicioX: e.clientX,
            inicioY: e.clientY,
            rotInicial: rot,
            ultimoT: e.timeStamp,
            ultimaY: rot.y,
            velocidad: 0
        };
    };

    const onPointerMove = (e: PointerEvent<HTMLElement>) => {
        const a = arrastre.current;
        if (!a) return;
        const y = a.rotInicial.y + (e.clientX - a.inicioX) * GRADOS_POR_PIXEL;
        const x = inclinar(a.rotInicial.x - (e.clientY - a.inicioY) * GRADOS_POR_PIXEL);
        const dt = e.timeStamp - a.ultimoT;
        if (dt > 0) {
            // se suaviza con la velocidad anterior para que un solo evento no la dispare
            const instantanea = (y - a.ultimaY) / dt;
            a.velocidad = limitar(0.7 * instantanea + 0.3 * a.velocidad, -VELOCIDAD_MAX, VELOCIDAD_MAX);
            a.ultimoT = e.timeStamp;
            a.ultimaY = y;
        }
        setRot({ x, y });
    };

    const soltar = (e: PointerEvent<HTMLElement>) => {
        const a = arrastre.current;
        if (!a) return;
        arrastre.current = null;
        const velocidad = e.timeStamp - a.ultimoT > PAUSA_SIN_TIRON_MS ? 0 : a.velocidad;
        girarHasta({ x: 0, y: caraAlSoltar(a.ultimaY, velocidad) }, DURACION_ENCAJE_MS);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        const paso = PASOS_TECLADO[e.key];
        if (paso) {
            e.preventDefault();
            girarHasta({ x: inclinar(rot.x + paso.x), y: rot.y + paso.y }, DURACION_TECLA_MS);
        } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            girarHasta({ x: 0, y: Math.round(rot.y / MEDIA_VUELTA) * MEDIA_VUELTA + MEDIA_VUELTA });
        }
    };

    const giroNormalizado = ((rot.y % 360) + 360) % 360;

    return {
        rot,
        muestraFrente: giroNormalizado < 90 || giroNormalizado > 270,
        mostrarFrente: () => girarHasta({ x: 0, y: anguloDeCara(rot.y, 0) }),
        mostrarDorso: () => girarHasta({ x: 0, y: anguloDeCara(rot.y, 180) }),
        eventos: { onPointerDown, onPointerMove, onPointerUp: soltar, onPointerCancel: soltar, onKeyDown }
    };
}
