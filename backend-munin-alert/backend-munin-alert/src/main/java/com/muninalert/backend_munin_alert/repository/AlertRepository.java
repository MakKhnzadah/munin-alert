package com.muninalert.backend_munin_alert.repository;

import java.util.List;

import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.muninalert.backend_munin_alert.model.Alert;

public interface AlertRepository extends MongoRepository<Alert, String> {
    List<Alert> findByUserId(String userId);
    List<Alert> findByGroupId(String groupId);
    List<Alert> findByUserIdAndStatus(String userId, Alert.AlertStatus status);
    List<Alert> findByGroupIdAndStatus(String groupId, Alert.AlertStatus status);
    List<Alert> findByLocationNear(Point location, Distance distance);
}
