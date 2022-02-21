package com.arcadia.perseus.filesmanager.service;

import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

public class MD5ServiceTest {
    MD5Service md5Service;

    @BeforeEach
    void setUp() {
        md5Service = new MD5Service();
    }

    @Test
    void stringHash() {
        String input = "Test";
        String md5hash = "0CBC6611F5540BD0809A388DC95A615B";
        String result = md5Service.hash(input.getBytes());

        assertEquals(md5hash, result);
    }

    @Test
    void fileHash() {
        String md5hash = "669863F07DC8B5BB3FA54C359FD34B08";
        String fileName = "mdcd_native_test.etl";
        byte[] bytes = readFileFromResourcesAsByteArray(getClass(), fileName);
        String result = md5Service.hash(bytes);

        assertEquals(md5hash, result);
    }

    @Test
    void etlHashesNotEqual() {
        String firstEtlFileName = "mdcd_native_test.etl";
        String secondEtlFileName = "cprd_1k.etl";
        byte[] firstEtlByteArray = readFileFromResourcesAsByteArray(getClass(), firstEtlFileName);
        byte[] secondEtlByteArray = readFileFromResourcesAsByteArray(getClass(), secondEtlFileName);
        String firstEtlHash = md5Service.hash(firstEtlByteArray);
        String secondEtlHash = md5Service.hash(secondEtlByteArray);

        assertNotEquals(firstEtlHash, secondEtlHash);
    }

    @SneakyThrows
    public static byte[] readFileFromResourcesAsByteArray(Class<?> currentClass, String fileName) {
        InputStream inputStream = Optional.ofNullable(currentClass.getClassLoader().getResourceAsStream(fileName))
                .orElseThrow(() -> new RuntimeException("Can not open file " + fileName));
        return inputStream.readAllBytes();
    }
}