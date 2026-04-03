@echo off
echo ========================================
echo   GENERADOR DE CARTELES v2 - Iniciando
echo ========================================

echo.
echo [1/2] Iniciando servidor (puerto 5000)...
start "Backend - Carteles" cmd /k "cd /d C:\Users\henry\Desktop\CREADOR DE CARTELES\generador-carteles\server && node index.js"
timeout /t 2 /nobreak > /dev/null

echo [2/2] Iniciando cliente React (puerto 3000)...
start "Frontend - Carteles" cmd /k "cd /d C:\Users\henry\Desktop\CREADOR DE CARTELES\generador-carteles\client && npm run dev"

echo.
echo ========================================
echo  Abriendo http://localhost:3000 ...
echo ========================================
timeout /t 5 /nobreak > /dev/null
start http://localhost:3000
