package com.muninalert.backend_munin_alert.repository;

import com.muninalert.backend_munin_alert.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GroupRepository extends MongoRepository<Group, String> {
    List<Group> findByOwnerId(String ownerId);
    List<Group> findByMemberIdsContaining(String userId);
    List<Group> findByAdminIdsContaining(String userId);
}
