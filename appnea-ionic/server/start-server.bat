@echo off
echo Starting APPNEA Server Setup...

echo Starting the server (includes database migration)...
call npm run dev

pause
