# Mobile WebSocket Client Implementation for Munin Alert

This guide demonstrates how to implement a WebSocket client in both Android and iOS mobile applications to connect to the Munin Alert WebSocket server for real-time alerts and notifications.

## Overview

The Munin Alert application uses WebSockets to deliver real-time alerts and notifications to mobile clients. This includes:

- Emergency alerts
- Risk area notifications
- Safe haven entry/exit events
- Group messages
- Location updates from friends and group members

## WebSocket Connection Architecture

```
┌─────────────────┐       WebSocket       ┌─────────────────┐
│                 │      Connection        │                 │
│  Mobile Client  │◄────────────────────► │  Munin Alert    │
│  (Android/iOS)  │                       │  Backend Server │
│                 │                       │                 │
└─────────────────┘                       └─────────────────┘
```

## Authentication Flow

1. Mobile app logs in using REST API and receives a JWT token
2. Mobile app establishes WebSocket connection with JWT token in header
3. Server validates token and associates WebSocket session with user
4. Server sends initial state information (active alerts, nearby safe havens)
5. Bidirectional communication begins

## Android Implementation Example

Here's how to implement a WebSocket client in an Android application using OkHttp:

### 1. Add dependencies to your app-level build.gradle file

```gradle
dependencies {
    // WebSocket client
    implementation 'com.squareup.okhttp3:okhttp:4.9.3'
    
    // JSON parsing
    implementation 'com.google.code.gson:gson:2.8.9'
}
```

### 2. Create WebSocket client class

```java
import android.util.Log;
import com.google.gson.Gson;
import okhttp3.*;
import org.json.JSONObject;

import java.util.concurrent.TimeUnit;

public class MuninAlertWebSocketClient {
    private static final String TAG = "WebSocketClient";
    private static final String WEBSOCKET_URL = "ws://your-backend-domain.com/api/ws";
    
    private WebSocket webSocket;
    private final OkHttpClient client;
    private final WebSocketListener listener;
    private final String authToken;
    private final Gson gson = new Gson();
    
    public interface MessageListener {
        void onAlertReceived(Alert alert);
        void onRiskAlertReceived(RiskAlert riskAlert);
        void onSafeHavenStatusChanged(SafeHavenStatus status);
        void onMessageReceived(Message message);
        void onConnectionStateChanged(boolean connected);
    }
    
    public MuninAlertWebSocketClient(String authToken, MessageListener messageListener) {
        this.authToken = authToken;
        
        // Configure OkHttp client with timeouts
        client = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .pingInterval(20, TimeUnit.SECONDS) // Keep connection alive
                .retryOnConnectionFailure(true)
                .build();
        
        // Create WebSocket listener
        listener = new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                Log.i(TAG, "WebSocket connection established");
                messageListener.onConnectionStateChanged(true);
                
                // Send authentication message
                sendAuthenticationMessage();
            }
            
            @Override
            public void onMessage(WebSocket webSocket, String text) {
                Log.d(TAG, "Message received: " + text);
                try {
                    JSONObject json = new JSONObject(text);
                    String messageType = json.getString("type");
                    
                    switch (messageType) {
                        case "ALERT":
                            Alert alert = gson.fromJson(text, Alert.class);
                            messageListener.onAlertReceived(alert);
                            break;
                        case "RISK_ALERT":
                            RiskAlert riskAlert = gson.fromJson(text, RiskAlert.class);
                            messageListener.onRiskAlertReceived(riskAlert);
                            break;
                        case "SAFE_HAVEN_STATUS":
                            SafeHavenStatus status = gson.fromJson(text, SafeHavenStatus.class);
                            messageListener.onSafeHavenStatusChanged(status);
                            break;
                        case "MESSAGE":
                            Message message = gson.fromJson(text, Message.class);
                            messageListener.onMessageReceived(message);
                            break;
                        default:
                            Log.w(TAG, "Unknown message type: " + messageType);
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error parsing message", e);
                }
            }
            
            @Override
            public void onClosed(WebSocket webSocket, int code, String reason) {
                Log.i(TAG, "WebSocket closed: " + reason);
                messageListener.onConnectionStateChanged(false);
            }
            
            @Override
            public void onFailure(WebSocket webSocket, Throwable t, Response response) {
                Log.e(TAG, "WebSocket failure", t);
                messageListener.onConnectionStateChanged(false);
                
                // Implement reconnection logic
                reconnect();
            }
        };
    }
    
    public void connect() {
        // Add auth token to request
        Request request = new Request.Builder()
                .url(WEBSOCKET_URL)
                .header("Authorization", "Bearer " + authToken)
                .build();
        
        // Connect to WebSocket server
        webSocket = client.newWebSocket(request, listener);
    }
    
    public void disconnect() {
        if (webSocket != null) {
            // Normal closure status code
            webSocket.close(1000, "User initiated disconnect");
        }
    }
    
    public void reconnect() {
        // Implement exponential backoff for reconnection
        // This is a simplified version
        new Thread(() -> {
            try {
                Thread.sleep(5000); // Wait 5 seconds before reconnecting
                connect();
            } catch (InterruptedException e) {
                Log.e(TAG, "Reconnection interrupted", e);
            }
        }).start();
    }
    
    private void sendAuthenticationMessage() {
        if (webSocket != null) {
            JSONObject authMessage = new JSONObject();
            try {
                authMessage.put("type", "AUTH");
                authMessage.put("token", authToken);
                webSocket.send(authMessage.toString());
            } catch (Exception e) {
                Log.e(TAG, "Error creating auth message", e);
            }
        }
    }
    
    public void sendLocationUpdate(double latitude, double longitude) {
        if (webSocket != null) {
            try {
                JSONObject locationMessage = new JSONObject();
                locationMessage.put("type", "LOCATION_UPDATE");
                locationMessage.put("latitude", latitude);
                locationMessage.put("longitude", longitude);
                locationMessage.put("timestamp", System.currentTimeMillis());
                
                webSocket.send(locationMessage.toString());
            } catch (Exception e) {
                Log.e(TAG, "Error sending location update", e);
            }
        }
    }
    
    public void sendMessage(String recipientId, String content, boolean isGroupMessage) {
        if (webSocket != null) {
            try {
                JSONObject message = new JSONObject();
                message.put("type", "MESSAGE");
                message.put("recipientId", recipientId);
                message.put("content", content);
                message.put("isGroupMessage", isGroupMessage);
                message.put("timestamp", System.currentTimeMillis());
                
                webSocket.send(message.toString());
            } catch (Exception e) {
                Log.e(TAG, "Error sending message", e);
            }
        }
    }
    
    public void triggerAlert(double latitude, double longitude, String alertType) {
        if (webSocket != null) {
            try {
                JSONObject alert = new JSONObject();
                alert.put("type", "TRIGGER_ALERT");
                alert.put("alertType", alertType);
                alert.put("latitude", latitude);
                alert.put("longitude", longitude);
                alert.put("timestamp", System.currentTimeMillis());
                
                webSocket.send(alert.toString());
            } catch (Exception e) {
                Log.e(TAG, "Error triggering alert", e);
            }
        }
    }
}
```

### 3. Using the WebSocket client in your application

```java
public class MainActivity extends AppCompatActivity implements MuninAlertWebSocketClient.MessageListener {
    private MuninAlertWebSocketClient webSocketClient;
    private String authToken;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Get authentication token from your login process
        authToken = getAuthTokenFromPreferences();
        
        // Initialize WebSocket client
        webSocketClient = new MuninAlertWebSocketClient(authToken, this);
        
        // Set up UI elements
        setupUI();
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        // Connect to WebSocket when app comes to foreground
        webSocketClient.connect();
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        // Disconnect from WebSocket when app goes to background
        // For real-time alerts, you might want to keep this connected
        // and handle in a background service
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Clean up resources
        webSocketClient.disconnect();
    }
    
    // Implement MessageListener interface methods
    @Override
    public void onAlertReceived(Alert alert) {
        // Update UI with alert information
        runOnUiThread(() -> {
            // Show alert notification
            showAlertNotification(alert);
        });
    }
    
    @Override
    public void onRiskAlertReceived(RiskAlert riskAlert) {
        runOnUiThread(() -> {
            // Show risk area on map
            showRiskAreaOnMap(riskAlert);
        });
    }
    
    @Override
    public void onSafeHavenStatusChanged(SafeHavenStatus status) {
        runOnUiThread(() -> {
            // Update UI with safe haven status
            updateSafeHavenStatus(status);
        });
    }
    
    @Override
    public void onMessageReceived(Message message) {
        runOnUiThread(() -> {
            // Display message
            showMessage(message);
        });
    }
    
    @Override
    public void onConnectionStateChanged(boolean connected) {
        runOnUiThread(() -> {
            // Update UI connection indicator
            updateConnectionStatus(connected);
        });
    }
    
    // Helper methods for UI updates
    private void showAlertNotification(Alert alert) {
        // Implementation depends on your UI
    }
    
    private void showRiskAreaOnMap(RiskAlert riskAlert) {
        // Implementation depends on your map implementation
    }
    
    private void updateSafeHavenStatus(SafeHavenStatus status) {
        // Implementation depends on your UI
    }
    
    private void showMessage(Message message) {
        // Implementation depends on your UI
    }
    
    private void updateConnectionStatus(boolean connected) {
        // Update connection indicator in UI
    }
    
    // Button click handlers
    public void onSendAlertButtonClicked(View view) {
        // Get current location
        getCurrentLocation((latitude, longitude) -> {
            // Send alert via WebSocket
            webSocketClient.triggerAlert(latitude, longitude, "EMERGENCY");
        });
    }
    
    private void getCurrentLocation(LocationCallback callback) {
        // Implementation depends on your location provider
    }
    
    interface LocationCallback {
        void onLocationReceived(double latitude, double longitude);
    }
}
```

## iOS Implementation Example (Swift)

Here's how to implement a WebSocket client in an iOS application using Starscream:

### 1. Add Starscream dependency using Swift Package Manager

In Xcode, go to File > Swift Packages > Add Package Dependency and add:
```
https://github.com/daltoniam/Starscream.git
```

### 2. Create WebSocket manager class

```swift
import Foundation
import Starscream

// Message types for type-safe handling
enum WebSocketMessageType: String {
    case alert = "ALERT"
    case riskAlert = "RISK_ALERT"
    case safeHavenStatus = "SAFE_HAVEN_STATUS"
    case message = "MESSAGE"
    case locationUpdate = "LOCATION_UPDATE"
    case auth = "AUTH"
    case triggerAlert = "TRIGGER_ALERT"
}

// Protocol for WebSocket message handling
protocol WebSocketManagerDelegate: AnyObject {
    func didReceiveAlert(_ alert: Alert)
    func didReceiveRiskAlert(_ riskAlert: RiskAlert)
    func didReceiveSafeHavenStatus(_ status: SafeHavenStatus)
    func didReceiveMessage(_ message: Message)
    func connectionStatusChanged(connected: Bool)
}

class MuninAlertWebSocketManager: WebSocketDelegate {
    private let webSocketURL = URL(string: "ws://your-backend-domain.com/api/ws")!
    private var socket: WebSocket?
    private var isConnected = false
    private var authToken: String
    private var reconnectTimer: Timer?
    private var reconnectAttempts = 0
    
    weak var delegate: WebSocketManagerDelegate?
    
    init(authToken: String) {
        self.authToken = authToken
    }
    
    func connect() {
        // Set up request with auth header
        var request = URLRequest(url: webSocketURL)
        request.timeoutInterval = 10
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
        
        socket = WebSocket(request: request)
        socket?.delegate = self
        socket?.connect()
    }
    
    func disconnect() {
        socket?.disconnect()
        isConnected = false
    }
    
    // MARK: - WebSocketDelegate Methods
    
    func didReceive(event: WebSocketEvent, client: WebSocket) {
        switch event {
        case .connected(_):
            print("WebSocket connected")
            isConnected = true
            reconnectAttempts = 0
            delegate?.connectionStatusChanged(connected: true)
            
            // Send authentication message
            sendAuthenticationMessage()
            
        case .disconnected(let reason, let code):
            print("WebSocket disconnected: \(reason) with code: \(code)")
            isConnected = false
            delegate?.connectionStatusChanged(connected: false)
            
            // Schedule reconnect
            scheduleReconnect()
            
        case .text(let string):
            handleMessage(string)
            
        case .binary(let data):
            if let string = String(data: data, encoding: .utf8) {
                handleMessage(string)
            }
            
        case .pong(_):
            // Keep alive response
            break
            
        case .ping(_):
            // Server sent ping
            break
            
        case .error(let error):
            print("WebSocket error: \(error?.localizedDescription ?? "Unknown error")")
            isConnected = false
            delegate?.connectionStatusChanged(connected: false)
            
            // Schedule reconnect
            scheduleReconnect()
            
        case .viabilityChanged(_):
            // Connection viability changed
            break
            
        case .reconnectSuggested(_):
            // Reconnection suggested
            reconnect()
            
        case .cancelled:
            isConnected = false
            delegate?.connectionStatusChanged(connected: false)
        }
    }
    
    // MARK: - Message Handling
    
    private func handleMessage(_ message: String) {
        guard let data = message.data(using: .utf8) else { return }
        
        do {
            if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
               let typeString = json["type"] as? String,
               let type = WebSocketMessageType(rawValue: typeString) {
                
                let decoder = JSONDecoder()
                
                switch type {
                case .alert:
                    let alert = try decoder.decode(Alert.self, from: data)
                    delegate?.didReceiveAlert(alert)
                    
                case .riskAlert:
                    let riskAlert = try decoder.decode(RiskAlert.self, from: data)
                    delegate?.didReceiveRiskAlert(riskAlert)
                    
                case .safeHavenStatus:
                    let status = try decoder.decode(SafeHavenStatus.self, from: data)
                    delegate?.didReceiveSafeHavenStatus(status)
                    
                case .message:
                    let message = try decoder.decode(Message.self, from: data)
                    delegate?.didReceiveMessage(message)
                    
                default:
                    print("Received message of type \(type.rawValue)")
                }
            }
        } catch {
            print("Error parsing message: \(error.localizedDescription)")
        }
    }
    
    // MARK: - Sending Messages
    
    private func sendAuthenticationMessage() {
        let authMessage: [String: Any] = [
            "type": WebSocketMessageType.auth.rawValue,
            "token": authToken
        ]
        
        sendJSON(authMessage)
    }
    
    func sendLocationUpdate(latitude: Double, longitude: Double) {
        let locationMessage: [String: Any] = [
            "type": WebSocketMessageType.locationUpdate.rawValue,
            "latitude": latitude,
            "longitude": longitude,
            "timestamp": Int(Date().timeIntervalSince1970 * 1000)
        ]
        
        sendJSON(locationMessage)
    }
    
    func sendMessage(recipientId: String, content: String, isGroupMessage: Bool) {
        let message: [String: Any] = [
            "type": WebSocketMessageType.message.rawValue,
            "recipientId": recipientId,
            "content": content,
            "isGroupMessage": isGroupMessage,
            "timestamp": Int(Date().timeIntervalSince1970 * 1000)
        ]
        
        sendJSON(message)
    }
    
    func triggerAlert(latitude: Double, longitude: Double, alertType: String) {
        let alert: [String: Any] = [
            "type": WebSocketMessageType.triggerAlert.rawValue,
            "alertType": alertType,
            "latitude": latitude,
            "longitude": longitude,
            "timestamp": Int(Date().timeIntervalSince1970 * 1000)
        ]
        
        sendJSON(alert)
    }
    
    // MARK: - Helper Methods
    
    private func sendJSON(_ json: [String: Any]) {
        guard isConnected, let socket = socket else {
            print("Cannot send message - not connected")
            return
        }
        
        do {
            let data = try JSONSerialization.data(withJSONObject: json)
            if let string = String(data: data, encoding: .utf8) {
                socket.write(string: string)
            }
        } catch {
            print("Error serializing message: \(error.localizedDescription)")
        }
    }
    
    // MARK: - Reconnection Logic
    
    private func scheduleReconnect() {
        reconnectTimer?.invalidate()
        
        // Exponential backoff with maximum delay of 30 seconds
        let delay = min(pow(1.5, Double(reconnectAttempts)) + Double.random(in: 0...1), 30)
        reconnectAttempts += 1
        
        reconnectTimer = Timer.scheduledTimer(withTimeInterval: delay, repeats: false) { [weak self] _ in
            self?.reconnect()
        }
    }
    
    private func reconnect() {
        if !isConnected {
            connect()
        }
    }
    
    deinit {
        reconnectTimer?.invalidate()
        socket?.disconnect()
    }
}
```

### 3. Using the WebSocket manager in a view controller

```swift
import UIKit
import CoreLocation

class AlertViewController: UIViewController, WebSocketManagerDelegate, CLLocationManagerDelegate {
    
    // UI elements
    @IBOutlet weak var connectionStatusLabel: UILabel!
    @IBOutlet weak var alertsTableView: UITableView!
    
    // WebSocket manager
    private var webSocketManager: MuninAlertWebSocketManager?
    
    // Location manager
    private let locationManager = CLLocationManager()
    
    // Data
    private var alerts: [Alert] = []
    private var riskAlerts: [RiskAlert] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Set up location manager
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
        
        // Set up WebSocket
        if let authToken = UserDefaults.standard.string(forKey: "authToken") {
            webSocketManager = MuninAlertWebSocketManager(authToken: authToken)
            webSocketManager?.delegate = self
        } else {
            // Navigate to login screen
            performSegue(withIdentifier: "showLogin", sender: nil)
        }
        
        // Set up UI
        setupUI()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        // Connect to WebSocket
        webSocketManager?.connect()
        
        // Start location updates
        locationManager.startUpdatingLocation()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        // For a real-time alert app, you might want to keep the socket
        // connected even when the view disappears
        // webSocketManager?.disconnect()
        
        // Stop location updates if not needed in background
        // locationManager.stopUpdatingLocation()
    }
    
    // MARK: - UI Actions
    
    @IBAction func triggerEmergencyAlert(_ sender: UIButton) {
        guard let location = locationManager.location else {
            showAlert(title: "Location Unavailable", message: "Cannot send alert without location")
            return
        }
        
        webSocketManager?.triggerAlert(
            latitude: location.coordinate.latitude,
            longitude: location.coordinate.longitude,
            alertType: "EMERGENCY"
        )
        
        showAlert(title: "Alert Sent", message: "Emergency alert has been sent")
    }
    
    // MARK: - WebSocketManagerDelegate Methods
    
    func didReceiveAlert(_ alert: Alert) {
        DispatchQueue.main.async {
            // Add to alerts array
            self.alerts.insert(alert, at: 0)
            self.alertsTableView.reloadData()
            
            // Show local notification if app is in background
            if UIApplication.shared.applicationState != .active {
                self.showLocalNotification(title: "Emergency Alert", 
                                          body: "Someone near you needs help!")
            }
        }
    }
    
    func didReceiveRiskAlert(_ riskAlert: RiskAlert) {
        DispatchQueue.main.async {
            // Add to risk alerts array
            self.riskAlerts.insert(riskAlert, at: 0)
            
            // Update map with risk area
            self.updateMapWithRiskArea(riskAlert)
            
            // Show local notification if app is in background
            if UIApplication.shared.applicationState != .active {
                self.showLocalNotification(title: "Risk Area Alert", 
                                          body: "You are near a risk area: \(riskAlert.description)")
            }
        }
    }
    
    func didReceiveSafeHavenStatus(_ status: SafeHavenStatus) {
        DispatchQueue.main.async {
            // Update UI with safe haven status
            self.updateSafeHavenStatus(status)
        }
    }
    
    func didReceiveMessage(_ message: Message) {
        DispatchQueue.main.async {
            // Display message in UI
            self.displayMessage(message)
            
            // Show local notification if app is in background
            if UIApplication.shared.applicationState != .active {
                self.showLocalNotification(title: "New Message", 
                                          body: message.content)
            }
        }
    }
    
    func connectionStatusChanged(connected: Bool) {
        DispatchQueue.main.async {
            self.connectionStatusLabel.text = connected ? "Connected" : "Disconnected"
            self.connectionStatusLabel.textColor = connected ? .green : .red
        }
    }
    
    // MARK: - CLLocationManagerDelegate Methods
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        
        // Send location update to server every minute or when significant change occurs
        // (You would implement logic to determine when to send)
        webSocketManager?.sendLocationUpdate(
            latitude: location.coordinate.latitude,
            longitude: location.coordinate.longitude
        )
    }
    
    // MARK: - Helper Methods
    
    private func setupUI() {
        // Configure table view
        alertsTableView.delegate = self
        alertsTableView.dataSource = self
        
        // Configure other UI elements
    }
    
    private func updateMapWithRiskArea(_ riskAlert: RiskAlert) {
        // Implementation depends on your map view
    }
    
    private func updateSafeHavenStatus(_ status: SafeHavenStatus) {
        // Implementation depends on your UI
    }
    
    private func displayMessage(_ message: Message) {
        // Implementation depends on your UI
    }
    
    private func showLocalNotification(title: String, body: String) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        
        let request = UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
        )
        
        UNUserNotificationCenter.current().add(request)
    }
    
    private func showAlert(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}

// MARK: - UITableViewDelegate & UITableViewDataSource

extension AlertViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return alerts.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "AlertCell", for: indexPath)
        
        let alert = alerts[indexPath.row]
        cell.textLabel?.text = "Alert: \(alert.alertType)"
        cell.detailTextLabel?.text = "From: \(alert.userName)"
        
        return cell
    }
}
```

## Best Practices for Mobile WebSocket Clients

1. **Authentication and Security**
   - Always use secure WebSocket connections (wss://)
   - Include authentication tokens in connection headers
   - Implement token refresh mechanisms

2. **Connection Management**
   - Implement automatic reconnection with exponential backoff
   - Handle network transitions (WiFi to cellular)
   - Consider keeping connections alive in background for critical alerts

3. **Battery Optimization**
   - Adjust location update frequency based on battery level
   - Use WebSocket ping/pong for keepalive instead of regular messages
   - Consider using push notifications as a fallback when app is in background

4. **Reliability**
   - Implement message delivery confirmation for critical alerts
   - Store unsent messages for retry when connection is restored
   - Have fallback mechanisms (SMS, push notifications) for critical alerts

5. **Error Handling**
   - Log WebSocket errors for troubleshooting
   - Implement circuit breaker pattern for repeated connection failures
   - Provide user feedback on connection status

## Server-Side WebSocket Implementation

On the server side, the Munin Alert backend implements WebSocket handling using Spring WebSocket:

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue", "/user");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
            .addEndpoint("/api/ws")
            .setAllowedOriginPatterns("*")
            .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(
                    message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Extract JWT from header
                    List<String> authorization = accessor.getNativeHeader("Authorization");
                    
                    if (authorization != null && !authorization.isEmpty()) {
                        String jwt = authorization.get(0).substring(7);
                        
                        // Validate JWT and set user in WebSocket session
                        try {
                            // JWT validation logic here
                            String userId = getUserIdFromJwt(jwt);
                            accessor.setUser(new Principal() {
                                @Override
                                public String getName() {
                                    return userId;
                                }
                            });
                        } catch (Exception e) {
                            // Invalid token
                            throw new IllegalArgumentException("Invalid token");
                        }
                    } else {
                        // No authorization header
                        throw new IllegalArgumentException("No authorization header");
                    }
                }
                return message;
            }
        });
    }
}
```

This enables the server to:
- Authenticate WebSocket connections
- Associate WebSocket sessions with specific users
- Route messages to specific users or broadcast to groups
- Handle subscriptions to specific topics

## Testing WebSocket Connection

For testing purposes, you can use a simple WebSocket client tool like Postman or the wscat command-line tool:

```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket server with JWT token
wscat -c "ws://localhost:8081/api/ws" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Send a message
> {"type": "LOCATION_UPDATE", "latitude": 59.9127, "longitude": 10.7461, "timestamp": 1616969225000}
```

## Conclusion

This guide demonstrates how to implement WebSocket clients for the Munin Alert application on both Android and iOS platforms. The implementation focuses on:

1. Establishing and maintaining secure WebSocket connections
2. Handling real-time alerts and notifications
3. Sending location updates and emergency alerts
4. Managing connection state and reconnection
5. Processing different message types

By following these patterns, the mobile application can provide real-time safety alerts and communication features to users with minimal latency.