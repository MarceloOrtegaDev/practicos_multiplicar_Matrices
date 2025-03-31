import express from "express";
import cors from "cors";
import { mongooseDb } from "./db.js";
import { Matriz } from "./db.js";

const app = express();
app.use(express.json());
app.use(cors());

function multiplicarMatrices(matriz1, matriz2) {
    let filasA = matriz1.length;
    let columnasA = matriz1[0].length;
    let columnasB = matriz2[0].length;
    let resultado = Array(filasA).fill().map(() => Array(columnasB).fill(0));

    for (let i = 0; i < filasA; i++) {
        for (let j = 0; j < columnasB; j++) {
            for (let k = 0; k < columnasA; k++) {
                resultado[i][j] += matriz1[i][k] * matriz2[k][j];
            }
        }
    }
    return resultado;
}

app.post('/multiplicar', async (req, res) => {
    const { matriz1, matriz2 } = req.body;
    if (!matriz1 || !matriz2) {
        return res.status(400).json({ error: 'Matrices no proporcionadas' });
    }
    
    const filas = matriz1.length;
    const columnas = matriz2[0].length;
    const resultado = multiplicarMatrices(matriz1, matriz2);

    try {
        const nuevaMatriz = new Matriz({
            filas,
            columnas,
            matriz1,
            matriz2,
            resultado
        });
        await nuevaMatriz.save();
        res.json({ resultado });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar en la base de datos' });
    }
});

app.get('/matrices', async (req, res) => {
    try {
        const matrices = await Matriz.find();
        res.json(matrices);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las matrices' });
    }
});

app.listen(3000, () => {
    mongooseDb();
    console.log('Servidor en puerto 3000');
});
