@echo off
echo Stoppe StudyBuddy...
echo.

REM Backend (uvicorn) stoppen
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo Stoppe Backend (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

REM Frontend (vite) stoppen
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo Stoppe Frontend (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo Alle Dienste gestoppt.
pause
