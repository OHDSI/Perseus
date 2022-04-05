package com.arcadia.perseus.filesmanager.service;

import com.arcadia.perseus.filesmanager.model.BlobData;
import com.arcadia.perseus.filesmanager.model.UserData;
import com.arcadia.perseus.filesmanager.repository.BlobDataRepository;
import com.arcadia.perseus.filesmanager.repository.UserDataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.List;

import static com.arcadia.perseus.filesmanager.service.MD5ServiceTest.readFileFromResourcesAsByteArray;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class DbDataServiceTest {
    @Autowired
    UserDataRepository userDataRepository;

    @Autowired
    BlobDataRepository blobDataRepository;

    @Autowired
    HashService hashService;

    @Autowired
    DbDataService dataService;

    @BeforeEach
    void setUp() {
        userDataRepository.deleteAll();
    }

    @Test
    void saveFileAndGet() throws IOException {
        String username = "Perseus";
        String dataKey = "Test";
        String fileName = "cprd_1k.etl";
        byte[] bytes = readFileFromResourcesAsByteArray(getClass(), fileName);
        MockMultipartFile multipartFile = new MockMultipartFile(fileName, bytes);
        UserData userData = dataService.saveFile(username, dataKey, multipartFile);

        assertEquals(username, userData.getUsername());
        assertEquals(dataKey, userData.getDataKey());

        Resource resource = dataService.getFile(userData.getId());
        byte[] data = resource.getInputStream().readAllBytes();

        assertEquals(hashService.hash(bytes), hashService.hash(data));
    }

    @Test
    void saveData() throws IOException {
        String username = "Perseus";
        String dataKey = "Test";
        String fileName1 = "cprd_1k.etl";
        String fileName2 = "mdcd_native_test.etl";
        byte[] bytes1 = readFileFromResourcesAsByteArray(getClass(), fileName1);
        byte[] bytes2 = readFileFromResourcesAsByteArray(getClass(), fileName2);
        MockMultipartFile multipartFile1 = new MockMultipartFile(fileName1, bytes1);
        MockMultipartFile multipartFile2 = new MockMultipartFile(fileName2, bytes2);
        UserData userData1 = dataService.saveFile(username, dataKey, multipartFile1);
        UserData userData2 = dataService.saveFile(username, dataKey, multipartFile2);

        assertTrue(userDataRepository.findById(userData1.getId()).isPresent());
        assertTrue(userDataRepository.findById(userData2.getId()).isPresent());
        assertTrue(userDataRepository.findFirstByHash(userData1.getHash()).isPresent());
        assertTrue(userDataRepository.findFirstByHash(userData2.getHash()).isPresent());
    }

    @Test
    void deleteData() {
        String hash = "test";
        String fileName = "cprd_1k.etl";
        byte[] bytes = readFileFromResourcesAsByteArray(getClass(), fileName);
        BlobData blobData = BlobData.builder().data(bytes).build();
        blobDataRepository.save(blobData);
        UserData userData = UserData.builder()
                .hash(hash)
                .dataKey("test")
                .username("test")
                .fileName("test.xlsx")
                .blobData(blobData)
                .build();
        blobData.setUserDataList(List.of(userData));
        userDataRepository.saveAndFlush(userData);

        dataService.deleteData(userData.getId());

        assertNotNull(userData.getId());
        assertNotNull(blobData.getId());
        assertTrue(userDataRepository.findFirstByHash(hash).isEmpty());
        assertTrue(userDataRepository.findById(userData.getId()).isEmpty());
        assertTrue(blobDataRepository.findById(blobData.getId()).isEmpty());
    }
}