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
    public Resource getFile(final Long userDataId) {
        UserData userData = findUserDataByIdOrThrowNotFoundException(userDataId);
        byte[] data = userData.getBlobData().getData();
        return new ByteArrayResource(data);
    }

    @Transactional
    @Override
    public UserData saveFile(String username, String dataKey, MultipartFile file) throws IOException {
        byte[] data = file.getBytes();
        String hash = hashService.hash(data);
        String filename = file.getOriginalFilename();

        Optional<UserData> byAllParameters =
                userDataRepository.findByHashAndUsernameAndDataKeyAndFileName(hash, username, dataKey, filename);
        if (byAllParameters.isPresent()) {
            return byAllParameters.get();
        }

        Optional<UserData> byHash = userDataRepository.findFirstByHash(hash);
        BlobData blobData = byHash
                .map(UserData::getBlobData)
                .orElseGet(() -> blobDataRepository.save(BlobData.builder().data(data).build()));
        UserData userData = UserData.builder()
                .hash(hash)
                .username(username)
                .dataKey(dataKey)
                .fileName(filename)
                .blobData(blobData)
                .build();

        return userDataRepository.save(userData);
    }

    @Transactional
    @Override
    public void deleteData(Long userDataId) {
        UserData userData = findUserDataByIdOrThrowNotFoundException(userDataId);
        userDataRepository.delete(userData);
        BlobData blobData = userData.getBlobData();
        if (blobData.getUserDataList().size() < 2) {
            blobDataRepository.delete(blobData);
        }
    }

    @Override
    public UserData getUserData(Long userDataId) {
        return findUserDataByIdOrThrowNotFoundException(userDataId);
    }

    private UserData findUserDataByIdOrThrowNotFoundException(Long userDataId) {
        return userDataRepository.findById(userDataId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, format("Resource not found by id %s", userDataId)));
    }
}
