package com.muninalert.backend_munin_alert.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.muninalert.backend_munin_alert.model.Alert;
import com.muninalert.backend_munin_alert.model.Location;
import com.muninalert.backend_munin_alert.service.AlertService;

/**
 * Controller for handling WebSocket messages in the Munin Alert application.
 * 
 * This controller handles incoming WebSocket messages from clients and routes them
 * to the appropriate services or directly back to subscribers. It provides endpoints
 * for alerts, location updates, and group messaging.
 */
@Controller
public class WebSocketController {

    /**
     * Messaging template for sending WebSocket messages to clients.
     */
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Service for alert-related operations.
     */
    private final AlertService alertService;

    /**
     * Constructor for dependency injection.
     * 
     * @param messagingTemplate The Spring messaging template for WebSocket communication
     * @param alertService The service for alert-related operations
     */
    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate, AlertService alertService) {
        this.messagingTemplate = messagingTemplate;
        this.alertService = alertService;
    }

    /**
     * Handles incoming alert broadcasts from clients and forwards them to all subscribers.
     * 
     * This endpoint receives alerts from clients at /app/alert and broadcasts them
     * to all subscribers of /topic/alerts.
     * 
     * @param alert The alert object sent by the client
     * @param principal The security principal representing the authenticated user
     * @return The alert object to be broadcast to subscribers
     */
    @MessageMapping("/alert")
    @SendTo("/topic/alerts")
    public Alert broadcastAlert(@Payload Alert alert, Principal principal) {
        // The alert is already processed by the controller before being sent here
        return alert;
    }
    
    /**
     * Handles incoming location updates from clients and forwards them to subscribers.
     * 
     * This endpoint receives location updates for a specific user at /app/location/{userId}
     * and forwards them to subscribers of /topic/location/{userId}.
     * 
     * @param userId The ID of the user whose location is being updated
     * @param location The location object containing the user's position
     */
    @MessageMapping("/location/{userId}")
    public void updateLocation(@DestinationVariable String userId, @Payload Location location) {
        // Send to subscribers of this user's location
        messagingTemplate.convertAndSend("/topic/location/" + userId, location);
    }
    
    /**
     * Handles incoming responses to alerts and updates the alert's response list.
     * 
     * This endpoint receives responses to a specific alert at /app/alert/response/{alertId},
     * updates the alert in the database, and notifies relevant subscribers.
     * 
     * @param alertId The ID of the alert being responded to
     * @param response The response object containing the user's response to the alert
     * @param principal The security principal representing the authenticated user
     */
    @MessageMapping("/alert/response/{alertId}")
    public void respondToAlert(@DestinationVariable String alertId, @Payload Alert.AlertResponse response, Principal principal) {
        // Update the alert with the response
        Alert alert = alertService.findAlertById(alertId).orElse(null);
        if (alert != null) {
            // Add the response to the alert's responses list
            alert.getResponses().add(response);
            
            // Update the alert in the database
            Alert updatedAlert = alertService.updateAlert(alert);
            
            // Notify subscribers about the response
            // This sends to all subscribers tracking responses to this alert
            messagingTemplate.convertAndSend("/topic/alerts/" + alertId + "/responses", response);
            
            // Also send to the user who created the alert (on their private channel)
            // This ensures the alert creator is always notified, even if not actively subscribed
            messagingTemplate.convertAndSend("/queue/user/" + alert.getUserId() + "/alerts/" + alertId, updatedAlert);
        }
    }
    
    /**
     * Handles incoming messages to a group and broadcasts them to all group members.
     * 
     * This endpoint receives messages for a specific group at /app/group/{groupId}
     * and broadcasts them to all subscribers of /topic/group/{groupId}.
     * 
     * @param groupId The ID of the group to receive the message
     * @param message A map containing the message data
     * @return The message map to be broadcast to subscribers
     */
    @MessageMapping("/group/{groupId}")
    @SendTo("/topic/group/{groupId}")
    public Map<String, Object> groupMessage(@DestinationVariable String groupId, @Payload Map<String, Object> message) {
        // Simply broadcast the message to the group
        return message;
    }
}
