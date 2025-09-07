package com.muninalert.backend_munin_alert.service;

import java.util.List;
import java.util.Optional;

import com.muninalert.backend_munin_alert.model.Group;

public interface GroupService {
    Group createGroup(Group group);
    
    Optional<Group> findGroupById(String id);
    
    List<Group> findAllGroups();
    
    List<Group> findGroupsByMemberId(String memberId);
    
    List<Group> findGroupsByOwnerId(String ownerId);
    
    Group updateGroup(Group group);
    
    Group addMemberToGroup(String groupId, String userId);
    
    Group removeMemberFromGroup(String groupId, String userId);
    
    void deleteGroup(String id);
}
