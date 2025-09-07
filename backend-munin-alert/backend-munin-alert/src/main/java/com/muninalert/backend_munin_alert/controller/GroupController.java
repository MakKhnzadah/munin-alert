package com.muninalert.backend_munin_alert.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.muninalert.backend_munin_alert.model.Group;
import com.muninalert.backend_munin_alert.model.User;
import com.muninalert.backend_munin_alert.service.GroupService;
import com.muninalert.backend_munin_alert.service.UserService;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;
    private final UserService userService;

    @Autowired
    public GroupController(GroupService groupService, UserService userService) {
        this.groupService = groupService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody Group group) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Set the creator of the group
        group.setOwnerId(currentUser.getId());
        // Add the creator to the members list
        group.getMemberIds().add(currentUser.getId());
        // Make the creator an admin
        group.getAdminIds().add(currentUser.getId());
        
        Group savedGroup = groupService.createGroup(group);
        return new ResponseEntity<>(savedGroup, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get all groups the user is a member of
        List<Group> userGroups = groupService.findGroupsByMemberId(currentUser.getId());
        return ResponseEntity.ok(userGroups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Group group = groupService.findGroupById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));
        
        // Check if the user is a member of the group
        if (!group.getMemberIds().contains(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(group);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable String id, @RequestBody Group groupDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Group existingGroup = groupService.findGroupById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));
        
        // Check if the current user is the owner or an admin of the group
        if (!existingGroup.getOwnerId().equals(currentUser.getId()) && 
            !existingGroup.getAdminIds().contains(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        // Preserve owner and ID
        groupDetails.setId(id);
        groupDetails.setOwnerId(existingGroup.getOwnerId());
        
        Group updatedGroup = groupService.updateGroup(groupDetails);
        return ResponseEntity.ok(updatedGroup);
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<Group> addMemberToGroup(@PathVariable String id, @RequestBody String userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Group existingGroup = groupService.findGroupById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));
        
        // Check if the current user is the owner or an admin of the group
        if (!existingGroup.getOwnerId().equals(currentUser.getId()) && 
            !existingGroup.getAdminIds().contains(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        // Verify the user exists
        User userToAdd = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Group updatedGroup = groupService.addMemberToGroup(id, userId);
        return ResponseEntity.ok(updatedGroup);
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<Group> removeMemberFromGroup(@PathVariable String id, @PathVariable String userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Group existingGroup = groupService.findGroupById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));
        
        // Check if the current user is the owner/admin of the group or the user is removing themself
        if (!existingGroup.getOwnerId().equals(currentUser.getId()) && 
            !existingGroup.getAdminIds().contains(currentUser.getId()) && 
            !userId.equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        // Don't allow removing the owner
        if (userId.equals(existingGroup.getOwnerId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null); // Owner cannot be removed
        }
        
        Group updatedGroup = groupService.removeMemberFromGroup(id, userId);
        return ResponseEntity.ok(updatedGroup);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Group existingGroup = groupService.findGroupById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));
        
        // Check if the current user is the owner of the group
        if (!existingGroup.getOwnerId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        groupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }
}
