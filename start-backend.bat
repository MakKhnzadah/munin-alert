@echo off
echo Starting Munin Alert Backend...
cd "C:\Users\mkhnz\OneDrive\Desktop\Munin Alert Project\backend-munin-alert\backend-munin-alert"
start "Munin Alert Backend" cmd /c "mvnw.cmd spring-boot:run"
echo Backend is starting in a new window.
exit