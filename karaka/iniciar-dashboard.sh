#!/bin/bash
# Dashboard Financiero Argentina - BCRA
# Doble clic para iniciar

PORT=8080
DIR="$(cd "$(dirname "$0")" && pwd)"

# Si el puerto ya está en uso, busca uno libre
while lsof -i :$PORT &>/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

echo "Iniciando servidor en http://localhost:$PORT ..."

# Abre el navegador (espera 1 segundo para que el servidor levante)
(sleep 1 && xdg-open "http://localhost:$PORT" 2>/dev/null || open "http://localhost:$PORT" 2>/dev/null) &

# Inicia el servidor (Ctrl+C para detener)
cd "$DIR"
python3 -m http.server $PORT
