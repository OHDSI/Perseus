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
import java.sql.Blob;
import java.util.Optional;

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
    public Resource getData(final Long userDataId) {
        UserData userData = userDataRepository.findById(userDataId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, format("UserData not found by id %s", userDataId)));
        byte[] data = userData.getBlobData().getData();
        return new ByteArrayResource(data);
    }

    @Transactional
    @Override
    public UserData saveData(String username, String dataKey, MultipartFile file) throws IOException {
        byte[] data = file.getBytes();
        String hash = hashService.hash(data);

        Optional<UserData> byAllParameters =
                userDataRepository.findByHashAndUsernameAndDataKey(hash, username, dataKey);
        if (byAllParameters.isPresent()) {
            return byAllParameters.get();
        }

        Optional<UserData> byHash = userDataRepository.findByHash(hash);
        BlobData blobData = byHash
                .map(UserData::getBlobData)
                .orElseGet(() -> blobDataRepository.save(BlobData.builder().data(data).build()));
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
