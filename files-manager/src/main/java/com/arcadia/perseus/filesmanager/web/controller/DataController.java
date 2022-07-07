package com.arcadia.perseus.filesmanager.web.controller;

import com.arcadia.perseus.filesmanager.model.UserData;
import com.arcadia.perseus.filesmanager.service.DataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import java.io.IOException;

import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class DataController {
    private final DataService dataService;

    @GetMapping("/{userDataId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long userDataId) {
        log.info("Rest request to download file by userDataId {}", userDataId);
        return ok(dataService.getFile(userDataId));
    }

    @PostMapping
    public ResponseEntity<UserData> saveFile(@NotBlank @RequestParam("username") String username,
                                             @NotBlank @RequestParam("dataKey") String dataKey,
                                             @RequestParam("file") MultipartFile file) throws IOException {
        log.info("Rest request to save file with username {} and data-key {}", username, dataKey);
        return ok(dataService.saveFile(username, dataKey, file));
    }

    @DeleteMapping("/{userDataId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long userDataId) {
        log.info("Rest request to delete file by userDataId {}", userDataId);
        dataService.deleteData(userDataId);
        return noContent().build();
    }

    @GetMapping("/user-data/{userDataId}")
    public ResponseEntity<UserData> getUserData(@PathVariable Long userDataId) {
        log.info("Rest request to get userData by userDataId {}", userDataId);
        return ok(dataService.getUserData(userDataId));
    }
}
