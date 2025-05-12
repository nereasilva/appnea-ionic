@echo off
echo Starting APPNEA application (backend and frontend)...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed or not in your PATH. Please install Node.js and try again.
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo npm is not installed or not in your PATH. Please install npm and try again.
    exit /b 1
)

REM Start the backend server in a new window
echo Starting backend server...
start cmd /k "cd server && npm run dev"

REM Wait a moment to ensure the backend starts first
timeout /t 3 /nobreak > nul

REM Start the frontend in a new window
echo Starting frontend...
start cmd /k "npm run serve-quiet"

echo APPNEA application is now running.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:8100
echo.
echo Press Ctrl+C in each terminal window to stop the servers when done.
