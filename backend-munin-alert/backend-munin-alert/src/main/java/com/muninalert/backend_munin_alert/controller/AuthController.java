package com.muninalert.backend_munin_alert.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.muninalert.backend_munin_alert.dto.AuthResponse;
import com.muninalert.backend_munin_alert.dto.LoginRequest;
import com.muninalert.backend_munin_alert.dto.ForgotUsernameRequest;
import com.muninalert.backend_munin_alert.dto.ForgotUsernameResponse;
import com.muninalert.backend_munin_alert.dto.RegisterRequest;
import com.muninalert.backend_munin_alert.model.User;
import com.muninalert.backend_munin_alert.security.JwtUtil;
import com.muninalert.backend_munin_alert.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        // Debug log
        System.out.println("==== REGISTER REQUEST RECEIVED ====");
        System.out.println("First Name: " + registerRequest.getFirstName());
        System.out.println("Last Name: " + registerRequest.getLastName());
        System.out.println("Username: " + registerRequest.getUsername());
        System.out.println("Email: " + registerRequest.getEmail());
        System.out.println("Password length: " + (registerRequest.getPassword() != null ? registerRequest.getPassword().length() : "null"));
        
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());

        try {
            User savedUser = userService.registerUser(user);

            UserDetails userDetails = userService.loadUserByUsername(savedUser.getUsername());
            String jwt = jwtUtil.generateToken(userDetails);

            System.out.println("==== REGISTER SUCCESS ====");
            System.out.println("User ID: " + savedUser.getId());
            
            return ResponseEntity.ok(AuthResponse.builder()
                    .token(jwt)
                    .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .build());
        } catch (IllegalArgumentException | DataIntegrityViolationException | UsernameNotFoundException e) {
            logger.error("Registration error", e);
            logger.error("Error type: {}, Error message: {}", e.getClass().getName(), e.getMessage());
            throw new RuntimeException("Error during registration: " + e.getMessage(), e);
        } catch (SecurityException e) {
            logger.error("Security error during registration", e);
            throw new RuntimeException("Security error during registration", e);
        } catch (RuntimeException e) {
            logger.error("Runtime error during registration", e);
            throw e;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Determine effective identifier: prefer new 'identifier' field, fallback to legacy 'username'
        String rawIdentifier = (loginRequest.getIdentifier() != null && !loginRequest.getIdentifier().isBlank())
                ? loginRequest.getIdentifier()
                : loginRequest.getUsername();

        if (rawIdentifier == null || rawIdentifier.isBlank()) {
            throw new RuntimeException("Username or email is required");
        }

        // Resolve to the actual username stored in DB (if email provided)
        User resolvedUser = userService.findByUsernameOrEmail(rawIdentifier)
                .orElseThrow(() -> new RuntimeException("Incorrect username or password"));
        String principalUsername = resolvedUser.getUsername();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(principalUsername, loginRequest.getPassword())
            );
        } catch (BadCredentialsException | InternalAuthenticationServiceException | AuthenticationCredentialsNotFoundException e) {
            throw new RuntimeException("Incorrect username or password", e);
        }

        UserDetails userDetails = userService.loadUserByUsername(principalUsername);
        String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwt)
                .userId(resolvedUser.getId())
                .username(resolvedUser.getUsername())
                .build());
    }

    /**
     * Forgot-username endpoint: accepts an email and returns the associated username.
     * This can be adjusted for privacy (e.g. always return 200 with generic message),
     * but per current requirement we return the concrete username if found.
     */
    @PostMapping("/forgot-username")
    public ResponseEntity<ForgotUsernameResponse> forgotUsername(@Valid @RequestBody ForgotUsernameRequest request) {
        User user = userService.findByUsernameOrEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email not found"));
        return ResponseEntity.ok(ForgotUsernameResponse.builder().username(user.getUsername()).build());
    }
}
