package com.muninalert.backend_munin_alert.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket Configuration for the Munin Alert application.
 * 
 * This class configures the WebSocket endpoints and message broker settings 
 * to enable real-time communication features such as alerts, location updates,
 * and messaging between users and groups.
 * 
 * The configuration uses STOMP (Simple Text Oriented Messaging Protocol) 
 * for WebSocket communication, which provides a structured messaging format.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Configures the message broker for WebSocket communication.
     * 
     * @param config The MessageBrokerRegistry to configure
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker with the following destination prefixes
        // - /topic: Used for public one-to-many messaging (e.g., broadcast alerts, group messages)
        // - /queue: Used for private one-to-one messaging (e.g., direct messages, user notifications)
        config.enableSimpleBroker("/topic", "/queue");
        
        // Set the prefix for messages bound for application handling
        // Client messages with destinations starting with /app will be routed to @MessageMapping methods
        config.setApplicationDestinationPrefixes("/app");
    }

    /**
     * Registers STOMP endpoints for WebSocket connections.
     * 
     * @param registry The StompEndpointRegistry to configure
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the /ws endpoint with SockJS fallback options
        // This endpoint is where clients will connect to establish WebSocket connections
        // SockJS provides fallback options if WebSocket is not available in the client's browser
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Allow connections from any origin (should be restricted in production)
                .withSockJS();
    }
}
