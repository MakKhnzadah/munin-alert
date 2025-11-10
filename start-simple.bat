@echo off
echo Starting Munin Alert Frontend...

cd frontend\munin-alert-web

echo Installing dependencies...
call npm install

echo Starting frontend...
call npm start

echo Frontend started. Press Ctrl+C to exit.