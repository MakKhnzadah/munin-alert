@echo off
echo Cleaning up Munin Alert application processes...

echo Stopping any Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo Node.js processes terminated.
) else (
    echo No Node.js processes were running.
)

echo Stopping any Java processes related to Munin Alert...
wmic process where "commandline like '%%backend-munin-alert%%'" call terminate >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq *backend-munin-alert*" >nul 2>&1
echo Java processes checked.

echo Checking if port 8081 is in use...
netstat -ano | findstr :8081 > nul
if %errorlevel% equ 0 (
    echo Freeing port 8081...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
        echo Killing process %%a
        taskkill /f /pid %%a >nul 2>&1
    )
) else (
    echo Port 8081 is already free.
)

echo Checking if port 3000 is in use...
netstat -ano | findstr :3000 > nul
if %errorlevel% equ 0 (
    echo Freeing port 3000...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        echo Killing process %%a
        taskkill /f /pid %%a >nul 2>&1
    )
) else (
    echo Port 3000 is already free.
)

echo Cleanup complete. You can now start the application again.
pause