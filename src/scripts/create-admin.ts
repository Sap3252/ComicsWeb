// Crea un usuario administrador (o promueve a admin uno existente).
// Uso: npm run create-admin -- <email> <password> [nombre]
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/user.js";

const [email, password, nombre = "Administrador"] = process.argv.slice(2);

if (!email || !password) {
    console.error("Uso: npm run create-admin -- <email> <password> [nombre]");
    process.exit(1);
}

await connectDB();

const existente = await User.findOne({ email: email.toLowerCase().trim() });

if (existente) {
    existente.rol = "admin";
    await existente.save();
    console.log(`El usuario ${existente.email} ahora es admin`);
} else {
    const admin = await User.create({ nombre, email, password, rol: "admin" });
    console.log(`Admin creado: ${admin.email}`);
}

await mongoose.disconnect();
