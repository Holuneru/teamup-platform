package com.teamup.security;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.cors.CorsConfiguration;

import static org.junit.jupiter.api.Assertions.assertTrue;

class SecurityConfigCorsTest {

    @Test
    void corsAllowsPatchRequestsFromFrontend() {
        CorsConfiguration configuration = new SecurityConfig(null)
                .corsConfigurationSource()
            .getCorsConfiguration(new MockHttpServletRequest("PATCH", "/api/projects/1/tasks/1/status"));

        assertTrue(configuration.getAllowedMethods().contains("PATCH"));
    }
}
