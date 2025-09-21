package com.muninalert.backend_munin_alert.service;

import java.util.List;
import java.util.Optional;

import com.muninalert.backend_munin_alert.model.Alert;

/**
 * Service interface for managing alerts in the Munin Alert system.
 * 
 * This service provides methods for creating, retrieving, updating, and deleting alerts,
 * as well as specialized query methods for finding alerts by various criteria.
 */
public interface AlertService {
    /**
     * Creates a new alert in the system.
     * 
     * @param alert The alert object to create
     * @return The created alert with generated ID and timestamps
     */
    Alert createAlert(Alert alert);
    
    /**
     * Finds an alert by its unique identifier.
     * 
     * @param id The unique identifier of the alert
     * @return An Optional containing the alert if found, or empty if not found
     */
    Optional<Alert> findAlertById(String id);
    
    /**
     * Retrieves all alerts in the system.
     * 
     * @return A list of all alerts
     */
    List<Alert> findAllAlerts();
    
    /**
     * Finds all alerts created by a specific user.
     * 
     * @param userId The unique identifier of the user
     * @return A list of alerts created by the user
     */
    List<Alert> findAlertsByUserId(String userId);
    
    /**
     * Finds all alerts shared with a specific group.
     * 
     * @param groupId The unique identifier of the group
     * @return A list of alerts shared with the group
     */
    List<Alert> findAlertsByGroupId(String groupId);
    
    /**
     * Finds alerts near a geographic location within a specified radius.
     * 
     * @param latitude The latitude coordinate of the center point
     * @param longitude The longitude coordinate of the center point
     * @param radius The search radius in kilometers
     * @return A list of alerts within the specified radius of the location
     */
    List<Alert> findAlertsNearLocation(double latitude, double longitude, double radius);
    
    /**
     * Updates an existing alert with new information.
     * 
     * @param alert The alert object with updated information
     * @return The updated alert
     */
    Alert updateAlert(Alert alert);
    
    /**
     * Updates the status of an existing alert.
     * 
     * @param id The unique identifier of the alert
     * @param status The new status for the alert
     * @return The updated alert
     */
    Alert updateAlertStatus(String id, Alert.AlertStatus status);
    
    /**
     * Deletes an alert from the system.
     * 
     * @param id The unique identifier of the alert to delete
     */
    void deleteAlert(String id);
}
