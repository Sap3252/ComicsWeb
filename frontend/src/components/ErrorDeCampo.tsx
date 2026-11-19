// Mensaje de validación debajo de un campo del formulario
export function ErrorDeCampo({ mensaje }: { mensaje?: string | undefined }) {
    if (!mensaje) return null;

    return <span className="error-campo" role="alert">{mensaje}</span>;
}
