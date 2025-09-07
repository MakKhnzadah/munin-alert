package com.muninalert.backend_munin_alert.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "risk_alerts")
public class RiskAlert {
    @Id
    private String id;
    
    private String title;
    private String description;
    
    private RiskLevel riskLevel;
    
    private GeoJsonPoint location;
    private double radiusMeters;
    
    private RiskType riskType;
    
    private String source;
    private String sourceUrl;
    
    private long expiresAt;
    private long createdAt;
    
    public enum RiskLevel {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
    
    public enum RiskType {
        CRIME,
        ACCIDENT,
        NATURAL_DISASTER,
        WEATHER,
        TRAFFIC,
        OTHER
    }
}
