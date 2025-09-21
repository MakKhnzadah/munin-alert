package com.muninalert.backend_munin_alert.service;

import com.muninalert.backend_munin_alert.model.Alert;
import com.muninalert.backend_munin_alert.model.Location;
import com.muninalert.backend_munin_alert.model.Message;

/**
 * Service interface for WebSocket communication in the Munin Alert application.
 * 
 * This interface defines methods for real-time communication between users and groups,
 * including broadcasting alerts, sending location updates, and messaging functionality.
 * The implementation uses Spring's WebSocket support with STOMP protocol.
 */
public interface WebSocketService {
    /**
     * Broadcasts an alert to all subscribers of the alerts topic.
     * This is used for emergency notifications that need to be distributed to all users or specific groups.
     *
     * @param alert The alert object containing details about the emergency situation
     */
    void broadcastAlert(Alert alert);
    
    /**
     * Sends a location update for a specific user to all subscribers of that user's location.
     * This enables real-time tracking of a user's position during emergencies or group activities.
     *
     * @param userId The unique identifier of the user whose location is being updated
     * @param location The location object containing coordinates and other relevant information
     */
    void sendLocationUpdate(String userId, Location location);
    
    /**
     * Sends a response notification for a specific alert.
     * This allows users to respond to alerts (e.g., acknowledge, offer help, etc.) and
     * have those responses communicated to interested parties.
     *
     * @param alertId The unique identifier of the alert being responded to
     * @param response The response object containing the response details and responder information
     */
    void sendAlertResponse(String alertId, Alert.AlertResponse response);
    
    /**
     * Sends a status update for a specific alert.
     * This communicates changes in the alert's status (e.g., active, resolved, canceled) to subscribers.
     *
     * @param alert The updated alert object with the new status information
     */
    void sendAlertStatusUpdate(Alert alert);
    
    /**
     * Sends a message to a specific group.
     * This enables group chat functionality for communication among group members.
     *
     * @param groupId The unique identifier of the group to receive the message
     * @param message The message object containing the message content and metadata
     */
    void sendGroupMessage(String groupId, Message message);
    
    /**
     * Sends a direct message to a specific user.
     * This enables private messaging functionality between users.
     *
     * @param userId The unique identifier of the user to receive the message
     * @param message The message object containing the message content and metadata
     */
    void sendDirectMessage(String userId, Message message);
    
    /**
     * Sends a system notification to a specific user.
     * This is used for application-generated notifications such as account updates,
     * friend requests, or other system events.
     *
     * @param userId The unique identifier of the user to receive the notification
     * @param message The text content of the notification
     */
    void sendSystemNotification(String userId, String message);
    
    /**
     * Sends a system notification to a specific group.
     * This is used for application-generated notifications about group events,
     * such as member joins/leaves, group settings changes, etc.
     *
     * @param groupId The unique identifier of the group to receive the notification
     * @param message The text content of the notification
     */
    void sendGroupNotification(String groupId, String message);
    
    /**
     * Sends a custom payload to a specific destination.
     * This is a utility method for sending arbitrary data to any WebSocket destination,
     * allowing for flexibility in communication patterns.
     *
     * @param destination The WebSocket destination to send the payload to
     * @param payload The object to be sent as the payload
     */
    void sendToDestination(String destination, Object payload);
}
