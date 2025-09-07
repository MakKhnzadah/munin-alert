package com.muninalert.backend_munin_alert.model;

import lombok.Data;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

@Data
public class Location {
    private GeoJsonPoint coordinates;
    private long timestamp;
    private double accuracy;
    private String deviceId;
    private LocationType locationType;
    
    public enum LocationType {
        GPS, 
        NETWORK, 
        PASSIVE, 
        MANUAL
    }
}
