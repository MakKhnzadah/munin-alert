import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient = null;
let subscriptions = {};
const listeners = {};

// Connect to WebSocket
export const connectWebSocket = (token) => {
  return new Promise((resolve, reject) => {
    if (stompClient && stompClient.connected) {
      resolve(stompClient);
      return;
    }

    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    
    // Configure STOMP client
    stompClient.connect(
      // Headers with Authorization
      { 'Authorization': `Bearer ${token}` },
      
      // Success callback
      () => {
        console.log('WebSocket connected');
        resolve(stompClient);
      },
      
      // Error callback
      (error) => {
        console.error('WebSocket connection error:', error);
        stompClient = null;
        reject(error);
      }
    );
  });
};

// Disconnect WebSocket
export const disconnectWebSocket = () => {
  if (stompClient) {
    // Unsubscribe from all topics
    Object.values(subscriptions).forEach(subscription => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    });
    
    // Clear subscriptions
    subscriptions = {};
    
    // Disconnect STOMP client
    stompClient.disconnect();
    stompClient = null;
    console.log('WebSocket disconnected');
  }
};

// Subscribe to a topic
export const subscribe = (destination, callback) => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected');
    return null;
  }
  
  // Check if already subscribed
  if (subscriptions[destination]) {
    return subscriptions[destination];
  }
  
  // Subscribe to destination
  const subscription = stompClient.subscribe(destination, message => {
    const payload = JSON.parse(message.body);
    callback(payload);
  });
  
  // Store subscription
  subscriptions[destination] = subscription;
  return subscription;
};

// Unsubscribe from a topic
export const unsubscribe = (destination) => {
  if (subscriptions[destination]) {
    subscriptions[destination].unsubscribe();
    delete subscriptions[destination];
  }
};

// Send message to a destination
export const sendMessage = (destination, message) => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected');
    return false;
  }
  
  stompClient.send(destination, {}, JSON.stringify(message));
  return true;
};

// ======= Specific WebSocket Functions for Munin Alert =======

// Subscribe to alerts
export const subscribeToAlerts = (callback) => {
  return subscribe('/topic/alerts', callback);
};

// Subscribe to group alerts
export const subscribeToGroupAlerts = (groupId, callback) => {
  return subscribe(`/topic/group/${groupId}/alerts`, callback);
};

// Subscribe to user's location updates
export const subscribeToUserLocation = (userId, callback) => {
  return subscribe(`/topic/location/${userId}`, callback);
};

// Subscribe to group messages
export const subscribeToGroupMessages = (groupId, callback) => {
  return subscribe(`/topic/group/${groupId}/messages`, callback);
};

// Subscribe to personal notifications
export const subscribeToPersonalNotifications = (userId, callback) => {
  return subscribe(`/queue/user/${userId}/notifications`, callback);
};

// Send location update
export const sendLocationUpdate = (location) => {
  return sendMessage('/app/location/' + location.userId, location);
};

// Send alert
export const sendAlert = (alert) => {
  return sendMessage('/app/alert', alert);
};

// Send alert response
export const sendAlertResponse = (alertId, response) => {
  return sendMessage(`/app/alert/response/${alertId}`, response);
};

// Send group message
export const sendGroupMessage = (groupId, message) => {
  return sendMessage(`/app/group/${groupId}`, message);
};
