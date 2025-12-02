@echo off
echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║  🚀 Démarrage du serveur EcoleDirecte Dashboard      ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python n'est pas installé !
    echo.
    echo 📥 Téléchargez Python depuis: https://www.python.org/downloads/
    echo    Cochez "Add Python to PATH" pendant l'installation
    echo.
    pause
    exit /b 1
)

echo ✅ Python détecté
echo.
echo 🌐 Démarrage du serveur proxy...
echo.

REM Démarrer le serveur Python
python proxy-server.py

pause
