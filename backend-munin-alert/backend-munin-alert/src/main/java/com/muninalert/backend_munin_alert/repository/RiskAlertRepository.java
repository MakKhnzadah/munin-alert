package com.muninalert.backend_munin_alert.repository;

import java.util.List;

import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.muninalert.backend_munin_alert.model.RiskAlert;

/**
 * Repository interface for RiskAlert document operations.
 * Provides methods for querying and manipulating risk alert data in MongoDB,
 * including geospatial and time-based queries.
 */
@Repository
public interface RiskAlertRepository extends MongoRepository<RiskAlert, String> {
    
    /**
     * Find all risk alerts of a specific type.
     * 
     * @param riskType The type of risk
     * @return List of risk alerts of the specified type
     */
    List<RiskAlert> findByRiskType(RiskAlert.RiskType riskType);
    
    /**
     * Find all risk alerts with a specific risk level.
     * 
     * @param riskLevel The level of risk
     * @return List of risk alerts with the specified risk level
     */
    List<RiskAlert> findByRiskLevel(RiskAlert.RiskLevel riskLevel);
    
    /**
     * Find all risk alerts from a specific source.
     * 
     * @param source The source of the risk alerts
     * @return List of risk alerts from the specified source
     */
    List<RiskAlert> findBySource(String source);
    
    /**
     * Find risk alerts near a specific point within a specified distance.
     * 
     * @param location The point (longitude, latitude)
     * @param distance The distance from the point
     * @return List of risk alerts within the specified distance of the point
     */
    List<RiskAlert> findByLocationNear(Point location, Distance distance);
    
    /**
     * Find risk alerts of a specific type near a specific point within a specified distance.
     * 
     * @param riskType The type of risk
     * @param location The point (longitude, latitude)
     * @param distance The distance from the point
     * @return List of risk alerts of the specified type within the specified distance of the point
     */
    List<RiskAlert> findByRiskTypeAndLocationNear(RiskAlert.RiskType riskType, Point location, Distance distance);
    
    /**
     * Find active risk alerts (not expired).
     * 
     * @param currentTime The current time in milliseconds
     * @return List of active risk alerts
     */
    List<RiskAlert> findByExpiresAtGreaterThan(long currentTime);
    
    /**
     * Find active risk alerts (not expired) near a specific point within a specified distance.
     * 
     * @param currentTime The current time in milliseconds
     * @param location The point (longitude, latitude)
     * @param distance The distance from the point
     * @return List of active risk alerts within the specified distance of the point
     */
    @Query("{ 'expiresAt': { $gt: ?0 }, 'location': { $near: { $geometry: { type: 'Point', coordinates: [?1.x, ?1.y] }, $maxDistance: ?2 } } }")
    List<RiskAlert> findActiveRiskAlertsNear(long currentTime, Point location, double maxDistanceMeters);
    
    /**
     * Find risk alerts with a minimum risk level (equal to or higher than the specified level).
     * 
     * @param minRiskLevel The minimum risk level
     * @return List of risk alerts with the minimum risk level or higher
     */
    @Query("{ 'riskLevel': { $gte: ?0 } }")
    List<RiskAlert> findByMinimumRiskLevel(RiskAlert.RiskLevel minRiskLevel);
    
    /**
     * Find active risk alerts (not expired) with a minimum risk level near a specific point.
     * 
     * @param currentTime The current time in milliseconds
     * @param minRiskLevel The minimum risk level
     * @param location The point (longitude, latitude)
     * @param maxDistanceMeters The maximum distance in meters from the point
     * @return List of active risk alerts with the minimum risk level within the specified distance
     */
    @Query("{ 'expiresAt': { $gt: ?0 }, 'riskLevel': { $gte: ?1 }, 'location': { $near: { $geometry: { type: 'Point', coordinates: [?2.x, ?2.y] }, $maxDistance: ?3 } } }")
    List<RiskAlert> findActiveRiskAlertsByLevelNear(long currentTime, RiskAlert.RiskLevel minRiskLevel, Point location, double maxDistanceMeters);
}