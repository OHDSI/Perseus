package com.arcadia.perseus.filesmanager.repository;

import com.arcadia.perseus.filesmanager.model.UserData;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserDataRepository extends CrudRepository<UserData, Long> {
    Optional<UserData> findByHash(String hash);
}
