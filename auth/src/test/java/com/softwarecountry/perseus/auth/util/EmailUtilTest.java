package com.softwarecountry.perseus.auth.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EmailUtilTest {
    @Test
    void parseEmailToUsername1() {
        String email = "matvey.chudakov@softwarecountry.com";
        String username = EmailUtil.emailToUsername(email);

        assertEquals("matvey_chudakov_at_softwarecountry_com", username);
    }

    @Test
    void parseEmailToUsername2() {
        String email = "matvey.chudakov@test.com";
        String username = EmailUtil.emailToUsername(email);

        assertEquals("matvey_chudakov_at_test_com", username);
    }
}