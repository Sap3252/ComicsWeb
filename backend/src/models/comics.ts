import {Schema, Model, Document, Types, model } from 'mongoose';
import { MAX_LARGO_TAG, MAX_TAGS, normalizarTags } from '../utils/tags.js';

export const TIPOS = ["comic", "libro"] as const;
export type Tipo = (typeof TIPOS)[number];

export interface IComic {
    titulo: string;
    año: number;
    volumen: number;
    autor: string;
    saga: string;
    portada: string;
    contraportada?: string;
    tags: string[];
    tipo: Tipo;
    activo: boolean;
}

export interface IComicDocument extends IComic, Document {
_id: Types.ObjectId;
}

const comicSchema = new Schema<IComicDocument>({
    titulo: {
        type: String,
        required: [true, "El título es obligatorio"],
        trim: true,
        maxlength: [80, "El título no puede tener más de 80 caracteres"]
    },
    año: {
        type: Number,
        required: [true, "El año es obligatorio"],
        min: [1, "El año no puede ser menor a 1"]
    },
    volumen: {
        type: Number,
        required: [true, "El volumen es obligatorio"],
        min: [1, "El volumen no puede ser menor a 1"]
    },
    autor: {
        type: String,
        required: [true, "El autor es obligatorio"],
        trim: true,
        maxlength: [80, "El autor no puede tener más de 80 caracteres"]
    },
    saga: {
        type: String,
        required: [true, "La saga es obligatoria"],
        trim: true,
        maxlength: [80, "La saga no puede tener más de 80 caracteres"]
    },
    portada: {
        type: String,
        required: [true, "La portada es obligatoria"],
        trim: true,
        maxlength: [500, "La portada no puede tener más de 500 caracteres"]
    },
    // Opcional: sin contraportada, el visor 3D repite la portada
    contraportada: {
        type: String,
        trim: true,
        maxlength: [500, "La contraportada no puede tener más de 500 caracteres"]
    },
    // Normalizados para que la búsqueda no dependa de cómo se escriban
    tags: {
        type: [String],
        default: [],
        set: normalizarTags,
        validate: {
            validator: (tags: string[]) =>
                tags.length <= MAX_TAGS && tags.every((tag) => tag.length <= MAX_LARGO_TAG),
            message: `Un cómic puede tener hasta ${MAX_TAGS} tags de ${MAX_LARGO_TAG} caracteres como máximo`
        }
    },
    tipo: {
        type: String,
        enum: { values: TIPOS, message: "El tipo tiene que ser 'comic' o 'libro'" },
        default: "comic"
    },
    activo: {
        type: Boolean,
        default: true
    }
}, 
    {
        timestamps: true
    }
);

const Comic: Model<IComicDocument> = model<IComicDocument>(
    "Comic", 
    comicSchema
);

export default Comic;