package com.muninalert.backend_munin_alert.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.muninalert.backend_munin_alert.model.Alert;
import com.muninalert.backend_munin_alert.model.Location;
import com.muninalert.backend_munin_alert.model.Message;
import com.muninalert.backend_munin_alert.service.WebSocketService;

/**
 * Implementation of the WebSocketService interface for real-time communication.
 * 
 * This service provides methods to send messages, alerts, location updates, and notifications
 * to connected clients using WebSocket protocol. It utilizes Spring's SimpMessagingTemplate
 * to handle the underlying message sending functionality.
 */
@Service
public class WebSocketServiceImpl implements WebSocketService {

    /**
     * Spring's messaging template for sending WebSocket messages to clients.
     * This template handles the conversion of Java objects to message payloads
     * and delivers them to the appropriate WebSocket destinations.
     */
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Constructor for dependency injection of the messaging template.
     * 
     * @param messagingTemplate The Spring messaging template for sending WebSocket messages
     */
    @Autowired
    public WebSocketServiceImpl(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * {@inheritDoc}
     * Broadcasts an alert to all subscribers and optionally to a specific group.
     * The alert is sent to two destinations:
     * 1. /topic/alerts - for all users subscribed to the global alerts
     * 2. /topic/group/{groupId}/alerts - for members of a specific group (if applicable)
     */
    @Override
    public void broadcastAlert(Alert alert) {
        // Send to the global alerts topic
        messagingTemplate.convertAndSend("/topic/alerts", alert);
        
        // Also send to the specific group if applicable
        if (alert.getGroupId() != null && !alert.getGroupId().isEmpty()) {
            messagingTemplate.convertAndSend("/topic/group/" + alert.getGroupId() + "/alerts", alert);
        }
    }

    /**
     * {@inheritDoc}
     * Sends a location update for a specific user to all subscribers tracking that user.
     * Location updates are useful for tracking the position of users during emergencies.
     */
    @Override
    public void sendLocationUpdate(String userId, Location location) {
        messagingTemplate.convertAndSend("/topic/location/" + userId, location);
    }

    /**
     * {@inheritDoc}
     * Sends a response to an alert to all subscribers tracking that alert.
     * This allows users to see real-time responses to emergency situations.
     */
    @Override
    public void sendAlertResponse(String alertId, Alert.AlertResponse response) {
        messagingTemplate.convertAndSend("/topic/alerts/" + alertId + "/responses", response);
    }

    /**
     * {@inheritDoc}
     * Sends an alert status update to multiple destinations to ensure all interested
     * parties are notified of changes to the alert's status.
     */
    @Override
    public void sendAlertStatusUpdate(Alert alert) {
        // Send to all subscribers of the alert
        messagingTemplate.convertAndSend("/topic/alerts/" + alert.getId(), alert);
        
        // Also send to the user who created the alert (private channel)
        messagingTemplate.convertAndSend("/queue/user/" + alert.getUserId() + "/alerts/" + alert.getId(), alert);
        
        // Also send to the group if applicable
        if (alert.getGroupId() != null && !alert.getGroupId().isEmpty()) {
            messagingTemplate.convertAndSend("/topic/group/" + alert.getGroupId() + "/alerts/" + alert.getId(), alert);
        }
    }

    /**
     * {@inheritDoc}
     * Sends a message to all members of a specific group.
     * This enables group chat functionality for communication among group members.
     */
    @Override
    public void sendGroupMessage(String groupId, Message message) {
        messagingTemplate.convertAndSend("/topic/group/" + groupId + "/messages", message);
    }

    /**
     * {@inheritDoc}
     * Sends a direct message to a specific user through their private message queue.
     * This enables private messaging functionality between users.
     */
    @Override
    public void sendDirectMessage(String userId, Message message) {
        messagingTemplate.convertAndSend("/queue/user/" + userId + "/messages", message);
    }

    /**
     * {@inheritDoc}
     * Sends a system notification to a specific user.
     * The notification includes metadata such as type and timestamp.
     */
    @Override
    public void sendSystemNotification(String userId, String message) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "SYSTEM");
        notification.put("message", message);
        notification.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/queue/user/" + userId + "/notifications", notification);
    }

    /**
     * {@inheritDoc}
     * Sends a system notification to all members of a specific group.
     * The notification includes metadata such as type and timestamp.
     */
    @Override
    public void sendGroupNotification(String groupId, String message) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "SYSTEM");
        notification.put("message", message);
        notification.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/group/" + groupId + "/notifications", notification);
    }

    /**
     * {@inheritDoc}
     * Sends a custom payload to a specific destination.
     * This is a utility method for sending arbitrary data to any WebSocket destination.
     */
    @Override
    public void sendToDestination(String destination, Object payload) {
        messagingTemplate.convertAndSend(destination, payload);
    }
}
