import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
    const usi = process.env.MONGODB_URI;

    if (!usi) {
        throw new Error("falta MONGODB_URI en el .env");
    }

    await mongoose.connect(usi);
    console.log("MongoDB conectado");
}