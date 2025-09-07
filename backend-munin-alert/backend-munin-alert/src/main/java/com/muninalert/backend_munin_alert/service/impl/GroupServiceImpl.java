package com.muninalert.backend_munin_alert.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.muninalert.backend_munin_alert.model.Group;
import com.muninalert.backend_munin_alert.repository.GroupRepository;
import com.muninalert.backend_munin_alert.service.GroupService;

@Service
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;

    @Autowired
    public GroupServiceImpl(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    @Override
    public Group createGroup(Group group) {
        group.setCreatedAt(System.currentTimeMillis());
        group.setUpdatedAt(System.currentTimeMillis());
        return groupRepository.save(group);
    }

    @Override
    public Optional<Group> findGroupById(String id) {
        return groupRepository.findById(id);
    }

    @Override
    public List<Group> findAllGroups() {
        return groupRepository.findAll();
    }

    @Override
    public List<Group> findGroupsByMemberId(String memberId) {
        return groupRepository.findByMemberIdsContaining(memberId);
    }

    @Override
    public List<Group> findGroupsByOwnerId(String ownerId) {
        return groupRepository.findByOwnerId(ownerId);
    }

    @Override
    public Group updateGroup(Group group) {
        group.setUpdatedAt(System.currentTimeMillis());
        return groupRepository.save(group);
    }

    @Override
    public Group addMemberToGroup(String groupId, String userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));
        
        if (!group.getMemberIds().contains(userId)) {
            group.getMemberIds().add(userId);
            group.setUpdatedAt(System.currentTimeMillis());
            return groupRepository.save(group);
        }
        
        return group;
    }

    @Override
    public Group removeMemberFromGroup(String groupId, String userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));
        
        group.getMemberIds().remove(userId);
        
        // If the user was an admin, remove them from adminIds as well
        group.getAdminIds().remove(userId);
        
        group.setUpdatedAt(System.currentTimeMillis());
        return groupRepository.save(group);
    }

    @Override
    public void deleteGroup(String id) {
        groupRepository.deleteById(id);
    }
}
