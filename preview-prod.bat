@echo off
cd /d "%~dp0"
call npm run build
start "Cobalith Preview Server" cmd /k "npm run preview -- --host"
timeout /t 3 /nobreak >nul
start "" "http://localhost:4173"
