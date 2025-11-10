@echo off
echo Starting Munin Alert application...

echo Checking if Java is available...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not available in PATH.
    echo Please install Java and try again.
    pause
    exit /b 1
)

echo Checking if Node.js is available...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not available in PATH.
    echo Please install Node.js and try again.
    pause
    exit /b 1
)

echo Starting backend...
start cmd /k "cd %~dp0 && call start-backend.bat"

echo Waiting for backend to start...
timeout /t 5 /nobreak

echo Verifying backend is running...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8081' -UseBasicParsing -TimeoutSec 5; Write-Host 'Backend is running!'; } catch { Write-Host 'WARNING: Backend may not be running properly. Check the backend window for errors.'; }"

echo Starting frontend with enhanced configuration...
start cmd /k "cd %~dp0 && call start-frontend.bat"

echo Services starting in separate windows.
echo Backend: http://localhost:8081
echo Frontend: http://localhost:3000
echo.
echo You can close these services by closing their respective command windows.
echo.
echo If the services don't start properly, you can try:
echo 1. Close all command windows
echo 2. Make sure no Java or Node.js processes are running
echo 3. Run this script again

pause