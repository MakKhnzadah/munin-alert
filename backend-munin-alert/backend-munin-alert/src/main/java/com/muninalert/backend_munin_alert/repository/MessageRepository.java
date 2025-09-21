package com.muninalert.backend_munin_alert.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.muninalert.backend_munin_alert.model.Message;

/**
 * Repository interface for Message document operations.
 * Provides methods for querying and manipulating message data in MongoDB.
 */
@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    
    /**
     * Find all messages sent by a specific user.
     * 
     * @param senderId The ID of the sender
     * @return List of messages sent by the user
     */
    List<Message> findBySenderId(String senderId);
    
    /**
     * Find all messages in a specific group.
     * 
     * @param groupId The ID of the group
     * @return List of messages in the group
     */
    List<Message> findByGroupId(String groupId);
    
    /**
     * Find all messages sent to a specific recipient.
     * 
     * @param recipientId The ID of the recipient
     * @return List of messages sent to the recipient
     */
    @Query("{ 'recipientIds': ?0 }")
    List<Message> findByRecipientId(String recipientId);
    
    /**
     * Find all unread messages for a specific recipient.
     * 
     * @param recipientId The ID of the recipient
     * @return List of unread messages for the recipient
     */
    @Query("{ 'recipientIds': ?0, 'isRead': false }")
    List<Message> findUnreadByRecipientId(String recipientId);
    
    /**
     * Find messages by type.
     * 
     * @param messageType The type of message
     * @return List of messages of the specified type
     */
    List<Message> findByMessageType(Message.MessageType messageType);
    
    /**
     * Find messages sent after a specific timestamp.
     * 
     * @param timestamp The timestamp in milliseconds
     * @return List of messages sent after the specified timestamp
     */
    List<Message> findByCreatedAtGreaterThan(long timestamp);
    
    /**
     * Find messages in a group sent after a specific timestamp.
     * 
     * @param groupId The ID of the group
     * @param timestamp The timestamp in milliseconds
     * @return List of messages in the group sent after the specified timestamp
     */
    List<Message> findByGroupIdAndCreatedAtGreaterThan(String groupId, long timestamp);
    
    /**
     * Find messages between two users.
     * 
     * @param userId1 The ID of the first user
     * @param userId2 The ID of the second user
     * @return List of messages exchanged between the two users
     */
    @Query("{ $or: [ { 'senderId': ?0, 'recipientIds': ?1 }, { 'senderId': ?1, 'recipientIds': ?0 } ] }")
    List<Message> findMessagesBetweenUsers(String userId1, String userId2);
    
    /**
     * Find the most recent messages in a group, limited by count.
     * 
     * @param groupId The ID of the group
     * @param limit The maximum number of messages to return
     * @return List of the most recent messages in the group
     */
    @Query(value = "{ 'groupId': ?0 }", sort = "{ 'createdAt': -1 }")
    List<Message> findMostRecentGroupMessages(String groupId, int limit);
}