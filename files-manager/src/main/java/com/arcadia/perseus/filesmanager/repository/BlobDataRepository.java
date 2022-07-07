package com.arcadia.perseus.filesmanager.repository;

import com.arcadia.perseus.filesmanager.model.BlobData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlobDataRepository extends JpaRepository<BlobData, Long> {
}
