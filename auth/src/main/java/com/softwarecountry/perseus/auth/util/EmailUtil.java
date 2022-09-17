package com.softwarecountry.perseus.auth.util;

/**
 * Parse email to username.
 * Username can be used as DB schema name.
 */
public class EmailUtil {
    public static final int USERNAME_LIMIT = 250;

    public static String emailToUsername(String email) {
        String username = email.replace('.', '_')
                .replace("@", "_at_");
        return username.length() > USERNAME_LIMIT ? username.substring(0, USERNAME_LIMIT) : username;
    }
}
