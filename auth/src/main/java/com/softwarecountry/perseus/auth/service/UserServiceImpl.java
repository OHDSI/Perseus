package com.softwarecountry.perseus.auth.service;

import com.softwarecountry.perseus.auth.model.User;
import com.softwarecountry.perseus.auth.util.TokenAttributes;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import static com.softwarecountry.perseus.auth.util.TokenAttributes.of;

@Service
public class UserServiceImpl implements UserService {
    public static final String UNIQUE_NAME = "unique_name";
    public static final String EMAIL = "email";
    public static final String NAME = "name";

    @Override
    public String getUsername(JwtAuthenticationToken authenticationToken) {
        TokenAttributes tokenAttributes = of(authenticationToken.getTokenAttributes());
        return tokenAttributes.get(UNIQUE_NAME);
    }

    @Override
    public User getUser(JwtAuthenticationToken authenticationToken) {
        TokenAttributes tokenAttributes = of(authenticationToken.getTokenAttributes());
        String fullName = tokenAttributes.get(NAME);
        int comaIndex = fullName.indexOf(",");
        String firstName;
        String lastName = null;
        if (comaIndex == -1) {
            firstName = fullName;
        } else {
            firstName = fullName.substring(0, comaIndex).trim();
            lastName = fullName.substring(comaIndex + 1).trim();
        }
        return User.builder()
                .username(tokenAttributes.get(UNIQUE_NAME))
                .email(tokenAttributes.get(EMAIL))
                .firstName(firstName)
                .lastName(lastName)
                .build();
    }
}
