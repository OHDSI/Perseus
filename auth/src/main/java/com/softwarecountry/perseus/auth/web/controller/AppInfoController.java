package com.softwarecountry.perseus.auth.web.controller;

import com.softwarecountry.perseus.auth.model.AppInfoResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/info")
@Slf4j
public class AppInfoController {
    @GetMapping
    public ResponseEntity<AppInfoResponse> getInfo() {
        log.info("Rest request to get App info");
        return ok(new AppInfoResponse(0.4, "Auth"));
    }
}
