package com.muninalert.backend_munin_alert.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.muninalert.backend_munin_alert.model.RiskAlert;
import com.muninalert.backend_munin_alert.service.RiskAlertService;

/**
 * REST Controller for risk alert operations.
 * 
 * This controller provides endpoints for creating, retrieving, updating, and deleting
 * risk alerts, as well as specialized endpoints for geospatial and type-based queries.
 */
@RestController
@RequestMapping("/api/risk-alerts")
public class RiskAlertController {
    
    private final RiskAlertService riskAlertService;
    
    /**
     * Constructor for dependency injection.
     * 
     * @param riskAlertService The service for risk alert operations
     */
    @Autowired
    public RiskAlertController(RiskAlertService riskAlertService) {
        this.riskAlertService = riskAlertService;
    }
    
    /**
     * Get all risk alerts.
     * 
     * @return ResponseEntity containing a list of all risk alerts
     */
    @GetMapping
    public ResponseEntity<List<RiskAlert>> getAllRiskAlerts() {
        List<RiskAlert> riskAlerts = riskAlertService.findAllRiskAlerts();
        return ResponseEntity.ok(riskAlerts);
    }
    
    /**
     * Get a specific risk alert by ID.
     * 
     * @param id The ID of the risk alert to retrieve
     * @return ResponseEntity containing the risk alert if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<RiskAlert> getRiskAlertById(@PathVariable String id) {
        return riskAlertService.findRiskAlertById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get risk alerts by type.
     * 
     * @param type The type of risk alerts to retrieve
     * @return ResponseEntity containing a list of matching risk alerts
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<RiskAlert>> getRiskAlertsByType(@PathVariable RiskAlert.RiskType type) {
        List<RiskAlert> riskAlerts = riskAlertService.findRiskAlertsByType(type);
        return ResponseEntity.ok(riskAlerts);
    }
    
    /**
     * Get risk alerts by risk level.
     * 
     * @param level The risk level to filter by
     * @return ResponseEntity containing a list of matching risk alerts
     */
    @GetMapping("/level/{level}")
    public ResponseEntity<List<RiskAlert>> getRiskAlertsByLevel(@PathVariable RiskAlert.RiskLevel level) {
        List<RiskAlert> riskAlerts = riskAlertService.findRiskAlertsByLevel(level);
        return ResponseEntity.ok(riskAlerts);
    }
    
    /**
     * Get risk alerts near a specific location.
     * 
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radius The search radius in meters (default: 5000)
     * @return ResponseEntity containing a list of nearby risk alerts
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<RiskAlert>> getNearbyRiskAlerts(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5000") double radius) {
        List<RiskAlert> nearbyRiskAlerts = riskAlertService.findRiskAlertsNearLocation(latitude, longitude, radius);
        return ResponseEntity.ok(nearbyRiskAlerts);
    }
    
    /**
     * Get active risk alerts near a specific location.
     * 
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radius The search radius in meters (default: 5000)
     * @return ResponseEntity containing a list of nearby active risk alerts
     */
    @GetMapping("/active/nearby")
    public ResponseEntity<List<RiskAlert>> getActiveNearbyRiskAlerts(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5000") double radius) {
        List<RiskAlert> activeNearbyRiskAlerts = riskAlertService.findActiveRiskAlertsNearLocation(latitude, longitude, radius);
        return ResponseEntity.ok(activeNearbyRiskAlerts);
    }
    
    /**
     * Get active risk alerts with a minimum risk level near a specific location.
     * 
     * @param level The minimum risk level
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radius The search radius in meters (default: 5000)
     * @return ResponseEntity containing a list of matching risk alerts
     */
    @GetMapping("/active/level/{level}/nearby")
    public ResponseEntity<List<RiskAlert>> getActiveRiskAlertsByLevelNearby(
            @PathVariable RiskAlert.RiskLevel level,
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5000") double radius) {
        List<RiskAlert> riskAlerts = riskAlertService.findActiveRiskAlertsByLevelNearLocation(level, latitude, longitude, radius);
        return ResponseEntity.ok(riskAlerts);
    }
    
    /**
     * Create a new risk alert.
     * 
     * @param riskAlert The risk alert to create
     * @return ResponseEntity containing the created risk alert
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RiskAlert> createRiskAlert(@RequestBody RiskAlert riskAlert) {
        RiskAlert createdRiskAlert = riskAlertService.createRiskAlert(riskAlert);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRiskAlert);
    }
    
    /**
     * Update an existing risk alert.
     * 
     * @param id The ID of the risk alert to update
     * @param riskAlertDetails The updated risk alert details
     * @return ResponseEntity containing the updated risk alert
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RiskAlert> updateRiskAlert(@PathVariable String id, @RequestBody RiskAlert riskAlertDetails) {
        if (!riskAlertService.findRiskAlertById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        riskAlertDetails.setId(id);
        RiskAlert updatedRiskAlert = riskAlertService.updateRiskAlert(riskAlertDetails);
        return ResponseEntity.ok(updatedRiskAlert);
    }
    
    /**
     * Delete a risk alert.
     * 
     * @param id The ID of the risk alert to delete
     * @return ResponseEntity with no content if successful
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRiskAlert(@PathVariable String id) {
        if (!riskAlertService.findRiskAlertById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        riskAlertService.deleteRiskAlert(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Manually expire old risk alerts.
     * 
     * @return ResponseEntity containing the number of expired risk alerts
     */
    @PostMapping("/expire")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Integer> expireOldRiskAlerts() {
        int expiredCount = riskAlertService.expireOldRiskAlerts();
        return ResponseEntity.ok(expiredCount);
    }
}