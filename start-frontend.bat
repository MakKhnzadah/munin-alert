@echo off
echo Starting Munin Alert Frontend...

set FRONTEND_DIR=%~dp0frontend\munin-alert-web

echo Checking if port 3000 is already in use...
netstat -ano | findstr :3000 > nul
if %errorlevel% equ 0 (
    echo Port 3000 is already in use. Attempting to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        echo Killing process %%a
        taskkill /f /pid %%a > nul 2>&1
    )
) else (
    echo Port 3000 is available.
)

echo Creating temporary environment variables...
echo NODE_OPTIONS=--max-old-space-size=4096 > "%FRONTEND_DIR%\.env.local"
echo PORT=3000 >> "%FRONTEND_DIR%\.env.local"
echo BROWSER=none >> "%FRONTEND_DIR%\.env.local"
echo REACT_APP_API_URL=http://localhost:8081 >> "%FRONTEND_DIR%\.env.local"

echo Clearing npm cache...
cd /d "%FRONTEND_DIR%" && call npm cache clean --force

echo Installing any missing dependencies...
cd /d "%FRONTEND_DIR%" && call npm install --no-audit --legacy-peer-deps

echo Starting React development server with explicit host and port...
cd /d "%FRONTEND_DIR%" && call npm start

echo If the browser didn't open automatically, visit:
echo http://localhost:3000/