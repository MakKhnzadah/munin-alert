# Munin Alert — How to Run (Windows PowerShell)

## Prerequisites
- Java (JDK) available in PATH (Java 17+ recommended)
- Node.js (18 LTS recommended; Node 22 also works with the note below)
- Internet access for npm install (first run)

---

## Start BOTH frontend and backend
```powershell
# From the project root
.\start-all.bat
```
- Backend: http://localhost:8081  (health: /api/public/health)
- Frontend: http://localhost:3000

---

## Start the backend only (Spring Boot)
Option A — script from root:
```powershell
.\start-backend.bat
```
Option B — manual:
```powershell
Set-Location "backend-munin-alert\backend-munin-alert"
.\mvnw.cmd spring-boot:run
```
Verify:
```powershell
curl http://localhost:8081/api/public/health
```
````````````
Mak: backend manual:
```
java -version
```
$env:JAVA_HOME = "C:\Users\mkhnz\OneDrive\Desktop\Munin Alert Project\openJdk-24"; $env:Path = "$env:JAVA_HOME\bin;$env:Path"; java -version
```
Set-Location "C:\Users\mkhnz\OneDrive\Desktop\Munin Alert Project\backend-munin-alert\backend-munin-alert"; .\mvnw.cmd -v
```
./mvnw.cmd spring-boot:run

---

## Start the frontend only (React)
Option A — script from root:
```powershell
.\start-frontend.bat
```
Option B — manual:
```powershell
Set-Location "frontend\munin-alert-web"
# Install deps on first run (or after changes)
npm install --no-audit --legacy-peer-deps
# If you are on Node 22, enable the OpenSSL legacy provider
$env:NODE_OPTIONS="--openssl-legacy-provider"
# If you ever see an "allowedHosts" error, also set:
$env:DANGEROUSLY_DISABLE_HOST_CHECK="true"
# Start dev server
npm start
```
Open: http://localhost:3000

---

## Stopping
- Close the command windows started by the scripts, or
- Press Ctrl+C in the terminal where the service is running.

---

## Troubleshooting
- Check ports
```powershell
netstat -ano | findstr :8081
netstat -ano | findstr :3000
```
- Kill a process by PID (example):
```powershell
taskkill /F /PID <PID>
```
- Retry sequence if something didn’t start:
  1) Close all command windows
  2) Ensure no Java/Node processes remain (Task Manager)
  3) Run `.\start-all.bat` again

---

## Notes
- Node 18 LTS is the most stable with create-react-app/react-scripts 5. On Node 22, set `NODE_OPTIONS=--openssl-legacy-provider` before `npm start`.
- Frontend dev server proxies API requests to the backend at `http://localhost:8081` during development.
 - New pages/routes now available in the frontend (navigate manually in the browser):
   - `/login` – redesigned login screen
   - `/settings` – settings tiles (Account, Groups, Safe Havens, Alarm Activation, Language, Help)
   - `/alarm` – hold-to-activate alarm button
   - `/alarm/countdown` – alarm countdown and cancel page (navigated automatically after holding)
   - `/map` – map prototype with mock safe havens and bottom action bar

### WebSocket / Proxy ECONNREFUSED Messages
You may see repeated lines like:
```
Proxy error: Could not proxy request /ws from localhost:3000 to http://localhost:8081/ (ECONNREFUSED)
```
This is expected if the backend (Spring Boot) is not running, because the Create React App dev server is attempting to forward `/ws` (future WebSocket endpoint) to the backend target defined by the proxy.

Current state:
- The frontend contains only a placeholder WebSocket client (`src/services/wsClient.js`) that does NOT actually attempt a live connection.
- The proxy is still trying to forward any unknown paths (including `/ws`) to the backend; when the backend is down you get ECONNREFUSED noise.

Safe to ignore?
- Yes, these messages are harmless during pure frontend UI development if you are not testing real backend APIs.

How to silence or reduce them (choose one):
1. Simply start the backend (`./start-backend.bat`) before the frontend so the `/ws` target is reachable (even if not yet implemented server-side, connection attempts won't spam errors once the port is open).
2. Keep working and ignore them—no functional impact on current placeholder UI.
3. (Optional advanced) Replace the simple `"proxy"` entry in `package.json` with a custom `src/setupProxy.js` that only proxies `/api` and conditionally `/ws` when the backend is up. This avoids forwarding hot-update or unrelated paths. Ask if you'd like an automated patch for this.

If you later implement real-time features (chat / live map / alarm status) you'll enable an actual STOMP/SockJS client in place of the placeholder; at that point the backend `/ws` endpoint must be active to avoid connection failures.

### Quick Route Smoke Test
After `npm start` you can quickly verify key pages without logging in (if auth not enforced yet):
```
http://localhost:3000/settings
http://localhost:3000/alarm
http://localhost:3000/alarm/countdown  (navigate after triggering alarm)
http://localhost:3000/map
http://localhost:3000/login
```
If a page shows a blank screen, check the browser console for component or routing errors.

### Authentication updates
- Login now accepts either username OR email. The backend `/api/auth/login` takes `{ identifier, password }` (legacy `{ username, password }` still works).
- A new helper endpoint `/api/auth/forgot-username` accepts `{ email }` and returns `{ username }` when the email exists.
- On the Login page, use the “Forgot username?” link to retrieve the username by email.
