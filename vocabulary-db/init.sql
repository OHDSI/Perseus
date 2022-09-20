--- schema ---
CREATE SCHEMA "vocabulary";

--- tables ---
--- concept
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

COPY "vocabulary"."concept" FROM '/tmp/vocabulary/CONCEPT.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');

ALTER TABLE "vocabulary"."concept" ADD CONSTRAINT xpk_concept PRIMARY KEY (concept_id);

CREATE UNIQUE INDEX idx_concept_concept_id ON "vocabulary"."concept" (concept_id ASC);
CLUSTER "vocabulary"."concept" USING idx_concept_concept_id ;
CREATE INDEX idx_concept_code ON "vocabulary"."concept" (concept_code ASC);
CREATE INDEX idx_concept_vocabluary_id ON "vocabulary"."concept" (vocabulary_id ASC);
CREATE INDEX idx_concept_domain_id ON "vocabulary"."concept" (domain_id ASC);
CREATE INDEX idx_concept_class_id ON "vocabulary"."concept" (concept_class_id ASC);

VACUUM FULL "vocabulary"."concept";


--- concept_ancestor
CREATE TABLE "vocabulary"."concept_ancestor"
(
   ancestor_concept_id       int   NOT NULL,
   descendant_concept_id     int   NOT NULL,
   min_levels_of_separation  int   NOT NULL,
   max_levels_of_separation  int   NOT NULL
);

COPY "vocabulary"."concept_ancestor" FROM '/tmp/vocabulary/CONCEPT_ANCESTOR.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');

ALTER TABLE "vocabulary"."concept_ancestor" ADD CONSTRAINT xpk_concept_ancestor PRIMARY KEY (ancestor_concept_id,descendant_concept_id);

CREATE INDEX idx_concept_ancestor_id_1 ON "vocabulary"."concept_ancestor" (ancestor_concept_id ASC);
CLUSTER "vocabulary"."concept_ancestor" USING idx_concept_ancestor_id_1;
CREATE INDEX idx_concept_ancestor_id_2 ON "vocabulary"."concept_ancestor" (descendant_concept_id ASC);

VACUUM FULL "vocabulary"."concept_ancestor";


--- concept_class
CREATE TABLE "vocabulary"."concept_class"
(
   concept_class_id          varchar(20)    NOT NULL,
   concept_class_name        varchar(255)   NOT NULL,
   concept_class_concept_id  int            NOT NULL
);

COPY "vocabulary"."concept_class" FROM '/tmp/vocabulary/CONCEPT_CLASS.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');

ALTER TABLE "vocabulary"."concept_class" ADD CONSTRAINT xpk_concept_class PRIMARY KEY (concept_class_id);

CREATE UNIQUE INDEX idx_concept_class_class_id ON "vocabulary"."concept_class" (concept_class_id ASC);
CLUSTER "vocabulary"."concept_class" USING idx_concept_class_class_id ;

VACUUM FULL "vocabulary"."concept_class";


--- concept_relationship
CREATE TABLE "vocabulary"."concept_relationship"
(
   concept_id_1      int           NOT NULL,
   concept_id_2      int           NOT NULL,
   relationship_id   varchar(20)   NOT NULL,
   valid_start_date  date          NOT NULL,
   valid_end_date    date          NOT NULL,
   invalid_reason    varchar(1)
);

COPY "vocabulary"."concept_relationship" FROM '/tmp/vocabulary/CONCEPT_RELATIONSHIP.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');

ALTER TABLE "vocabulary"."concept_relationship" ADD CONSTRAINT xpk_concept_relationship PRIMARY KEY (concept_id_1,concept_id_2,relationship_id);

CREATE INDEX idx_concept_relationship_id_1 ON "vocabulary"."concept_relationship" (concept_id_1 ASC);
CREATE INDEX idx_concept_relationship_id_2 ON "vocabulary"."concept_relationship" (concept_id_2 ASC);
CREATE INDEX idx_concept_relationship_id_3 ON "vocabulary"."concept_relationship" (relationship_id ASC);

VACUUM FULL "vocabulary"."concept_relationship";


--- concept_synonym
CREATE TABLE "vocabulary"."concept_synonym"
(
   concept_id            int             NOT NULL,
   concept_synonym_name  varchar(1000)   NOT NULL,
   language_concept_id   int             NOT NULL
);

COPY "vocabulary"."concept_synonym" FROM '/tmp/vocabulary/CONCEPT_SYNONYM.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');

CREATE INDEX idx_concept_synonym_id ON "vocabulary"."concept_synonym" (concept_id ASC);
CLUSTER "vocabulary"."concept_synonym" USING idx_concept_synonym_id;

VACUUM FULL "vocabulary"."concept_synonym";


--- domain
CREATE TABLE "vocabulary"."domain"
(
   domain_id          varchar(20)    NOT NULL,
   domain_name        varchar(255)   NOT NULL,
   domain_concept_id  int            NOT NULL
);

COPY "vocabulary"."domain" FROM '/tmp/vocabulary/DOMAIN.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');

ALTER TABLE "vocabulary"."domain" ADD CONSTRAINT xpk_domain PRIMARY KEY (domain_id);

CREATE UNIQUE INDEX idx_domain_domain_id ON "vocabulary"."domain" (domain_id ASC);
CLUSTER "vocabulary"."domain" USING idx_domain_domain_id ;

VACUUM FULL "vocabulary"."domain";


--- drug_strength
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

COPY "vocabulary"."drug_strength" FROM '/tmp/vocabulary/DRUG_STRENGTH.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');

ALTER TABLE "vocabulary"."drug_strength" ADD CONSTRAINT xpk_drug_strength PRIMARY KEY (drug_concept_id, ingredient_concept_id);

CREATE INDEX idx_drug_strength_id_1 ON "vocabulary"."drug_strength" (drug_concept_id ASC);
CLUSTER "vocabulary"."drug_strength"  USING idx_drug_strength_id_1;
CREATE INDEX idx_drug_strength_id_2 ON "vocabulary"."drug_strength" (ingredient_concept_id ASC);

VACUUM FULL "vocabulary"."drug_strength";


--- relationship
CREATE TABLE "vocabulary"."relationship"
(
   relationship_id          varchar(20)    NOT NULL,
   relationship_name        varchar(255)   NOT NULL,
   is_hierarchical          varchar(1)     NOT NULL,
   defines_ancestry         varchar(1)     NOT NULL,
   reverse_relationship_id  varchar(20)    NOT NULL,
   relationship_concept_id  int            NOT NULL
);

COPY "vocabulary"."relationship" FROM '/tmp/vocabulary/RELATIONSHIP.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');

ALTER TABLE "vocabulary"."relationship" ADD CONSTRAINT xpk_relationship PRIMARY KEY (relationship_id);

CREATE UNIQUE INDEX idx_relationship_rel_id ON "vocabulary"."relationship" (relationship_id ASC);
CLUSTER "vocabulary"."relationship" USING idx_relationship_rel_id;

VACUUM FULL "vocabulary"."relationship";


--- source_to_concept_map
CREATE TABLE "vocabulary"."source_to_concept_map"
(
   id                       serial         PRIMARY KEY,
   source_code              varchar(255)   NOT NULL,
   source_concept_id        int            NOT NULL,
   source_vocabulary_id     varchar(20)    NOT NULL,
   source_code_description  varchar(255),
   target_concept_id        int            NOT NULL,
   target_vocabulary_id     varchar(20)    NOT NULL,
   valid_start_date         date           NOT NULL,
   valid_end_date           date           NOT NULL,
   invalid_reason           varchar(1),
   username                 varchar(255)   NOT NULL
);

-- ALTER TABLE "vocabulary"."source_to_concept_map" ADD CONSTRAINT xpk_source_to_concept_map PRIMARY KEY (source_vocabulary_id,target_concept_id,source_code,valid_end_date);

CREATE INDEX idx_source_to_concept_map_id_3 ON "vocabulary"."source_to_concept_map" (target_concept_id ASC);
CLUSTER "vocabulary"."source_to_concept_map"  USING idx_source_to_concept_map_id_3;
CREATE INDEX idx_source_to_concept_map_id_1 ON "vocabulary"."source_to_concept_map" (source_vocabulary_id ASC);
CREATE INDEX idx_source_to_concept_map_id_2 ON "vocabulary"."source_to_concept_map" (target_vocabulary_id ASC);
CREATE INDEX idx_source_to_concept_map_code ON "vocabulary"."source_to_concept_map" (source_code ASC);

VACUUM FULL "vocabulary"."source_to_concept_map";


--- vocabulary
CREATE TABLE "vocabulary"."vocabulary"
(
   vocabulary_id          varchar(20)    NOT NULL,
   vocabulary_name        varchar(255)   NOT NULL,
   vocabulary_reference   varchar(255),
   vocabulary_version     varchar(255),
   vocabulary_concept_id  int            NOT NULL
);

COPY "vocabulary"."vocabulary" FROM '/tmp/vocabulary/VOCABULARY.csv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER TRUE, QUOTE E'\b');

CREATE UNIQUE INDEX idx_vocabulary_vocabulary_id ON "vocabulary"."vocabulary" (vocabulary_id ASC);
CLUSTER "vocabulary"."vocabulary" USING idx_vocabulary_vocabulary_id ;

VACUUM FULL "vocabulary"."vocabulary";


--- user ---
CREATE USER vocabulary WITH ENCRYPTED PASSWORD 'password';


--- permissions
GRANT CREATE on database vocabulary TO vocabulary;
GRANT USAGE ON SCHEMA vocabulary TO vocabulary;
GRANT SELECT ON ALL TABLES IN SCHEMA vocabulary TO vocabulary;
GRANT INSERT on "vocabulary"."source_to_concept_map" to vocabulary;
GRANT DELETE on "vocabulary"."source_to_concept_map" to vocabulary;
GRANT UPDATE on "vocabulary"."source_to_concept_map_id_seq" to vocabulary;
