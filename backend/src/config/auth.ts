import "dotenv/config";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";

export type Rol = "user" | "admin";

function requireEnv(nombre: string): string {
    const valor = process.env[nombre];

    if (!valor) {
        throw new Error(`falta ${nombre} en el .env`);
    }

    return valor;
}

// Better Auth usa el driver de MongoDB, no Mongoose
const client = new MongoClient(requireEnv("MONGODB_URI"));

export const authDb = client.db();

export const closeAuthDb = () => client.close();

// BETTER_AUTH_URL es la URL del frontend: la cookie de sesión queda en su dominio
export const auth = betterAuth({
    database: mongodbAdapter(authDb),
    emailAndPassword: { enabled: true },
    socialProviders: {
        github: {
            clientId: requireEnv("GITHUB_CLIENT_ID"),
            clientSecret: requireEnv("GITHUB_CLIENT_SECRET")
        },
        google: {
            clientId: requireEnv("GOOGLE_CLIENT_ID"),
            clientSecret: requireEnv("GOOGLE_CLIENT_SECRET")
        }
    },
    plugins: [admin({ defaultRole: "user", adminRoles: ["admin"] })]
});
