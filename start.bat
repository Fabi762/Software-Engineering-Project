@echo off
echo ====================================
echo   StudyBuddy - Start
echo ====================================
echo.

echo Starte Backend...
cd /d "%~dp0backend"
start "StudyBuddy Backend" cmd /k ".\venv\Scripts\activate && uvicorn main:app --reload"

echo Starte Frontend...
cd /d "%~dp0my-app"
start "StudyBuddy Frontend" cmd /k "npm run dev"

echo.
echo ====================================
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo ====================================
echo.
echo Oeffne Browser...
timeout /t 3 >nul
start http://localhost:5173
