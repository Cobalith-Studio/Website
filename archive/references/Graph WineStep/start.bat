@echo off
setlocal
cd /d "%~dp0"

call npm run build
if errorlevel 1 (
  echo Build failed. Press any key to exit.
  pause >nul
  exit /b 1
)

python -m http.server 5173
