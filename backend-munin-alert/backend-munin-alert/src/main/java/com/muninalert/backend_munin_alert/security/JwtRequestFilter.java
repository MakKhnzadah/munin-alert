package com.muninalert.backend_munin_alert.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JWT Request Filter for processing authentication based on JWT tokens.
 * 
 * This filter intercepts all incoming HTTP requests and checks for valid JWT tokens
 * in the Authorization header. If a valid token is found, it authenticates the user
 * and sets up the security context for the request.
 * 
 * The filter is executed once per request and is part of the Spring Security filter chain.
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Core filter method that processes each HTTP request.
     * 
     * This method:
     * 1. Extracts the JWT token from the Authorization header
     * 2. Validates the token and extracts the username
     * 3. Loads the user details for the extracted username
     * 4. Validates the token against the user details
     * 5. If valid, sets up the authentication in the security context
     * 6. Passes the request to the next filter in the chain
     * 
     * @param request The HTTP request being processed
     * @param response The HTTP response
     * @param chain The filter chain for passing the request to the next filter
     * @throws ServletException If a servlet error occurs
     * @throws IOException If an I/O error occurs
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        // Extract JWT token from the Authorization header
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.error("Error extracting username from token", e);
            }
        }

        // Validate token and set up authentication if token is valid
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        chain.doFilter(request, response);
    }
}
