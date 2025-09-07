package com.muninalert.backend_munin_alert.service;

import java.util.List;
import java.util.Optional;

import com.muninalert.backend_munin_alert.model.Alert;

public interface AlertService {
    Alert createAlert(Alert alert);
    
    Optional<Alert> findAlertById(String id);
    
    List<Alert> findAllAlerts();
    
    List<Alert> findAlertsByUserId(String userId);
    
    List<Alert> findAlertsByGroupId(String groupId);
    
    List<Alert> findAlertsNearLocation(double latitude, double longitude, double radius);
    
    Alert updateAlert(Alert alert);
    
    Alert updateAlertStatus(String id, Alert.AlertStatus status);
    
    void deleteAlert(String id);
}
