@echo off
echo Starting APPNEA Frontend...

echo Installing dependencies if needed...
call npm install

echo Starting the Ionic application...
call ionic serve

pause
