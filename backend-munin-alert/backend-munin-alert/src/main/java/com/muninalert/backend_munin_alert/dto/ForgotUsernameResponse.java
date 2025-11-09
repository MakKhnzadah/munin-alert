package com.muninalert.backend_munin_alert.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ForgotUsernameResponse {
    private String username;
}
