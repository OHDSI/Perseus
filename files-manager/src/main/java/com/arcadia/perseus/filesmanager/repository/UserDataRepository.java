package com.arcadia.perseus.filesmanager.repository;

import com.arcadia.perseus.filesmanager.model.UserData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDataRepository extends JpaRepository<UserData, Long> {
    Optional<UserData> findByHash(String hash);
}
