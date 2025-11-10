package com.muninalert.backend_munin_alert.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    private String firstName;
    private String lastName;
    
    @Indexed(unique = true)
    private String username;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;

    private String phoneNumber;
    
    private List<String> roles = new ArrayList<>();
    
    private Location lastKnownLocation;
    
    private List<String> emergencyContacts = new ArrayList<>();
    
    private List<String> safeHavens = new ArrayList<>();
    
    private UserPreferences preferences;
    
    private boolean isActive = true;
    
    private long createdAt;
    private long updatedAt;
}
