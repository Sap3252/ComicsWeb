import { useState } from "react";
import { aplicarTema, guardarTema, temaInicial, type Tema } from "../tema";

// Tema claro u oscuro, con el botón para alternarlo
export function useTema() {
    const [tema, setTema] = useState<Tema>(temaInicial);

    const alternar = () => {
        const nuevo: Tema = tema === "oscuro" ? "claro" : "oscuro";
        aplicarTema(nuevo);
        guardarTema(nuevo); // solo se guarda al elegirlo a mano; si no, se sigue al sistema
        setTema(nuevo);
    };

    return { tema, alternar };
}
