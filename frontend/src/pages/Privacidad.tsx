// Pública. Google la exige para publicar el login con Google
const REPOSITORIO = "https://github.com/Sap3252/ComicsWeb";

export function Privacidad() {
    return (
        <>
            <h1 className="titular">Política de privacidad</h1>
            <ul className="ficha ancha">
                <li>
                    <strong>Qué es ComicsWeb</strong>
                    Un proyecto académico: un catálogo de cómics donde los usuarios registrados pueden votar.
                </li>
                <li>
                    <strong>Qué datos guardamos</strong>
                    Tu nombre y tu email. Si entrás con GitHub o Google, también la foto de perfil que te da ese servicio.
                    De cada sesión se guarda la fecha, la dirección IP y el navegador desde el que ingresaste.
                </li>
                <li>
                    <strong>Para qué los usamos</strong>
                    Solo para que puedas iniciar sesión, mostrar tu nombre en la app y registrar tus votos.
                </li>
                <li>
                    <strong>Contraseñas</strong>
                    Si te registrás con email, la contraseña se guarda cifrada y nadie puede leerla.
                    Si entrás con GitHub o Google, no guardamos ninguna contraseña.
                </li>
                <li>
                    <strong>Con quién los compartimos</strong>
                    Con nadie. No hay publicidad ni herramientas de análisis.
                </li>
                <li>
                    <strong>Cookies</strong>
                    Solo la cookie de sesión, necesaria para que no tengas que ingresar en cada página.
                </li>
                <li>
                    <strong>Borrar tus datos</strong>
                    Podés pedir que borremos tus datos y tu cuenta abriendo un issue en el{" "}
                    <a href={REPOSITORIO} target="_blank" rel="noreferrer">repositorio del proyecto</a>.
                </li>
            </ul>
        </>
    );
}
