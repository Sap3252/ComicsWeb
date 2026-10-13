import { Schema, Model, Document, Types, model } from 'mongoose';

export interface IVoto {
    usuario: Types.ObjectId;
    comic: Types.ObjectId;
    valor: number; // 1 = voteUp, -1 = voteDown
}

export interface IVotoDocument extends IVoto, Document {
    _id: Types.ObjectId;
}

const votoSchema = new Schema<IVotoDocument>({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "El usuario es obligatorio"]
    },
    comic: {
        type: Schema.Types.ObjectId,
        ref: "Comic",
        required: [true, "El cómic es obligatorio"]
    },
    valor: {
        type: Number,
        enum: { values: [1, -1], message: "El voto debe ser 1 (up) o -1 (down)" },
        required: [true, "El valor del voto es obligatorio"]
    }
},
    {
        timestamps: true
    }
);

// Un usuario solo puede tener un voto por cómic
votoSchema.index({ usuario: 1, comic: 1 }, { unique: true });

const Voto: Model<IVotoDocument> = model<IVotoDocument>(
    "Voto",
    votoSchema
);

export default Voto;
