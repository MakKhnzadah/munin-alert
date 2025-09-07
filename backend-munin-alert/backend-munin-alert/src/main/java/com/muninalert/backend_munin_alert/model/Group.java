package com.muninalert.backend_munin_alert.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "groups")
public class Group {
    @Id
    private String id;
    
    private String name;
    private String description;
    
    private String ownerId;
    
    private List<String> adminIds = new ArrayList<>();
    private List<String> memberIds = new ArrayList<>();
    
    private GroupSettings settings = new GroupSettings();
    
    private long createdAt;
    private long updatedAt;
    
    @Data
    public static class GroupSettings {
        private boolean allowMemberInvites = false;
        private boolean autoShareLocationOnAlert = true;
        private boolean notifyAllOnAlert = true;
        private int alertCountdownSeconds = 5;
    }
}
