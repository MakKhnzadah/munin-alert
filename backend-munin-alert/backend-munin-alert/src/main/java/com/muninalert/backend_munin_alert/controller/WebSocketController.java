package com.muninalert.backend_munin_alert.controller;

import com.muninalert.backend_munin_alert.model.Alert;
import com.muninalert.backend_munin_alert.model.Location;
import com.muninalert.backend_munin_alert.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final AlertService alertService;

    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate, AlertService alertService) {
        this.messagingTemplate = messagingTemplate;
        this.alertService = alertService;
    }

    @MessageMapping("/alert")
    @SendTo("/topic/alerts")
    public Alert broadcastAlert(@Payload Alert alert, Principal principal) {
        // The alert is already processed by the controller before being sent here
        return alert;
    }
    
    @MessageMapping("/location/{userId}")
    public void updateLocation(@DestinationVariable String userId, @Payload Location location) {
        // Send to subscribers of this user's location
        messagingTemplate.convertAndSend("/topic/location/" + userId, location);
    }
    
    @MessageMapping("/alert/response/{alertId}")
    public void respondToAlert(@DestinationVariable String alertId, @Payload Alert.AlertResponse response, Principal principal) {
        // Update the alert with the response
        Alert alert = alertService.findAlertById(alertId).orElse(null);
        if (alert != null) {
            alert.getResponses().add(response);
            Alert updatedAlert = alertService.updateAlert(alert);
            
            // Notify subscribers about the response
            messagingTemplate.convertAndSend("/topic/alerts/" + alertId + "/responses", response);
            
            // Also send to the user who created the alert
            messagingTemplate.convertAndSend("/queue/user/" + alert.getUserId() + "/alerts/" + alertId, updatedAlert);
        }
    }
    
    @MessageMapping("/group/{groupId}")
    @SendTo("/topic/group/{groupId}")
    public Map<String, Object> groupMessage(@DestinationVariable String groupId, @Payload Map<String, Object> message) {
        // Simply broadcast the message to the group
        return message;
    }
}
