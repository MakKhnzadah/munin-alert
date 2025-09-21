package com.muninalert.backend_munin_alert.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import com.muninalert.backend_munin_alert.model.RiskAlert;
import com.muninalert.backend_munin_alert.repository.RiskAlertRepository;
import com.muninalert.backend_munin_alert.service.RiskAlertService;

/**
 * Implementation of the RiskAlertService interface for managing risk alerts.
 * 
 * This service provides methods for creating, retrieving, updating, and deleting risk alerts,
 * as well as specialized query methods including geospatial queries.
 */
@Service
public class RiskAlertServiceImpl implements RiskAlertService {
    
    private final RiskAlertRepository riskAlertRepository;
    
    /**
     * Constructor for dependency injection.
     * 
     * @param riskAlertRepository The repository for risk alert operations
     */
    @Autowired
    public RiskAlertServiceImpl(RiskAlertRepository riskAlertRepository) {
        this.riskAlertRepository = riskAlertRepository;
    }
    
    @Override
    public RiskAlert createRiskAlert(RiskAlert riskAlert) {
        // Set creation time if not already set
        if (riskAlert.getCreatedAt() == 0) {
            riskAlert.setCreatedAt(System.currentTimeMillis());
        }
        
        // If expiration time is not set, default to 24 hours from now
        if (riskAlert.getExpiresAt() == 0) {
            riskAlert.setExpiresAt(System.currentTimeMillis() + (24 * 60 * 60 * 1000));
        }
        
        return riskAlertRepository.save(riskAlert);
    }
    
    @Override
    public Optional<RiskAlert> findRiskAlertById(String id) {
        return riskAlertRepository.findById(id);
    }
    
    @Override
    public List<RiskAlert> findAllRiskAlerts() {
        return riskAlertRepository.findAll();
    }
    
    @Override
    public List<RiskAlert> findRiskAlertsByType(RiskAlert.RiskType riskType) {
        return riskAlertRepository.findByRiskType(riskType);
    }
    
    @Override
    public List<RiskAlert> findRiskAlertsByLevel(RiskAlert.RiskLevel riskLevel) {
        return riskAlertRepository.findByRiskLevel(riskLevel);
    }
    
    @Override
    public List<RiskAlert> findRiskAlertsNearLocation(double latitude, double longitude, double radiusMeters) {
        Point point = new Point(longitude, latitude);
        Distance distance = new Distance(radiusMeters / 1000, Metrics.KILOMETERS);
        return riskAlertRepository.findByLocationNear(point, distance);
    }
    
    @Override
    public List<RiskAlert> findActiveRiskAlerts() {
        long currentTime = System.currentTimeMillis();
        return riskAlertRepository.findByExpiresAtGreaterThan(currentTime);
    }
    
    @Override
    public List<RiskAlert> findActiveRiskAlertsNearLocation(double latitude, double longitude, double radiusMeters) {
        long currentTime = System.currentTimeMillis();
        Point point = new Point(longitude, latitude);
        return riskAlertRepository.findActiveRiskAlertsNear(currentTime, point, radiusMeters);
    }
    
    @Override
    public List<RiskAlert> findActiveRiskAlertsByLevelNearLocation(RiskAlert.RiskLevel minRiskLevel, double latitude, double longitude, double radiusMeters) {
        long currentTime = System.currentTimeMillis();
        Point point = new Point(longitude, latitude);
        return riskAlertRepository.findActiveRiskAlertsByLevelNear(currentTime, minRiskLevel, point, radiusMeters);
    }
    
    @Override
    public RiskAlert updateRiskAlert(RiskAlert riskAlert) {
        // Ensure the risk alert exists
        if (riskAlert.getId() == null || !riskAlertRepository.existsById(riskAlert.getId())) {
            throw new IllegalArgumentException("Cannot update non-existent risk alert");
        }
        
        return riskAlertRepository.save(riskAlert);
    }
    
    @Override
    public void deleteRiskAlert(String id) {
        riskAlertRepository.deleteById(id);
    }
    
    @Override
    public int expireOldRiskAlerts() {
        long currentTime = System.currentTimeMillis();
        List<RiskAlert> expiredAlerts = riskAlertRepository.findAll().stream()
                .filter(alert -> alert.getExpiresAt() < currentTime)
                .toList();
        
        if (!expiredAlerts.isEmpty()) {
            riskAlertRepository.deleteAll(expiredAlerts);
        }
        
        return expiredAlerts.size();
    }
}