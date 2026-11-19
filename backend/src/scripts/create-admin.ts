// Crea un usuario administrador (o promueve a admin uno existente).
// Uso: npm run create-admin -- <email> <password> [nombre]
import { auth, authDb, closeAuthDb } from "../config/auth.js";

const [email, password, nombre = "Administrador"] = process.argv.slice(2);

if (!email || !password) {
    console.error("Uso: npm run create-admin -- <email> <password> [nombre]");
    process.exit(1);
}

const emailNormalizado = email.toLowerCase().trim();
const usuarios = authDb.collection("user");

if (await usuarios.findOne({ email: emailNormalizado })) {
    // Directo en la base: setRole de Better Auth exige la sesión de otro admin
    await usuarios.updateOne({ email: emailNormalizado }, { $set: { role: "admin" } });
    console.log(`El usuario ${emailNormalizado} ahora es admin`);
} else {
    // Llamado desde el servidor, createUser no pide sesión
    await auth.api.createUser({ body: { email: emailNormalizado, password, name: nombre, role: "admin" } });
    console.log(`Admin creado: ${emailNormalizado}`);
}

await closeAuthDb();
