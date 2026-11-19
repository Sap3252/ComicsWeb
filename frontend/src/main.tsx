import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { aplicarTema, temaInicial } from "./tema";
import "./index.css";

// Antes del primer render, para que no se vea un parpadeo con el otro tema
aplicarTema(temaInicial());

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
