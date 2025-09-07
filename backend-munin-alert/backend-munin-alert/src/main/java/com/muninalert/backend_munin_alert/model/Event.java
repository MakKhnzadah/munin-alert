package com.muninalert.backend_munin_alert.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "events")
public class Event {
    @Id
    private String id;
    
    private String userId;
    private String deviceId;
    
    private EventType eventType;
    
    private Location location;
    
    private double confidence;
    
    private String rawData;
    
    private long timestamp;
    
    public enum EventType {
        FALL_DETECTED,
        COLLISION_DETECTED,
        RAPID_DECELERATION,
        UNUSUAL_MOVEMENT,
        INACTIVITY,
        MANUAL_ALERT,
        ENTER_SAFEHAVEN,
        EXIT_SAFEHAVEN,
        ENTER_RISK_AREA,
        EXIT_RISK_AREA
    }
}
