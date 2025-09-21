package com.muninalert.backend_munin_alert.dto;

import com.muninalert.backend_munin_alert.model.Location;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LocationUpdateMessage extends WebSocketMessage {
    private String userId;
    private Location location;
    
    public LocationUpdateMessage(String userId, Location location) {
        super("LOCATION_UPDATE", System.currentTimeMillis());
        this.userId = userId;
        this.location = location;
    }
}
