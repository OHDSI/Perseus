package com.softwarecountry.perseus.auth.web.controller;

import com.softwarecountry.perseus.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    public static final String USERNAME_HEADER = "Username";

    private final UserService userService;

    @CrossOrigin(origins = "*")
    @GetMapping
    public void isAuthenticated(JwtAuthenticationToken authenticationToken, HttpServletResponse response) {
        log.info("Rest request to check authentication");
        String username = userService.getUsername(authenticationToken);
        response.setHeader(USERNAME_HEADER, username);
    }

    @GetMapping("/internal")
    public void isAuthenticatedInternal(JwtAuthenticationToken authenticationToken, HttpServletResponse response) {
        log.info("Internal Rest request to check authentication");
        String username = userService.getUsername(authenticationToken);
        response.setHeader(USERNAME_HEADER, username);
    }
}
