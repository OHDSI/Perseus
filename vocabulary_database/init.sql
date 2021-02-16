--- schema
create schema "vocabulary";



--- tables
CREATE TABLE "vocabulary"."concept"
(
   concept_id        int            NOT NULL,
   concept_name      text           NOT NULL,
   domain_id         varchar(20)    NOT NULL,
   vocabulary_id     varchar(20)    NOT NULL,
   concept_class_id  varchar(20)    NOT NULL,
   standard_concept  varchar(1),
   concept_code      varchar(50)    NOT NULL,
   valid_start_date  date           NOT NULL,
   valid_end_date    date           NOT NULL,
   invalid_reason    varchar(1)
);



CREATE TABLE "vocabulary"."concept_ancestor"
(
   ancestor_concept_id       int   NOT NULL,
   descendant_concept_id     int   NOT NULL,
   min_levels_of_separation  int   NOT NULL,
   max_levels_of_separation  int   NOT NULL
);



CREATE TABLE "vocabulary"."concept_class"
(
   concept_class_id          varchar(20)    NOT NULL,
   concept_class_name        varchar(255)   NOT NULL,
   concept_class_concept_id  int            NOT NULL
);



CREATE TABLE "vocabulary"."concept_relationship"
(
   concept_id_1      int           NOT NULL,
   concept_id_2      int           NOT NULL,
   relationship_id   varchar(20)   NOT NULL,
   valid_start_date  date          NOT NULL,
   valid_end_date    date          NOT NULL,
   invalid_reason    varchar(1)
);



CREATE TABLE "vocabulary"."concept_synonym"
(
   concept_id            int             NOT NULL,
   concept_synonym_name  varchar(1000)   NOT NULL,
   language_concept_id   int             NOT NULL
);



CREATE TABLE "vocabulary"."domain"
(
   domain_id          varchar(20)    NOT NULL,
   domain_name        varchar(255)   NOT NULL,
   domain_concept_id  int            NOT NULL
);



CREATE TABLE "vocabulary"."drug_strength"
(
   drug_concept_id              int          NOT NULL,
   ingredient_concept_id        int          NOT NULL,
   amount_value                 float,
   amount_unit_concept_id       int,
   numerator_value              float,
   numerator_unit_concept_id    int,
   denominator_value            float,
   denominator_unit_concept_id  int,
   box_size                     int,
   valid_start_date             date         NOT NULL,
   valid_end_date               date         NOT NULL,
   invalid_reason               varchar(1)
);



CREATE TABLE "vocabulary"."relationship"
(
   relationship_id          varchar(20)    NOT NULL,
   relationship_name        varchar(255)   NOT NULL,
   is_hierarchical          varchar(1)     NOT NULL,
   defines_ancestry         varchar(1)     NOT NULL,
   reverse_relationship_id  varchar(20)    NOT NULL,
   relationship_concept_id  int            NOT NULL
);



CREATE TABLE "vocabulary"."source_to_concept_map"
(
   source_code              varchar(255)    NOT NULL,
   source_concept_id        int            NOT NULL,
   source_vocabulary_id     varchar(20)    NOT NULL,
   source_code_description  varchar(255),
   target_concept_id        int            NOT NULL,
   target_vocabulary_id     varchar(20)    NOT NULL,
   valid_start_date         date           NOT NULL,
   valid_end_date           date           NOT NULL,
   invalid_reason           varchar(1)
);



CREATE TABLE "vocabulary"."vocabulary"
(
   vocabulary_id          varchar(20)    NOT NULL,
   vocabulary_name        varchar(255)   NOT NULL,
   vocabulary_reference   varchar(255),
   vocabulary_version     varchar(255),
   vocabulary_concept_id  int            NOT NULL
);



--- copy
COPY "vocabulary"."concept" FROM '/tmp/vocabulary/CONCEPT.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');
COPY "vocabulary"."concept_ancestor" FROM '/tmp/vocabulary/CONCEPT_ANCESTOR.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');
COPY "vocabulary"."concept_class" FROM '/tmp/vocabulary/CONCEPT_CLASS.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');
COPY "vocabulary"."concept_relationship" FROM '/tmp/vocabulary/CONCEPT_RELATIONSHIP.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');
COPY "vocabulary"."concept_synonym" FROM '/tmp/vocabulary/CONCEPT_SYNONYM.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');
COPY "vocabulary"."domain" FROM '/tmp/vocabulary/DOMAIN.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');
COPY "vocabulary"."drug_strength" FROM '/tmp/vocabulary/DRUG_STRENGTH.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');
COPY "vocabulary"."relationship" FROM '/tmp/vocabulary/RELATIONSHIP.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');
COPY "vocabulary"."vocabulary" FROM '/tmp/vocabulary/VOCABULARY.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');
