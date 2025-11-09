package com.muninalert.backend_munin_alert.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Login request supporting either username or email via a unified identifier field.
 * For backward compatibility the original 'username' field is kept; the server
 * will use 'identifier' if provided, otherwise fall back to 'username'.
 */
@Data
public class LoginRequest {
    /**
     * New flexible field: may contain username OR email (preferred going forward).
     */
    private String identifier;

    /**
     * Legacy field – still accepted so existing clients keep working.
     */
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
