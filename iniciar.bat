@echo off
echo ========================================
echo   GENERADOR DE CARTELES - Iniciando...
echo ========================================

echo.
echo [1/3] Iniciando MongoDB...
start "MongoDB" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\Users\henry\mongodb-data" --port 27017
timeout /t 3 /nobreak > nul

echo [2/3] Iniciando servidor (puerto 5000)...
start "Backend - Carteles" cmd /k "cd /d C:\Users\henry\Desktop\CREADOR DE CARTELES\generador-carteles\server && node index.js"
timeout /t 2 /nobreak > nul

echo [3/3] Iniciando cliente React (puerto 3000)...
start "Frontend - Carteles" cmd /k "cd /d C:\Users\henry\Desktop\CREADOR DE CARTELES\generador-carteles\client && npm run dev"

echo.
echo ========================================
echo  Abriendo http://localhost:3000 ...
echo ========================================
timeout /t 5 /nobreak > nul
start http://localhost:3000
