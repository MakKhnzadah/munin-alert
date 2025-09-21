package com.muninalert.backend_munin_alert.repository;

import java.util.List;

import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.muninalert.backend_munin_alert.model.SafeHaven;

/**
 * Repository interface for SafeHaven document operations.
 * Provides methods for querying and manipulating safe haven data in MongoDB,
 * including geospatial queries.
 */
@Repository
public interface SafeHavenRepository extends MongoRepository<SafeHaven, String> {
    
    /**
     * Find all safe havens created by a specific user.
     * 
     * @param userId The ID of the user
     * @return List of safe havens created by the user
     */
    List<SafeHaven> findByUserId(String userId);
    
    /**
     * Find all safe havens shared with a specific group.
     * 
     * @param groupId The ID of the group
     * @return List of safe havens shared with the group
     */
    List<SafeHaven> findByGroupId(String groupId);
    
    /**
     * Find all public safe havens.
     * 
     * @return List of public safe havens
     */
    List<SafeHaven> findByIsPublicTrue();
    
    /**
     * Find safe havens near a specific point within a specified distance.
     * 
     * @param location The point (longitude, latitude)
     * @param distance The distance from the point
     * @return List of safe havens within the specified distance of the point
     */
    List<SafeHaven> findByLocationNear(Point location, Distance distance);
    
    /**
     * Find public safe havens near a specific point within a specified distance.
     * 
     * @param location The point (longitude, latitude)
     * @param distance The distance from the point
     * @return List of public safe havens within the specified distance of the point
     */
    List<SafeHaven> findByIsPublicTrueAndLocationNear(Point location, Distance distance);
    
    /**
     * Find safe havens for a user near a specific point within a specified distance.
     * 
     * @param userId The ID of the user
     * @param location The point (longitude, latitude)
     * @param distance The distance from the point
     * @return List of safe havens for the user within the specified distance of the point
     */
    List<SafeHaven> findByUserIdAndLocationNear(String userId, Point location, Distance distance);
    
    /**
     * Find safe havens for a group near a specific point within a specified distance.
     * 
     * @param groupId The ID of the group
     * @param location The point (longitude, latitude)
     * @param distance The distance from the point
     * @return List of safe havens for the group within the specified distance of the point
     */
    List<SafeHaven> findByGroupIdAndLocationNear(String groupId, Point location, Distance distance);
    
    /**
     * Custom query to find safe havens within a user's access (personal, group, or public).
     * 
     * @param userId The ID of the user
     * @param groupIds List of group IDs the user belongs to
     * @return List of safe havens accessible to the user
     */
    @Query("{ $or: [ { 'userId': ?0 }, { 'groupId': { $in: ?1 } }, { 'isPublic': true } ] }")
    List<SafeHaven> findAccessibleSafeHavens(String userId, List<String> groupIds);
}