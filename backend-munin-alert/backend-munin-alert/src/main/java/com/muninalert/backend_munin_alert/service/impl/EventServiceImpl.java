package com.muninalert.backend_munin_alert.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.muninalert.backend_munin_alert.model.Alert;
import com.muninalert.backend_munin_alert.model.Event;
import com.muninalert.backend_munin_alert.model.Location;
import com.muninalert.backend_munin_alert.model.User;
import com.muninalert.backend_munin_alert.repository.EventRepository;
import com.muninalert.backend_munin_alert.service.AlertService;
import com.muninalert.backend_munin_alert.service.EventService;
import com.muninalert.backend_munin_alert.service.UserService;
import com.muninalert.backend_munin_alert.service.WebSocketService;

/**
 * Implementation of the EventService interface for managing events.
 * 
 * This service provides methods for creating, retrieving, and analyzing
 * safety-related events, as well as processing events to generate alerts
 * and notifications.
 */
@Service
public class EventServiceImpl implements EventService {
    
    private final EventRepository eventRepository;
    private final AlertService alertService;
    private final UserService userService;
    private final WebSocketService webSocketService;
    
    /**
     * Constructor for dependency injection.
     * 
     * @param eventRepository The repository for event operations
     * @param alertService The service for alert operations
     * @param userService The service for user operations
     * @param webSocketService The service for WebSocket operations
     */
    @Autowired
    public EventServiceImpl(EventRepository eventRepository, 
                          AlertService alertService,
                          UserService userService,
                          WebSocketService webSocketService) {
        this.eventRepository = eventRepository;
        this.alertService = alertService;
        this.userService = userService;
        this.webSocketService = webSocketService;
    }
    
    @Override
    public Event createEvent(Event event) {
        // Set the timestamp if not already set
        if (event.getTimestamp() == 0) {
            event.setTimestamp(System.currentTimeMillis());
        }
        
        return eventRepository.save(event);
    }
    
    @Override
    public Optional<Event> findEventById(String id) {
        return eventRepository.findById(id);
    }
    
    @Override
    public List<Event> findAllEvents() {
        return eventRepository.findAll();
    }
    
    @Override
    public List<Event> findEventsByUserId(String userId) {
        return eventRepository.findByUserId(userId);
    }
    
    @Override
    public List<Event> findEventsByType(Event.EventType eventType) {
        return eventRepository.findByEventType(eventType);
    }
    
    @Override
    public List<Event> findEventsByUserIdAndType(String userId, Event.EventType eventType) {
        return eventRepository.findByUserIdAndEventType(userId, eventType);
    }
    
    @Override
    public List<Event> findEventsByDeviceId(String deviceId) {
        return eventRepository.findByDeviceId(deviceId);
    }
    
    @Override
    public List<Event> findEventsAfterTimestamp(long timestamp) {
        return eventRepository.findByTimestampGreaterThan(timestamp);
    }
    
    @Override
    public List<Event> findEventsByUserIdAfterTimestamp(String userId, long timestamp) {
        return eventRepository.findByUserIdAndTimestampGreaterThan(userId, timestamp);
    }
    
    @Override
    public List<Event> findEventsByMinimumConfidence(double confidenceThreshold) {
        return eventRepository.findByConfidenceGreaterThanEqual(confidenceThreshold);
    }
    
    @Override
    public List<Event> findMostRecentEventsByUser(String userId, int limit) {
        return eventRepository.findMostRecentByUser(userId, limit);
    }
    
    @Override
    public Event processNewEvent(Event event) {
        // Save the event first
        Event savedEvent = createEvent(event);
        
        // Process based on event type using modern switch expression
        switch (event.getEventType()) {
            case FALL_DETECTED, COLLISION_DETECTED, RAPID_DECELERATION -> {
                // For critical safety events, generate an alert if confidence is high enough
                if (event.getConfidence() >= 0.7) {
                    generateAlertFromEvent(event);
                }
            }
                
            case UNUSUAL_MOVEMENT, INACTIVITY -> {
                // For potential safety issues, generate an alert if confidence is very high
                if (event.getConfidence() >= 0.9) {
                    generateAlertFromEvent(event);
                }
            }
                
            case MANUAL_ALERT -> 
                // Always generate an alert for manual triggers
                generateAlertFromEvent(event);
                
            case ENTER_RISK_AREA -> 
                // Send notification but don't generate alert
                notifyUserOfRiskArea(event);
                
            case ENTER_SAFEHAVEN, EXIT_SAFEHAVEN, EXIT_RISK_AREA -> 
                // Just record these events, no immediate action needed
                {}
        }
        
        // Update user's last known location if available
        if (event.getLocation() != null) {
            updateUserLocation(event.getUserId(), event.getLocation());
        }
        
        return savedEvent;
    }
    
    @Override
    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }
    
    @Override
    public int deleteEventsOlderThan(long timestamp) {
        List<Event> oldEvents = eventRepository.findAll().stream()
                .filter(event -> event.getTimestamp() < timestamp)
                .toList();
        
        if (!oldEvents.isEmpty()) {
            eventRepository.deleteAll(oldEvents);
        }
        
        return oldEvents.size();
    }
    
    /**
     * Helper method to generate an alert from an event.
     * 
     * @param event The event to generate an alert from
     * @return The generated alert
     */
    private Alert generateAlertFromEvent(Event event) {
        Alert alert = new Alert();
        alert.setUserId(event.getUserId());
        alert.setLocation(event.getLocation());
        alert.setCreatedAt(System.currentTimeMillis());
        alert.setUpdatedAt(System.currentTimeMillis());
        
        // Map event type to alert type using modern switch expression
        switch (event.getEventType()) {
            case FALL_DETECTED -> {
                alert.setAlertType(Alert.AlertType.FALL_DETECTED);
                alert.setMessage("Fall detected. User may need assistance.");
            }
            case COLLISION_DETECTED -> {
                alert.setAlertType(Alert.AlertType.COLLISION_DETECTED);
                alert.setMessage("Collision detected. User may need assistance.");
            }
            case RAPID_DECELERATION -> {
                alert.setAlertType(Alert.AlertType.COLLISION_DETECTED);
                alert.setMessage("Rapid deceleration detected. User may need assistance.");
            }
            case INACTIVITY -> {
                alert.setAlertType(Alert.AlertType.INACTIVITY);
                alert.setMessage("Unusual inactivity detected. User may need assistance.");
            }
            case MANUAL_ALERT -> {
                alert.setAlertType(Alert.AlertType.MANUAL);
                alert.setMessage("User has manually triggered an alert.");
            }
            default -> {
                alert.setAlertType(Alert.AlertType.MANUAL);
                alert.setMessage("Alert triggered due to safety event.");
            }
        }
        
        // Find user's group and add to alert
        Optional<User> userOpt = userService.getUserById(event.getUserId());
        if (userOpt.isPresent()) {
            // In a real implementation, we would get the user's primary group
            // This is a placeholder
            // alert.setGroupId(userOpt.get().getPrimaryGroupId());
        }
        
        // Save and broadcast the alert
        Alert savedAlert = alertService.createAlert(alert);
        webSocketService.broadcastAlert(savedAlert);
        
        return savedAlert;
    }
    
    /**
     * Helper method to notify a user they've entered a risk area.
     * 
     * @param event The enter risk area event
     */
    private void notifyUserOfRiskArea(Event event) {
        // Send a system notification to the user
        webSocketService.sendSystemNotification(
            event.getUserId(),
            "You have entered an area with an active safety risk. Please be cautious."
        );
    }
    
    /**
     * Helper method to update a user's last known location.
     * 
     * @param userId The ID of the user
     * @param location The user's new location
     */
    private void updateUserLocation(String userId, Location location) {
        userService.getUserById(userId).ifPresent(user -> {
            user.setLastKnownLocation(location);
            userService.updateUser(user);
            
            // Broadcast location update via WebSocket
            webSocketService.sendLocationUpdate(userId, location);
        });
    }
}
