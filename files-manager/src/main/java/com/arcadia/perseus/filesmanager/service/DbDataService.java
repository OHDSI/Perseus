package com.arcadia.perseus.filesmanager.service;

import com.arcadia.perseus.filesmanager.model.BlobData;
import com.arcadia.perseus.filesmanager.model.UserData;
import com.arcadia.perseus.filesmanager.repository.BlobDataRepository;
import com.arcadia.perseus.filesmanager.repository.UserDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

import static java.lang.String.format;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class DbDataService implements DataService {
    private final UserDataRepository userDataRepository;
    private final BlobDataRepository blobDataRepository;
    private final HashService hashService;

    @Transactional(readOnly = true)
    @Override
    public Resource getData(String key) {
        UserData userData = userDataRepository.findByHash(key)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, format("Resource not found by id %s", key)));
        byte[] data = userData.getBlobData().getData();
        return new ByteArrayResource(data);
    }

    @Transactional
    @Override
    public UserData saveData(String username, String dataKey, MultipartFile file) throws IOException {
        byte[] data = file.getBytes();
        String hash = hashService.hash(data);
        BlobData blobData = blobDataRepository.save(BlobData.builder().data(data).build());
        UserData userData = UserData.builder()
                .hash(hash)
                .username(username)
                .dataKey(dataKey)
                .blobData(blobData)
                .build();

        return userDataRepository.save(userData);
    }

    @Transactional
    @Override
    public void deleteData(String key) {
        UserData userData = userDataRepository.findByHash(key)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, format("Resource not found by id %s", key)));
        userDataRepository.delete(userData);
    }
}
