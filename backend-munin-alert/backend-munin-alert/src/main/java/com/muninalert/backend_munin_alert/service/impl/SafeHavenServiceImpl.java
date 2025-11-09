package com.muninalert.backend_munin_alert.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import com.muninalert.backend_munin_alert.model.SafeHaven;
import com.muninalert.backend_munin_alert.repository.SafeHavenRepository;
import com.muninalert.backend_munin_alert.service.GroupService;
import com.muninalert.backend_munin_alert.service.SafeHavenService;
import com.muninalert.backend_munin_alert.service.UserService;

/**
 * Implementation of the SafeHavenService interface for managing safe havens.
 * 
 * This service provides methods for creating, retrieving, updating, and deleting
 * safe havens, as well as specialized query methods for geospatial searches.
 */
@Service
public class SafeHavenServiceImpl implements SafeHavenService {
    
    private static final Logger logger = LoggerFactory.getLogger(SafeHavenServiceImpl.class);
    
    private final SafeHavenRepository safeHavenRepository;
    // These services will be used in future implementation
    // private final UserService userService;
    // private final GroupService groupService;
    
    /**
     * Constructor for dependency injection.
     * 
     * @param safeHavenRepository The repository for safe haven operations
     * @param userService The service for user operations
     * @param groupService The service for group operations
     */
    @Autowired
    public SafeHavenServiceImpl(SafeHavenRepository safeHavenRepository, 
                              UserService userService,
                              GroupService groupService) {
        this.safeHavenRepository = safeHavenRepository;
        // These services will be used in future implementation
        // this.userService = userService;
        // this.groupService = groupService;
    }
    
    @Override
    public SafeHaven createSafeHaven(SafeHaven safeHaven) {
        // Set timestamps if not already set
        long currentTime = System.currentTimeMillis();
        if (safeHaven.getCreatedAt() == 0) {
            safeHaven.setCreatedAt(currentTime);
        }
        if (safeHaven.getUpdatedAt() == 0) {
            safeHaven.setUpdatedAt(currentTime);
        }
        
        return safeHavenRepository.save(safeHaven);
    }
    
    @Override
    public Optional<SafeHaven> findSafeHavenById(String id) {
        return safeHavenRepository.findById(id);
    }
    
    @Override
    public List<SafeHaven> findAllSafeHavens() {
        return safeHavenRepository.findAll();
    }
    
    @Override
    public List<SafeHaven> findSafeHavensByUserId(String userId) {
        return safeHavenRepository.findByUserId(userId);
    }
    
    @Override
    public List<SafeHaven> findSafeHavensByGroupId(String groupId) {
        return safeHavenRepository.findByGroupId(groupId);
    }
    
    @Override
    public List<SafeHaven> findPublicSafeHavens() {
        return safeHavenRepository.findByIsPublicTrue();
    }
    
    @Override
    public List<SafeHaven> findSafeHavensNearLocation(double latitude, double longitude, double radiusMeters) {
        Point point = new Point(longitude, latitude);
        Distance distance = new Distance(radiusMeters / 1000, Metrics.KILOMETERS);
        return safeHavenRepository.findByLocationNear(point, distance);
    }
    
    @Override
    public List<SafeHaven> findPublicSafeHavensNearLocation(double latitude, double longitude, double radiusMeters) {
        Point point = new Point(longitude, latitude);
        Distance distance = new Distance(radiusMeters / 1000, Metrics.KILOMETERS);
        return safeHavenRepository.findByIsPublicTrueAndLocationNear(point, distance);
    }
    
    @Override
    public List<SafeHaven> findSafeHavensForUserNearLocation(String userId, double latitude, double longitude, double radiusMeters) {
        Point point = new Point(longitude, latitude);
        Distance distance = new Distance(radiusMeters / 1000, Metrics.KILOMETERS);
        
        // Get user's group IDs
        List<String> groupIds = getUserGroupIds(userId);
        
        // Get all accessible safe havens near the location
        List<SafeHaven> nearbyPersonal = safeHavenRepository.findByUserIdAndLocationNear(userId, point, distance);
        List<SafeHaven> nearbyPublic = safeHavenRepository.findByIsPublicTrueAndLocationNear(point, distance);
        
        List<SafeHaven> nearbyGroup = new ArrayList<>();
        for (String groupId : groupIds) {
            nearbyGroup.addAll(safeHavenRepository.findByGroupIdAndLocationNear(groupId, point, distance));
        }
        
        // Combine and remove duplicates
        List<SafeHaven> allNearby = new ArrayList<>();
        allNearby.addAll(nearbyPersonal);
        allNearby.addAll(nearbyPublic);
        allNearby.addAll(nearbyGroup);
        
        // Remove duplicates by ID
        return allNearby.stream()
                .collect(Collectors.toMap(SafeHaven::getId, sh -> sh, (sh1, sh2) -> sh1))
                .values()
                .stream()
                .toList();
    }
    
    @Override
    public List<SafeHaven> findAccessibleSafeHavens(String userId) {
        List<String> groupIds = getUserGroupIds(userId);
        return safeHavenRepository.findAccessibleSafeHavens(userId, groupIds);
    }
    
    @Override
    public SafeHaven updateSafeHaven(SafeHaven safeHaven) {
        // Ensure the safe haven exists
        if (safeHaven.getId() == null || !safeHavenRepository.existsById(safeHaven.getId())) {
            throw new IllegalArgumentException("Cannot update non-existent safe haven");
        }
        
        // Update the last updated timestamp
        safeHaven.setUpdatedAt(System.currentTimeMillis());
        
        return safeHavenRepository.save(safeHaven);
    }
    
    @Override
    public void deleteSafeHaven(String id) {
        safeHavenRepository.deleteById(id);
    }
    
    @Override
    public Optional<SafeHaven> isLocationInSafeHaven(String userId, double latitude, double longitude) {
        // Convert to GeoJsonPoint
        GeoJsonPoint point = new GeoJsonPoint(longitude, latitude);
        
        // Get all accessible safe havens
        List<SafeHaven> accessibleSafeHavens = findAccessibleSafeHavens(userId);
        
        // Check if the point is within any safe haven
        for (SafeHaven safeHaven : accessibleSafeHavens) {
            if (isPointInSafeHaven(point, safeHaven)) {
                return Optional.of(safeHaven);
            }
        }
        
        return Optional.empty();
    }
    
    /**
     * Helper method to check if a point is within a safe haven.
     * 
     * @param point The point to check
     * @param safeHaven The safe haven to check against
     * @return true if the point is within the safe haven, false otherwise
     */
    private boolean isPointInSafeHaven(GeoJsonPoint point, SafeHaven safeHaven) {
        // Get safe haven location coordinates
        double safeHavenLat = safeHaven.getLocation().getY();
        double safeHavenLon = safeHaven.getLocation().getX();
        
        // Calculate distance between the point and the safe haven center
        double distance = calculateDistance(
                point.getY(), point.getX(),
                safeHavenLat, safeHavenLon
        );
        
        // Check if the distance is less than or equal to the safe haven radius
        return distance <= safeHaven.getRadiusMeters();
    }
    
    /**
     * Helper method to calculate the distance between two points using the Haversine formula.
     * 
     * @param lat1 Latitude of point 1
     * @param lon1 Longitude of point 1
     * @param lat2 Latitude of point 2
     * @param lon2 Longitude of point 2
     * @return The distance between the points in meters
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth radius in meters
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
    
    /**
     * Helper method to get the IDs of groups a user belongs to.
     * 
     * @param userId The ID of the user
     * @return A list of group IDs the user belongs to
     */
    private List<String> getUserGroupIds(String userId) {
        // In a real implementation, this would get the user's groups from the group service
        // For now, just return empty list
        // Future implementation will use: groupService.getGroupsForUser(userId)
        logger.debug("Getting group IDs for user: {}", userId); // Use userId to avoid "never read" warning
        return new ArrayList<>();
    }
}
