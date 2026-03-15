@echo off
title Dashboard Financiero Argentina - BCRA
cd /d "%~dp0"

echo.
echo  ==========================================
echo   Dashboard Financiero Argentina - BCRA
echo  ==========================================
echo.

set PORT=8080

:: ---- Intentar con Python ----
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo  Iniciando servidor en http://localhost:%PORT% ...
    echo  Cerra esta ventana para detener el servidor.
    echo.
    start "" "http://localhost:%PORT%"
    python -m http.server %PORT%
    goto :end
)

python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo  Iniciando servidor en http://localhost:%PORT% ...
    echo  Cerra esta ventana para detener el servidor.
    echo.
    start "" "http://localhost:%PORT%"
    python3 -m http.server %PORT%
    goto :end
)

:: ---- Intentar con Node.js ----
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo  Iniciando servidor con Node.js...
    echo  Cerra esta ventana para detener el servidor.
    echo.
    start "" "http://localhost:3000"
    npx --yes serve .
    goto :end
)

:: ---- Nada encontrado ----
echo  No se encontro Python ni Node.js instalado.
echo.
echo  Instala Python (gratis) desde:
echo  https://www.python.org/downloads/
echo.
echo  Durante la instalacion, tilda la opcion:
echo  "Add Python to PATH"
echo.
echo  Luego volvé a ejecutar este archivo.
echo.
pause

:end
