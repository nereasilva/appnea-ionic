# APPNEA Application Launcher
Write-Host "Starting APPNEA application (backend and frontend)..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed or not in your PATH. Please install Node.js and try again." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm -v
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm is not installed or not in your PATH. Please install npm and try again." -ForegroundColor Red
    exit 1
}

# Start the backend server in a new window
Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ./server; npm run dev"

# Wait a moment to ensure the backend starts first
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start the frontend in a new window
Write-Host "Starting frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run serve-quiet"

Write-Host "`nAPPNEA application is now running." -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:8100" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C in each terminal window to stop the servers when done." -ForegroundColor Yellow
