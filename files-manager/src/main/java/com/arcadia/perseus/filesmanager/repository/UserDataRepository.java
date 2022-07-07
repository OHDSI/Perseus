package com.arcadia.perseus.filesmanager.repository;

import com.arcadia.perseus.filesmanager.model.UserData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDataRepository extends JpaRepository<UserData, Long> {
    Optional<UserData> findFirstByHash(String hash);

    Optional<UserData> findByHashAndUsernameAndDataKeyAndFileName(String hash, String username, String dataKey, String fileName);
}
