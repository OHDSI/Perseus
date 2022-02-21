package com.arcadia.perseus.filesmanager.service;

import com.arcadia.perseus.filesmanager.FilesManagerApplication;
import com.arcadia.perseus.filesmanager.model.UserData;
import com.arcadia.perseus.filesmanager.repository.UserDataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.ResourceUtils;

import java.io.IOException;
import java.nio.file.Files;

import static com.arcadia.perseus.filesmanager.service.MD5ServiceTest.readFileFromResourcesAsByteArray;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class DbDataServiceTest {
    @Autowired
    UserDataRepository userDataRepository;

    @Autowired
    HashService hashService;

    @Autowired
    DbDataService dataService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void saveFileAndGet() throws IOException {
        String username = "Perseus";
        String dataKey = "Test";
        String fileName = "cprd_1k.etl";
        byte[] bytes = readFileFromResourcesAsByteArray(getClass(), fileName);
        MockMultipartFile multipartFile = new MockMultipartFile(fileName, bytes);
        UserData userData = dataService.saveData(username, dataKey, multipartFile);

        assertEquals(username, userData.getUsername());
        assertEquals(dataKey, userData.getDataKey());

        Resource resource = dataService.getData(userData.getHash());
        byte[] data = resource.getInputStream().readAllBytes();

        assertEquals(hashService.hash(bytes), hashService.hash(data));
    }
}