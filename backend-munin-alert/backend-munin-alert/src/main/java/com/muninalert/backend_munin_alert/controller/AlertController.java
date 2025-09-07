package com.muninalert.backend_munin_alert.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.muninalert.backend_munin_alert.model.Alert;
import com.muninalert.backend_munin_alert.model.User;
import com.muninalert.backend_munin_alert.service.AlertService;
import com.muninalert.backend_munin_alert.service.UserService;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;
    private final UserService userService;

    @Autowired
    public AlertController(AlertService alertService, UserService userService) {
        this.alertService = alertService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Alert> createAlert(@RequestBody Alert alert) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Set the user who created the alert
        alert.setUserId(currentUser.getId());
        
        Alert savedAlert = alertService.createAlert(alert);
        return new ResponseEntity<>(savedAlert, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Alert>> getAllAlerts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get all alerts created by the current user
        List<Alert> userAlerts = alertService.findAlertsByUserId(currentUser.getId());
        return ResponseEntity.ok(userAlerts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alert> getAlertById(@PathVariable String id) {
        Alert alert = alertService.findAlertById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));
        return ResponseEntity.ok(alert);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Alert>> getNearbyAlerts(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5000") double radius) {
        // Find alerts within radius (in meters)
        List<Alert> nearbyAlerts = alertService.findAlertsNearLocation(latitude, longitude, radius);
        return ResponseEntity.ok(nearbyAlerts);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alert> updateAlert(@PathVariable String id, @RequestBody Alert alertDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Alert existingAlert = alertService.findAlertById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));
        
        // Check if the current user is the creator of the alert
        if (!existingAlert.getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        alertDetails.setId(id); // Ensure the ID is set correctly
        alertDetails.setUserId(currentUser.getId()); // Ensure the user ID is preserved
        Alert updatedAlert = alertService.updateAlert(alertDetails);
        return ResponseEntity.ok(updatedAlert);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Alert> updateAlertStatus(
            @PathVariable String id, 
            @RequestBody Alert.AlertStatus status) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Alert existingAlert = alertService.findAlertById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));
        
        // Check if the current user is the creator of the alert
        if (!existingAlert.getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Alert updatedAlert = alertService.updateAlertStatus(id, status);
        return ResponseEntity.ok(updatedAlert);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlert(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Alert existingAlert = alertService.findAlertById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));
        
        // Check if the current user is the creator of the alert
        if (!existingAlert.getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        alertService.deleteAlert(id);
        return ResponseEntity.noContent().build();
    }
}
