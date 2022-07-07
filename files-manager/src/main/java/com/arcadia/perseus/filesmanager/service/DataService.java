package com.arcadia.perseus.filesmanager.service;

import com.arcadia.perseus.filesmanager.model.UserData;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface DataService {
    Resource getFile(Long userDataId);

    UserData saveFile(String username, String dataKey, MultipartFile file) throws IOException;

    void deleteData(Long userDataId);

    UserData getUserData(Long userDataId);
}
