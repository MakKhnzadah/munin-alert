package com.muninalert.backend_munin_alert.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Base class for all WebSocket messages
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {
    private String type;
    private long timestamp = System.currentTimeMillis();
}
