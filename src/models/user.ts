import { Schema, Model, Document, Types, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export const ROLES = ["usuario", "admin"] as const;
export type Rol = (typeof ROLES)[number];

export interface IUser {
    nombre: string;
    email: string;
    password: string;
    rol: Rol;
}

export interface IUserDocument extends IUser, Document {
    _id: Types.ObjectId;
}

const userSchema = new Schema<IUserDocument>({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
        maxlength: [80, "El nombre no puede tener más de 80 caracteres"]
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "El email no es válido"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
        select: false // nunca se devuelve en las consultas salvo que se pida con .select('+password')
    },
    rol: {
        type: String,
        enum: ROLES,
        default: "usuario"
    }
},
    {
        timestamps: true
    }
);

// Hashea la contraseña antes de guardarla (la validación de arriba corre antes, sobre el texto plano)
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

const User: Model<IUserDocument> = model<IUserDocument>(
    "User",
    userSchema
);

export default User;
