package com.softwarecountry.perseus.auth.service;

import com.softwarecountry.perseus.auth.model.User;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface UserService {
    String getUsername(JwtAuthenticationToken authenticationToken);

    User getUser(JwtAuthenticationToken authenticationToken);
}
