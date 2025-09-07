package com.muninalert.backend_munin_alert.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "safe_havens")
public class SafeHaven {
    @Id
    private String id;
    
    private String name;
    private String description;
    private String address;
    
    private GeoJsonPoint location;
    
    private double radiusMeters;
    
    private String userId;
    private String groupId;
    
    private boolean isPublic;
    
    private long createdAt;
    private long updatedAt;
}
