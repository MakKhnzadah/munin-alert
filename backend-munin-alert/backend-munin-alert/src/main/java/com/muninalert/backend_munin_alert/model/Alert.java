package com.muninalert.backend_munin_alert.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

/**
 * Model representing an emergency alert in the Munin Alert system.
 * 
 * An alert is triggered by a user in an emergency situation and can be 
 * shared with specific groups. It contains information about the type of emergency,
 * the location, and can track responses from other users.
 */
@Data
@Document(collection = "alerts")
public class Alert {
    /**
     * Unique identifier for the alert.
     */
    @Id
    private String id;
    
    /**
     * ID of the user who created the alert.
     */
    private String userId;
    
    /**
     * ID of the group this alert is shared with (optional).
     */
    private String groupId;
    
    /**
     * Type of alert (e.g., manual, fall detected, etc.).
     */
    private AlertType alertType;
    
    /**
     * Geographic location where the alert was triggered.
     */
    private Location location;
    
    /**
     * Current status of the alert (default: ACTIVE).
     */
    private AlertStatus status = AlertStatus.ACTIVE;
    
    /**
     * List of responses from other users to this alert.
     */
    private List<AlertResponse> responses = new ArrayList<>();
    
    /**
     * List of URLs to media files related to the alert (e.g., photos, videos).
     */
    private List<String> mediaUrls = new ArrayList<>();
    
    /**
     * Additional information or description provided by the user.
     */
    private String message;
    
    /**
     * Timestamp when the alert was created (in milliseconds since epoch).
     */
    private long createdAt;
    
    /**
     * Timestamp when the alert was last updated (in milliseconds since epoch).
     */
    private long updatedAt;
    
    /**
     * Enumeration of possible alert types.
     */
    public enum AlertType {
        /** User manually triggered alert */
        MANUAL,
        /** Automatically triggered when a fall is detected */
        FALL_DETECTED,
        /** Automatically triggered when a collision is detected */
        COLLISION_DETECTED,
        /** Automatically triggered when no activity is detected for a configured period */
        INACTIVITY,
        /** Automatically triggered when a countdown timer expires */
        TIMER_EXPIRED,
        /** Test alert for system testing purposes */
        TEST
    }
    
    /**
     * Enumeration of possible alert statuses.
     */
    public enum AlertStatus {
        /** Alert is active and requires attention */
        ACTIVE,
        /** Alert has been acknowledged by at least one responder */
        ACKNOWLEDGED,
        /** The emergency situation has been resolved */
        RESOLVED,
        /** The alert was triggered by mistake or was not a real emergency */
        FALSE_ALARM,
        /** The alert has expired without resolution (time-based) */
        EXPIRED
    }
    
    /**
     * Class representing a response to an alert from another user.
     */
    @Data
    public static class AlertResponse {
        /**
         * ID of the user who responded to the alert.
         */
        private String userId;
        
        /**
         * Type of response (e.g., acknowledged, en route, etc.).
         */
        private ResponseType responseType;
        
        /**
         * Additional message provided by the responder.
         */
        private String message;
        
        /**
         * Geographic location of the responder when the response was sent.
         */
        private Location location;
        
        /**
         * Timestamp when the response was created (in milliseconds since epoch).
         */
        private long timestamp;
        
        /**
         * Enumeration of possible response types.
         */
        public enum ResponseType {
            /** Responder has seen the alert and acknowledged it */
            ACKNOWLEDGED,
            /** Responder is on the way to the location */
            EN_ROUTE,
            /** Responder has arrived at the location */
            ON_SCENE,
            /** Responder is unable to help */
            CANNOT_HELP,
            /** Responder has sent a message only */
            MESSAGE
        }
    }
}
