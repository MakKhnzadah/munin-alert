package com.muninalert.backend_munin_alert.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration for the Munin Alert application.
 * 
 * This class configures Cross-Origin Resource Sharing (CORS) at the Spring MVC level,
 * which is an additional layer of CORS configuration beyond the security configuration.
 * This ensures that CORS headers are properly applied to all responses.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * Configure CORS for all endpoints.
     * 
     * This method adds CORS configuration to ensure that the frontend application
     * running on a different origin can communicate with the backend API.
     * 
     * @param registry The CORS registry to be configured
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("*")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
            .allowedHeaders("*")
            .exposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "Authorization")
            .maxAge(3600);
    }
}