package com.muninalert.backend_munin_alert.service.impl;

import com.muninalert.backend_munin_alert.model.Alert;
import com.muninalert.backend_munin_alert.repository.AlertRepository;
import com.muninalert.backend_munin_alert.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;

    @Autowired
    public AlertServiceImpl(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @Override
    public Alert createAlert(Alert alert) {
        alert.setCreatedAt(System.currentTimeMillis());
        alert.setUpdatedAt(System.currentTimeMillis());
        return alertRepository.save(alert);
    }

    @Override
    public Optional<Alert> findAlertById(String id) {
        return alertRepository.findById(id);
    }

    @Override
    public List<Alert> findAllAlerts() {
        return alertRepository.findAll();
    }

    @Override
    public List<Alert> findAlertsByUserId(String userId) {
        return alertRepository.findByUserId(userId);
    }

    @Override
    public List<Alert> findAlertsByGroupId(String groupId) {
        return alertRepository.findByGroupId(groupId);
    }

    @Override
    public List<Alert> findAlertsNearLocation(double latitude, double longitude, double radius) {
        Point point = new Point(longitude, latitude); // MongoDB uses [longitude, latitude] format
        Distance distance = new Distance(radius / 1000, Metrics.KILOMETERS); // Convert meters to kilometers
        return alertRepository.findByLocationNear(point, distance);
    }

    @Override
    public Alert updateAlert(Alert alert) {
        alert.setUpdatedAt(System.currentTimeMillis());
        return alertRepository.save(alert);
    }

    @Override
    public Alert updateAlertStatus(String id, Alert.AlertStatus status) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));
        
        alert.setStatus(status);
        alert.setUpdatedAt(System.currentTimeMillis());
        return alertRepository.save(alert);
    }

    @Override
    public void deleteAlert(String id) {
        alertRepository.deleteById(id);
    }
}
