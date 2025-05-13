@echo off
echo Starting APPNEA application...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed or not in your PATH. Please install Node.js and try again.
    exit /b 1
)

echo Node.js version: 
node -v

REM Start the backend server in a new window
start cmd /k "cd server && npm start"

REM Wait a moment for the server to start
timeout /t 5

REM Start the frontend in a new window
start cmd /k "ionic serve"

echo APPNEA application is starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:8100

echo.
echo Note: To use with Android Studio, make sure to:
echo 1. Run the app in Android Studio
echo 2. The app will automatically detect it's running on Android and use the correct API URL (10.0.2.2)
echo.
echo Press any key to close this window...
pause >nul
