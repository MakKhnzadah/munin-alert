package com.muninalert.backend_munin_alert.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    
    private String senderId;
    private String groupId;
    private List<String> recipientIds = new ArrayList<>();
    
    private String content;
    private MessageType messageType;
    
    private List<String> mediaUrls = new ArrayList<>();
    
    private Location location;
    
    private boolean isRead = false;
    private long readAt;
    
    private long createdAt;
    
    public enum MessageType {
        TEXT,
        PREDEFINED,
        MEDIA,
        LOCATION,
        SYSTEM
    }
}
