package com.softwarecountry.perseus.auth.util;

import lombok.AllArgsConstructor;

import java.util.Map;

@AllArgsConstructor
public class TokenAttributes {
    private Map<String, Object> tokenAttributes;

    public static TokenAttributes of(Map<String, Object> tokenAttributes) {
        return new TokenAttributes(tokenAttributes);
    }

    public String get(String attribute) {
        return (String) tokenAttributes.get(attribute);
    }
}
