package com.muninalert.backend_munin_alert.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class NotificationMessage extends WebSocketMessage {
    private String message;
    private NotificationType notificationType;
    
    public NotificationMessage(String message, NotificationType notificationType) {
        super("NOTIFICATION", System.currentTimeMillis());
        this.message = message;
        this.notificationType = notificationType;
    }
    
    public enum NotificationType {
        INFO,
        WARNING,
        ERROR,
        SUCCESS
    }
}
