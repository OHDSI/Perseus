package com.arcadia.perseus.filesmanager.web.controller;

import com.arcadia.perseus.filesmanager.model.UserData;
import com.arcadia.perseus.filesmanager.repository.UserDataRepository;
import com.arcadia.perseus.filesmanager.service.DataService;
import com.arcadia.perseus.filesmanager.service.HashService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static com.arcadia.perseus.filesmanager.service.MD5ServiceTest.readFileFromResourcesAsByteArray;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.http.MediaType.APPLICATION_OCTET_STREAM;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest
class DataControllerTest {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    HashService hashService;

    @Autowired
    UserDataRepository userDataRepository;

    @Autowired
    DataService dataService;

    @Test
    void saveAndGetFile() throws Exception {
        String fileName = "cprd_1k.etl";
        byte[] bytes = readFileFromResourcesAsByteArray(getClass(), fileName);
        MockMultipartFile multipartFile = new MockMultipartFile(fileName, bytes);

        MockHttpServletRequestBuilder postRequestBuilder = MockMvcRequestBuilders
                .multipart("/api")
                .file("file", multipartFile.getBytes())
                .param("username", "Perseus")
                .param("dataKey", "Test");

        MvcResult postResult = mockMvc
                .perform(postRequestBuilder)
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andReturn();

        String contentAsString = postResult.getResponse().getContentAsString();
        UserData userData = new ObjectMapper().readValue(contentAsString, UserData.class);
        String key = userData.getHash();

        MockHttpServletRequestBuilder getRequestBuilder = MockMvcRequestBuilders
                .get("/api/" + key)
                .contentType(APPLICATION_OCTET_STREAM);

        MvcResult getResult = mockMvc
                .perform(getRequestBuilder)
                .andExpect(status().isOk())
                .andReturn();

        byte[] resultBytes = getResult.getResponse().getContentAsByteArray();
        assertEquals(bytes.length, resultBytes.length);
        assertArrayEquals(bytes, resultBytes);
    }
}