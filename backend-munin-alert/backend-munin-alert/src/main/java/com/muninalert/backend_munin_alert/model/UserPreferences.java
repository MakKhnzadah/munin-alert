package com.muninalert.backend_munin_alert.model;

import lombok.Data;

@Data
public class UserPreferences {
    private String language = "en";
    private boolean soundEnabled = true;
    private boolean vibrationEnabled = true;
    private boolean lightEnabled = true;
    private String alarmSound = "default";
    private String backgroundTheme = "default";
    private boolean usePTTButton = false;
    private NotificationPreferences notificationPreferences = new NotificationPreferences();
    
    @Data
    public static class NotificationPreferences {
        private boolean pushNotificationsEnabled = true;
        private boolean emailNotificationsEnabled = false;
        private boolean locationSharingEnabled = true;
        private boolean aiEventDetectionEnabled = true;
        private boolean localRiskAlertsEnabled = true;
    }
}
