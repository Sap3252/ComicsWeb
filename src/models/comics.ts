import {Schema, Model, Document, Types, model } from 'mongoose';

export interface IComic {
    titulo: string;
    año: number;
    volumen: number;
    autor: string;
    saga: string;
    portada: string;
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
        maxlength: [200, "La portada no puede tener más de 200 caracteres"]
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