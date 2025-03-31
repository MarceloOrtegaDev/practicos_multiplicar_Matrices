import { useState, useEffect } from "react";
import "./app.css"

function App() {
    const [filas, setFilas] = useState(2);
    const [columnas, setColumnas] = useState(2);
    const [matriz1, setMatriz1] = useState([]);
    const [matriz2, setMatriz2] = useState([]);
    const [resultado, setResultado] = useState([]);
    const [historial, setHistorial] = useState([]);

    useEffect(() => {
        setMatriz1(Array(filas).fill().map(() => Array(columnas).fill(0)));
        setMatriz2(Array(columnas).fill().map(() => Array(columnas).fill(0)));
    }, [filas, columnas]);

    const manejarCambio = (e, i, j, matriz, setMatriz) => {
        const nuevaMatriz = [...matriz];
        nuevaMatriz[i][j] = Number(e.target.value);
        setMatriz(nuevaMatriz);
    };

    const enviarMultiplicacion = async () => {
        const response = await fetch("http://localhost:3000/multiplicar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matriz1, matriz2 })
        });
        const data = await response.json();
        setResultado(data.resultado);
        obtenerHistorial();
    };

    const obtenerHistorial = async () => {
        const response = await fetch("http://localhost:3000/matrices");
        const data = await response.json();
        setHistorial(data);
    };

    useEffect(() => {
        obtenerHistorial();
    }, []);

    return (
        <div class="clasePrincipal">
            <h1>Multiplicación de Matrices</h1>

            <label>Filas: <input type="number" value={filas} onChange={(e) => setFilas(Number(e.target.value))} /></label>
            <label>Columnas: <input type="number" value={columnas} onChange={(e) => setColumnas(Number(e.target.value))} /></label>

            {[matriz1, matriz2].map((matriz, idx) => (
                <div key={idx}>
                    <h2>{`Matriz ${idx + 1}`}</h2>
                    {matriz.map((fila, i) => (
                        <div key={i}>
                            {fila.map((_, j) => (
                                <input key={j} type="number" value={matriz[i][j]} onChange={(e) => manejarCambio(e, i, j, matriz, idx === 0 ? setMatriz1 : setMatriz2)} />
                            ))}
                        </div>
                    ))}
                </div>
            ))}

            <button onClick={enviarMultiplicacion}>Multiplicar</button>

            <h2>Resultado</h2>
            {resultado.map((fila, i) => <div key={i}>{fila.join(" ")}</div>)}

            <h2>Historial</h2>
            {historial.map((item, index) => (
                <div key={index}>
                    {["Matriz 1", "Matriz 2", "Resultado"].map((titulo, idx) => (
                        <div key={idx}>
                            <p>{titulo}:</p>
                            {item[idx === 0 ? "matriz1" : idx === 1 ? "matriz2" : "resultado"].map((fila, i) => <div key={i}>{fila.join(" ")}</div>)}
                        </div>
                    ))}
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default App;
