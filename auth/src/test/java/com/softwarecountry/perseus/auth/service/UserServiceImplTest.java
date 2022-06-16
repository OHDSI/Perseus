package com.softwarecountry.perseus.auth.service;

import com.softwarecountry.perseus.auth.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import static com.softwarecountry.perseus.auth.service.UserServiceImpl.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class UserServiceImplTest {
    UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        userService = new UserServiceImpl();
    }

    @Test
    void getUser1() {
        JwtAuthenticationToken authenticationToken = createAuthenticationToken("Rick, Novak");
        User user = userService.getUser(authenticationToken);

        assertEquals("Rick", user.getFirstName());
        assertEquals("Novak", user.getLastName());
    }

    @Test
    void getUser2() {
        JwtAuthenticationToken authenticationToken = createAuthenticationToken("Rick");
        User user = userService.getUser(authenticationToken);

        assertEquals("Rick", user.getFirstName());
        assertNull(user.getLastName());
    }

    private JwtAuthenticationToken createAuthenticationToken(String nameValue) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(UNIQUE_NAME, "perseus@softwarecountry.com");
        claims.put(EMAIL, "perseus@softwarecountry.com");
        claims.put(NAME, nameValue);
        Map<String, Object> headers = new HashMap<>();
        headers.put("Test", "Test");
        Jwt jwt = new Jwt("Test", Instant.now(), Instant.now(), headers, claims);
        return new JwtAuthenticationToken(jwt);
    }
}