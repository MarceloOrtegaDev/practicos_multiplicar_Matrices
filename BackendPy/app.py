from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import numpy as np

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["matrices_db"]
collection = db["matrices"]

def multiplicar_matrices(matriz1, matriz2):
    return np.dot(matriz1, matriz2).tolist()

@app.route("/multiplicar", methods=["POST"])
def multiplicar():
    data = request.json
    matriz1 = data.get("matriz1")
    matriz2 = data.get("matriz2")
    if not matriz1 or not matriz2:
        return jsonify({"error": "Matrices no proporcionadas"}), 400
    resultado = multiplicar_matrices(matriz1, matriz2)
    doc = {"matriz1": matriz1, "matriz2": matriz2, "resultado": resultado}
    collection.insert_one(doc)
    return jsonify({"resultado": resultado})

@app.route("/matrices", methods=["GET"])
def obtener_matrices():
    matrices = list(collection.find({}, {"_id": 0}))
    return jsonify(matrices)

if __name__ == "__main__":
    app.run(port=3000, debug=True)
