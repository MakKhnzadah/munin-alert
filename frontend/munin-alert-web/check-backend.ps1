# Check if the backend server is running
$backendPort = 8081
$backendUrl = "http://localhost:$backendPort/api/public/health"

Write-Host "Checking if backend server is running on port $backendPort..."

try {
    $response = Invoke-WebRequest -Uri $backendUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend server is running! Status code: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend server not running or not accessible at $backendUrl" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start the backend server:" -ForegroundColor Yellow
    Write-Host "1. Open a new terminal window"
    Write-Host "2. Navigate to the backend directory:"
    Write-Host "   cd ..\backend-munin-alert"
    Write-Host "3. Run the application using Maven or Gradle:"
    Write-Host "   mvn spring-boot:run"
    Write-Host "   or"
    Write-Host "   ./gradlew bootRun"
    Write-Host ""
    Write-Host "See BACKEND_SETUP.md for more details."
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")