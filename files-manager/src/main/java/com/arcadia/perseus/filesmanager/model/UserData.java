package com.arcadia.perseus.filesmanager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import static javax.persistence.CascadeType.ALL;
import static javax.persistence.GenerationType.SEQUENCE;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_data")
public class UserData {
    @Id
    @SequenceGenerator(name = "user_data_id_sequence", sequenceName = "user_data_id_sequence")
    @GeneratedValue(strategy = SEQUENCE, generator = "user_data_id_sequence")
    private Long id;

    @Column(nullable = false, unique = true)
    private String hash;

    @Column(nullable = false)
    private String username;

    @Column(name = "data_key", nullable = false)
    private String dataKey;

    @JsonIgnore
    @OneToOne(cascade = ALL, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "blob_id", referencedColumnName = "id")
    private BlobData blobData;
}
