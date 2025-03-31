import mongoose from "mongoose";
import { Schema } from "mongoose";

const Url = "mongodb://localhost:27017/"

export const mongooseDb = async (req, res) => {
    try {
        await mongoose.connect(Url)
        console.log("Servidor corriendo")
    } catch (error) {
        console.log(error)
    }
}

const matrizSchema = new Schema({
    filas: { type: Number, required: true },
    columnas: { type: Number, required: true },
    matriz1: { type: [[Number]], required: true },
    matriz2: { type: [[Number]], required: true },
    resultado: { type: [[Number]], required: true },
});

export const Matriz = mongoose.model('Matriz', matrizSchema);
