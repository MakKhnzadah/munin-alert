package com.muninalert.backend_munin_alert.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security configuration for the Munin Alert application.
 * 
 * This class configures Spring Security with:
 * 1. JWT-based authentication
 * 2. Stateless session management
 * 3. Endpoint authorization rules
 * 4. Password encryption
 * 
 * Public endpoints:
 * - Root endpoint (/)
 * - Authentication endpoints (/api/auth/**)
 * - Public information endpoints (/api/public/**)
 * 
 * All other endpoints require authentication.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    /**
     * Configures security filter chain for HTTP requests.
     * 
     * This method:
     * - Disables CSRF protection (as we use JWT tokens)
     * - Configures which endpoints are public and which require authentication
     * - Sets stateless session management
     * - Adds JWT filter before the standard authentication filter
     * 
     * @param http HttpSecurity object to be configured
     * @return The configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    /**
     * Creates a password encoder bean for securely hashing passwords.
     * 
     * This implementation uses BCrypt, a strong hashing function specifically
     * designed for password storage with built-in salt generation.
     * 
     * @return A BCryptPasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Creates an authentication manager bean for handling user authentication.
     * 
     * The authentication manager is used by the authentication controller to
     * validate user credentials during login attempts.
     * 
     * @param authenticationConfiguration The authentication configuration object
     * @return The configured AuthenticationManager
     * @throws Exception if configuration fails
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
