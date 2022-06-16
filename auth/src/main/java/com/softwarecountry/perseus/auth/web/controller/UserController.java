package com.softwarecountry.perseus.auth.web.controller;

import com.softwarecountry.perseus.auth.model.User;
import com.softwarecountry.perseus.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;

    @CrossOrigin(origins = "*")
    @GetMapping
    public ResponseEntity<User> getUser(JwtAuthenticationToken authenticationToken) {
        log.info("Rest request to GET user");
        return ok(userService.getUser(authenticationToken));
    }
}
