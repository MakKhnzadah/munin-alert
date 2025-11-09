package com.muninalert.backend_munin_alert.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.muninalert.backend_munin_alert.model.SafeHaven;
import com.muninalert.backend_munin_alert.model.User;
import com.muninalert.backend_munin_alert.service.SafeHavenService;
import com.muninalert.backend_munin_alert.service.UserService;

/**
 * REST Controller for safe haven operations.
 * 
 * This controller provides endpoints for creating, retrieving, updating, and deleting
 * safe havens, as well as specialized endpoints for geospatial queries.
 */
@RestController
@RequestMapping("/api/safe-havens")
public class SafeHavenController {
    
    private final SafeHavenService safeHavenService;
    private final UserService userService;
    
    /**
     * Constructor for dependency injection.
     * 
     * @param safeHavenService The service for safe haven operations
     * @param userService The service for user operations
     */
    @Autowired
    public SafeHavenController(SafeHavenService safeHavenService, UserService userService) {
        this.safeHavenService = safeHavenService;
        this.userService = userService;
    }
    
    /**
     * Get all safe havens (admin only).
     * 
     * @return ResponseEntity containing a list of all safe havens
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SafeHaven>> getAllSafeHavens() {
        List<SafeHaven> safeHavens = safeHavenService.findAllSafeHavens();
        return ResponseEntity.ok(safeHavens);
    }
    
    /**
     * Get a specific safe haven by ID.
     * 
     * @param id The ID of the safe haven to retrieve
     * @return ResponseEntity containing the safe haven if found
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.canAccessSafeHaven(authentication, #id)")
    public ResponseEntity<SafeHaven> getSafeHavenById(@PathVariable String id) {
        return safeHavenService.findSafeHavenById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get safe havens created by the authenticated user.
     * 
     * @return ResponseEntity containing a list of safe havens created by the user
     */
    @GetMapping("/my-safe-havens")
    public ResponseEntity<List<SafeHaven>> getMySafeHavens() {
        User currentUser = getCurrentUser();
        List<SafeHaven> userSafeHavens = safeHavenService.findSafeHavensByUserId(currentUser.getId());
        return ResponseEntity.ok(userSafeHavens);
    }
    
    /**
     * Get safe havens for a specific group.
     * 
     * @param groupId The ID of the group
     * @return ResponseEntity containing a list of safe havens for the group
     */
    @GetMapping("/group/{groupId}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isGroupMember(authentication, #groupId)")
    public ResponseEntity<List<SafeHaven>> getSafeHavensByGroupId(@PathVariable String groupId) {
        List<SafeHaven> groupSafeHavens = safeHavenService.findSafeHavensByGroupId(groupId);
        return ResponseEntity.ok(groupSafeHavens);
    }
    
    /**
     * Get public safe havens.
     * 
     * @return ResponseEntity containing a list of public safe havens
     */
    @GetMapping("/public")
    public ResponseEntity<List<SafeHaven>> getPublicSafeHavens() {
        List<SafeHaven> publicSafeHavens = safeHavenService.findPublicSafeHavens();
        return ResponseEntity.ok(publicSafeHavens);
    }
    
    /**
     * Get safe havens near a specific location.
     * 
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radius The search radius in meters (default: 5000)
     * @return ResponseEntity containing a list of nearby safe havens
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<SafeHaven>> getNearbySafeHavens(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5000") double radius) {
        List<SafeHaven> nearbySafeHavens = safeHavenService.findSafeHavensNearLocation(latitude, longitude, radius);
        return ResponseEntity.ok(nearbySafeHavens);
    }
    
    /**
     * Get public safe havens near a specific location.
     * 
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radius The search radius in meters (default: 5000)
     * @return ResponseEntity containing a list of nearby public safe havens
     */
    @GetMapping("/public/nearby")
    public ResponseEntity<List<SafeHaven>> getNearbyPublicSafeHavens(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5000") double radius) {
        List<SafeHaven> nearbyPublicSafeHavens = safeHavenService.findPublicSafeHavensNearLocation(latitude, longitude, radius);
        return ResponseEntity.ok(nearbyPublicSafeHavens);
    }
    
    /**
     * Get safe havens for the authenticated user near a specific location.
     * 
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @param radius The search radius in meters (default: 5000)
     * @return ResponseEntity containing a list of nearby safe havens for the user
     */
    @GetMapping("/my-safe-havens/nearby")
    public ResponseEntity<List<SafeHaven>> getMyNearbySafeHavens(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5000") double radius) {
        User currentUser = getCurrentUser();
        List<SafeHaven> nearbySafeHavens = safeHavenService.findSafeHavensForUserNearLocation(
                currentUser.getId(), latitude, longitude, radius);
        return ResponseEntity.ok(nearbySafeHavens);
    }
    
    /**
     * Get all safe havens accessible to the authenticated user.
     * 
     * @return ResponseEntity containing a list of accessible safe havens
     */
    @GetMapping("/accessible")
    public ResponseEntity<List<SafeHaven>> getAccessibleSafeHavens() {
        User currentUser = getCurrentUser();
        List<SafeHaven> accessibleSafeHavens = safeHavenService.findAccessibleSafeHavens(currentUser.getId());
        return ResponseEntity.ok(accessibleSafeHavens);
    }
    
    /**
     * Check if a location is within any safe haven accessible to the authenticated user.
     * 
     * @param latitude The latitude coordinate
     * @param longitude The longitude coordinate
     * @return ResponseEntity containing the safe haven if found, or 404 if not in any safe haven
     */
    @GetMapping("/check-location")
    public ResponseEntity<?> checkLocationInSafeHaven(
            @RequestParam double latitude,
            @RequestParam double longitude) {
        User currentUser = getCurrentUser();
        return safeHavenService.isLocationInSafeHaven(currentUser.getId(), latitude, longitude)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Create a new safe haven.
     * 
     * @param safeHaven The safe haven to create
     * @return ResponseEntity containing the created safe haven
     */
    @PostMapping
    public ResponseEntity<SafeHaven> createSafeHaven(@RequestBody SafeHaven safeHaven) {
        User currentUser = getCurrentUser();
        
        // If user ID is not provided, set it to the current user
        if (safeHaven.getUserId() == null || safeHaven.getUserId().isEmpty()) {
            safeHaven.setUserId(currentUser.getId());
        }
        
        // Ensure the location is properly set as GeoJsonPoint
        if (safeHaven.getLocation() == null && safeHaven.getLocation().getCoordinates() == null) {
            return ResponseEntity.badRequest().build();
        }
        
        SafeHaven createdSafeHaven = safeHavenService.createSafeHaven(safeHaven);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSafeHaven);
    }
    
    /**
     * Update an existing safe haven.
     * 
     * @param id The ID of the safe haven to update
     * @param safeHavenDetails The updated safe haven details
     * @return ResponseEntity containing the updated safe haven
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isSafeHavenOwner(authentication, #id)")
    public ResponseEntity<SafeHaven> updateSafeHaven(@PathVariable String id, @RequestBody SafeHaven safeHavenDetails) {
        return safeHavenService.findSafeHavenById(id)
                .map(existingSafeHaven -> {
                    // Preserve the ID and owner
                    safeHavenDetails.setId(id);
                    safeHavenDetails.setUserId(existingSafeHaven.getUserId());
                    
                    SafeHaven updatedSafeHaven = safeHavenService.updateSafeHaven(safeHavenDetails);
                    return ResponseEntity.ok(updatedSafeHaven);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Delete a safe haven.
     * 
     * @param id The ID of the safe haven to delete
     * @return ResponseEntity with no content if successful
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isSafeHavenOwner(authentication, #id)")
    public ResponseEntity<?> deleteSafeHaven(@PathVariable String id) {
        if (!safeHavenService.findSafeHavenById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        safeHavenService.deleteSafeHaven(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Helper method to get the currently authenticated user.
     * 
     * @return The current user
     * @throws RuntimeException if the user is not found
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
