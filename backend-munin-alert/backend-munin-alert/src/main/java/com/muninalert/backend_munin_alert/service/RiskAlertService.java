package com.muninalert.backend_munin_alert.service;

import java.util.List;
import java.util.Optional;

import com.muninalert.backend_munin_alert.model.RiskAlert;

/**
 * Service interface for managing risk alerts in the Munin Alert system.
 * 
 * This service provides methods for creating, retrieving, updating, and deleting risk alerts,
 * as well as specialized query methods for finding risk alerts by various criteria including
 * geospatial and time-based queries.
 */
public interface RiskAlertService {
    
    /**
     * Creates a new risk alert in the system.
     * 
     * @param riskAlert The risk alert object to create
     * @return The created risk alert with generated ID
     */
    RiskAlert createRiskAlert(RiskAlert riskAlert);
    
    /**
     * Finds a risk alert by its unique identifier.
     * 
     * @param id The unique identifier of the risk alert
     * @return An Optional containing the risk alert if found, or empty if not found
     */
    Optional<RiskAlert> findRiskAlertById(String id);
    
    /**
     * Retrieves all risk alerts in the system.
     * 
     * @return A list of all risk alerts
     */
    List<RiskAlert> findAllRiskAlerts();
    
    /**
     * Finds all risk alerts of a specific type.
     * 
     * @param riskType The type of risk
     * @return A list of risk alerts of the specified type
     */
    List<RiskAlert> findRiskAlertsByType(RiskAlert.RiskType riskType);
    
    /**
     * Finds all risk alerts with a specific risk level.
     * 
     * @param riskLevel The level of risk
     * @return A list of risk alerts with the specified risk level
     */
    List<RiskAlert> findRiskAlertsByLevel(RiskAlert.RiskLevel riskLevel);
    
    /**
     * Finds all risk alerts near a specific location within a specified distance.
     * 
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radiusMeters The search radius in meters
     * @return A list of risk alerts within the specified radius of the location
     */
    List<RiskAlert> findRiskAlertsNearLocation(double latitude, double longitude, double radiusMeters);
    
    /**
     * Finds all active (non-expired) risk alerts.
     * 
     * @return A list of active risk alerts
     */
    List<RiskAlert> findActiveRiskAlerts();
    
    /**
     * Finds all active risk alerts near a specific location within a specified distance.
     * 
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radiusMeters The search radius in meters
     * @return A list of active risk alerts within the specified radius of the location
     */
    List<RiskAlert> findActiveRiskAlertsNearLocation(double latitude, double longitude, double radiusMeters);
    
    /**
     * Finds all active risk alerts with a minimum risk level near a specific location.
     * 
     * @param minRiskLevel The minimum risk level
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radiusMeters The search radius in meters
     * @return A list of active risk alerts with at least the specified risk level within the radius
     */
    List<RiskAlert> findActiveRiskAlertsByLevelNearLocation(RiskAlert.RiskLevel minRiskLevel, double latitude, double longitude, double radiusMeters);
    
    /**
     * Updates an existing risk alert with new information.
     * 
     * @param riskAlert The risk alert object with updated information
     * @return The updated risk alert
     */
    RiskAlert updateRiskAlert(RiskAlert riskAlert);
    
    /**
     * Deletes a risk alert from the system.
     * 
     * @param id The unique identifier of the risk alert to delete
     */
    void deleteRiskAlert(String id);
    
    /**
     * Expires all risk alerts that have passed their expiration time.
     * This is typically called by a scheduled task.
     * 
     * @return The number of risk alerts that were deleted
     */
    int expireOldRiskAlerts();
}