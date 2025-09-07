package com.muninalert.backend_munin_alert.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "alerts")
public class Alert {
    @Id
    private String id;
    
    private String userId;
    private String groupId;
    
    private AlertType alertType;
    
    private Location location;
    
    private AlertStatus status = AlertStatus.ACTIVE;
    
    private List<AlertResponse> responses = new ArrayList<>();
    
    private List<String> mediaUrls = new ArrayList<>();
    
    private String message;
    
    private long createdAt;
    private long updatedAt;
    
    public enum AlertType {
        MANUAL,
        FALL_DETECTED,
        COLLISION_DETECTED,
        INACTIVITY,
        TIMER_EXPIRED,
        TEST
    }
    
    public enum AlertStatus {
        ACTIVE,
        ACKNOWLEDGED,
        RESOLVED,
        FALSE_ALARM,
        EXPIRED
    }
    
    @Data
    public static class AlertResponse {
        private String userId;
        private ResponseType responseType;
        private String message;
        private Location location;
        private long timestamp;
        
        public enum ResponseType {
            ACKNOWLEDGED,
            EN_ROUTE,
            ON_SCENE,
            CANNOT_HELP,
            MESSAGE
        }
    }
}
