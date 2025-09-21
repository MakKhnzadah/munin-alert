package com.muninalert.backend_munin_alert.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.muninalert.backend_munin_alert.model.Event;

/**
 * Repository interface for Event document operations.
 * Provides methods for querying and manipulating event data in MongoDB.
 */
@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    
    /**
     * Find all events for a specific user.
     * 
     * @param userId The ID of the user
     * @return List of events belonging to the user
     */
    List<Event> findByUserId(String userId);
    
    /**
     * Find all events of a specific type.
     * 
     * @param eventType The type of event to find
     * @return List of events matching the event type
     */
    List<Event> findByEventType(Event.EventType eventType);
    
    /**
     * Find all events for a specific user and event type.
     * 
     * @param userId The ID of the user
     * @param eventType The type of event to find
     * @return List of events matching both user ID and event type
     */
    List<Event> findByUserIdAndEventType(String userId, Event.EventType eventType);
    
    /**
     * Find all events for a specific device.
     * 
     * @param deviceId The ID of the device
     * @return List of events from the device
     */
    List<Event> findByDeviceId(String deviceId);
    
    /**
     * Find all events that occurred after a specific timestamp.
     * 
     * @param timestamp The timestamp in milliseconds
     * @return List of events after the specified timestamp
     */
    List<Event> findByTimestampGreaterThan(long timestamp);
    
    /**
     * Find all events for a specific user after a specific timestamp.
     * 
     * @param userId The ID of the user
     * @param timestamp The timestamp in milliseconds
     * @return List of events for the user after the specified timestamp
     */
    List<Event> findByUserIdAndTimestampGreaterThan(String userId, long timestamp);
    
    /**
     * Find events with confidence score above a threshold.
     * 
     * @param confidenceThreshold The minimum confidence score
     * @return List of events with confidence above the threshold
     */
    List<Event> findByConfidenceGreaterThanEqual(double confidenceThreshold);
    
    /**
     * Custom query to find the most recent events for a user, limited by count.
     * 
     * @param userId The ID of the user
     * @param limit The maximum number of events to return
     * @return List of the most recent events for the user
     */
    @Query(value = "{ 'userId': ?0 }", sort = "{ 'timestamp': -1 }")
    List<Event> findMostRecentByUser(String userId, int limit);
}