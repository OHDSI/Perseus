package com.arcadia.perseus.filesmanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.util.List;

import static javax.persistence.FetchType.LAZY;
import static javax.persistence.GenerationType.SEQUENCE;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "blob_data")
public class BlobData {
    @Id
    @SequenceGenerator(name = "blob_data_id_sequence", sequenceName = "blob_data_id_sequence")
    @GeneratedValue(strategy = SEQUENCE, generator = "blob_data_id_sequence")
    private Long id;

    @Lob
    @Column(nullable = false)
    private byte[] data;

    @OneToMany(mappedBy = "blobData", fetch = LAZY)
    private List<UserData> userDataList;
}
