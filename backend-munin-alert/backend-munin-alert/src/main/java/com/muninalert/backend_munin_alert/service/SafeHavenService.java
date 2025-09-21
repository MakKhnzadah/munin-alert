package com.muninalert.backend_munin_alert.service;

import java.util.List;
import java.util.Optional;

import com.muninalert.backend_munin_alert.model.SafeHaven;

/**
 * Service interface for managing safe havens in the Munin Alert system.
 * 
 * This service provides methods for creating, retrieving, updating, and deleting
 * safe havens, as well as specialized query methods for geospatial searches.
 */
public interface SafeHavenService {
    
    /**
     * Creates a new safe haven in the system.
     * 
     * @param safeHaven The safe haven object to create
     * @return The created safe haven with generated ID
     */
    SafeHaven createSafeHaven(SafeHaven safeHaven);
    
    /**
     * Finds a safe haven by its unique identifier.
     * 
     * @param id The unique identifier of the safe haven
     * @return An Optional containing the safe haven if found, or empty if not found
     */
    Optional<SafeHaven> findSafeHavenById(String id);
    
    /**
     * Retrieves all safe havens in the system.
     * 
     * @return A list of all safe havens
     */
    List<SafeHaven> findAllSafeHavens();
    
    /**
     * Finds all safe havens created by a specific user.
     * 
     * @param userId The ID of the user
     * @return A list of safe havens created by the user
     */
    List<SafeHaven> findSafeHavensByUserId(String userId);
    
    /**
     * Finds all safe havens shared with a specific group.
     * 
     * @param groupId The ID of the group
     * @return A list of safe havens shared with the group
     */
    List<SafeHaven> findSafeHavensByGroupId(String groupId);
    
    /**
     * Finds all public safe havens.
     * 
     * @return A list of public safe havens
     */
    List<SafeHaven> findPublicSafeHavens();
    
    /**
     * Finds safe havens near a specific location within a specified distance.
     * 
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radiusMeters The search radius in meters
     * @return A list of safe havens within the specified radius of the location
     */
    List<SafeHaven> findSafeHavensNearLocation(double latitude, double longitude, double radiusMeters);
    
    /**
     * Finds public safe havens near a specific location within a specified distance.
     * 
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radiusMeters The search radius in meters
     * @return A list of public safe havens within the specified radius of the location
     */
    List<SafeHaven> findPublicSafeHavensNearLocation(double latitude, double longitude, double radiusMeters);
    
    /**
     * Finds safe havens for a user near a specific location within a specified distance.
     * 
     * @param userId The ID of the user
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radiusMeters The search radius in meters
     * @return A list of safe havens for the user within the specified radius of the location
     */
    List<SafeHaven> findSafeHavensForUserNearLocation(String userId, double latitude, double longitude, double radiusMeters);
    
    /**
     * Finds all safe havens accessible to a user (personal, group, or public).
     * 
     * @param userId The ID of the user
     * @return A list of safe havens accessible to the user
     */
    List<SafeHaven> findAccessibleSafeHavens(String userId);
    
    /**
     * Updates an existing safe haven with new information.
     * 
     * @param safeHaven The safe haven object with updated information
     * @return The updated safe haven
     */
    SafeHaven updateSafeHaven(SafeHaven safeHaven);
    
    /**
     * Deletes a safe haven from the system.
     * 
     * @param id The unique identifier of the safe haven to delete
     */
    void deleteSafeHaven(String id);
    
    /**
     * Checks if a location is within any safe haven accessible to a user.
     * 
     * @param userId The ID of the user
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @return The safe haven the location is within, or empty if not within any safe haven
     */
    Optional<SafeHaven> isLocationInSafeHaven(String userId, double latitude, double longitude);
}
