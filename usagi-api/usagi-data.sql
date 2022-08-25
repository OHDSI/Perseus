--- ! Connect via Usagi user


--- create tables for usagi search
create schema usagi_data;


-- usagi:loadValidConceptIdsAndAtcCodes
create table usagi_data.valid_concept_ids
(
    concept_id INTEGER PRIMARY KEY
);

INSERT INTO usagi_data.valid_concept_ids
    select concept_id
    from vocabulary.concept
    where invalid_reason is null;


-- usagi:loadValidConceptIdsAndAtcCodes
create table usagi_data.concept_id_to_atc_code
(
    concept_id   INTEGER,
    concept_code VARCHAR
);

INSERT INTO usagi_data.concept_id_to_atc_code
    select concept_id, concept_code
    from vocabulary.concept
    where invalid_reason is null
        and vocabulary_id = 'ATC';


--- MapsToRelationship; usagi:loadRelationships
create table usagi_data.maps_to_relationship
(
    concept_id_1 INTEGER,
    concept_id_2 INTEGER
);

INSERT INTO usagi_data.maps_to_relationship
    select concept_id_1, concept_id_2 from vocabulary.concept_relationship
    where relationship_id = 'Maps to'
        and invalid_reason is null
        and concept_id_1 != concept_id_2
        and exists(
            select concept_id from usagi_data.valid_concept_ids where concept_id=concept_id_1
        )
        and exists(
            select concept_id from usagi_data.valid_concept_ids where concept_id=concept_id_2
        );


--- usagi:loadRelationships
create table usagi_data.relationship_atc_rxnorm
(
    concept_id_1 INTEGER,
    concept_id_2 INTEGER
);

INSERT INTO usagi_data.relationship_atc_rxnorm
    select concept_id_1, concept_id_2 from vocabulary.concept_relationship
    where relationship_id = 'ATC - RxNorm'
        and invalid_reason is null
        and exists(
            select concept_id from usagi_data.valid_concept_ids where concept_id = concept_id_1
        )
        and exists(
            select concept_id from usagi_data.valid_concept_ids where concept_id = concept_id_2
        );


---AtcToRxNorm; usagi:loadRelationships (is used when creating source codes - usagi:createSourceCodes)
create table usagi_data.atc_to_rxnorm
(
    concept_code VARCHAR,
    concept_id_2 INTEGER
);

INSERT INTO usagi_data.atc_to_rxnorm
    select concept_code, concept_id_2 from usagi_data.concept_id_to_atc_code
        join usagi_data.relationship_atc_rxnorm on concept_id = concept_id_1;


--- ParentChildRelationShip; usagi:loadAncestors
create table usagi_data.parent_child_relationship
(
    id                    SERIAL PRIMARY KEY,
    ancestor_concept_id   INTEGER,
    descendant_concept_id INTEGER
);

INSERT INTO usagi_data.parent_child_relationship (ancestor_concept_id, descendant_concept_id)
    select ancestor_concept_id, descendant_concept_id from vocabulary.concept_ancestor
    where min_levels_of_separation = 1
        and ancestor_concept_id != descendant_concept_id
        and exists(
            select concept_id from usagi_data.valid_concept_ids where concept_id=ancestor_concept_id
        )
        and exists(
            select concept_id from usagi_data.valid_concept_ids where concept_id=descendant_concept_id
        );


-- usagi:getParentChildRelationshipsByParentConceptId
create table usagi_data.parent_count
(
    descendant_concept_id INTEGER PRIMARY KEY,
    parent_count          INTEGER
);

INSERT INTO usagi_data.parent_count
    select descendant_concept_id, count(ancestor_concept_id)
    from usagi_data.parent_child_relationship
    group by descendant_concept_id;


-- usagi:getParentChildRelationshipsByChildConceptId
create table usagi_data.child_count
(
    ancestor_concept_id INTEGER PRIMARY KEY,
    child_count         INTEGER
);

INSERT INTO usagi_data.child_count
    select ancestor_concept_id, count(descendant_concept_id)
    from usagi_data.parent_child_relationship
    group by ancestor_concept_id;


--- Concept  relationship; usagi:loadConcepts
create table usagi_data.concept
(
    concept_id       INTEGER PRIMARY KEY,
    concept_name     VARCHAR,
    domain_id        VARCHAR,
    vocabulary_id    VARCHAR,
    concept_class_id VARCHAR,
    standard_concept VARCHAR,
    concept_code     VARCHAR,
    valid_start_date DATE,
    valid_end_date   DATE,
    invalid_reason   VARCHAR,
    parent_count     INTEGER,
    child_count      INTEGER
);

INSERT INTO usagi_data.concept(concept_id,
                               concept_name,
                               domain_id,
                               vocabulary_id,
                               concept_class_id,
                               standard_concept,
                               concept_code,
                               valid_start_date,
                               valid_end_date,
                               invalid_reason,
                               parent_count,
                               child_count
) select concept_id,
         concept_name,
         domain_id,
         vocabulary_id,
         concept_class_id,
         standard_concept,
         concept_code,
         valid_start_date,
         valid_end_date,
         invalid_reason,
         (
            select parent_count
            from usagi_data.parent_count
            where descendant_concept_id = concept_id
         ),
         (
            select child_count
            from usagi_data.child_count
            where ancestor_concept_id = concept_id
         )
    from vocabulary.concept;


--- concepts for indexing; usagi:buildIndex
create table usagi_data.concept_for_index
(
    type             VARCHAR,
    term             TEXT,
    concept_id       VARCHAR,
    domain_id        VARCHAR,
    vocabulary_id    VARCHAR,
    concept_class_id VARCHAR,
    standard_concept VARCHAR,
    term_type        VARCHAR
);

INSERT INTO usagi_data.concept_for_index(type,
                                        term_type,
                                        term,
                                        concept_id,
                                        domain_id,
                                        vocabulary_id,
                                        concept_class_id,
                                        standard_concept
) select 'C',
         'C',
         concept_name,
         concept_id,
         domain_id,
         vocabulary_id,
         concept_class_id,
         standard_concept
    from usagi_data.concept
    where standard_concept IN ('S', 'C');

INSERT INTO usagi_data.concept_for_index(type,
                                        term_type,
                                        term,
                                        concept_id,
                                        domain_id,
                                        vocabulary_id,
                                        concept_class_id,
                                        standard_concept
) select distinct 'C',
                  'S',
                  t1.concept_name,
                  t3.concept_id,
                  t3.domain_id,
                  t3.vocabulary_id,
                  t3.concept_class_id,
                  t3.standard_concept
    from usagi_data.concept as t1
        JOIN usagi_data.maps_to_relationship
            AS t2 ON t1.concept_id = t2.concept_id_1
        JOIN usagi_data.concept
            AS t3 ON concept_id_2 = t3.concept_id
    where t1.standard_concept is null
      AND lower(t1.concept_name) != lower(t3.concept_name);

--- adding concept synonyms
INSERT INTO usagi_data.concept_for_index(type,
                                        term_type,
                                        term,
                                        concept_id,
                                        domain_id,
                                        vocabulary_id,
                                        concept_class_id,
                                        standard_concept
) select distinct 'C',
                  'C',
                  t2.concept_synonym_name,
                  t1.concept_id,
                  t1.domain_id,
                  t1.vocabulary_id,
                  t1.concept_class_id,
                  t1.standard_concept
    from usagi_data.concept as t1
        JOIN vocabulary.concept_synonym AS t2
            ON t1.concept_id = t2.concept_id
    where t1.standard_concept IN ('S', 'C')
      AND lower(t1.concept_name) != lower(t2.concept_synonym_name);

INSERT INTO usagi_data.concept_for_index(type,
                                        term_type,
                                        term,
                                        concept_id,
                                        domain_id,
                                        vocabulary_id,
                                        concept_class_id,
                                        standard_concept
) select distinct 'C',
                  'S',
                  t2.concept_synonym_name,
                  t4.concept_id,
                  t4.domain_id,
                  t4.vocabulary_id,
                  t4.concept_class_id,
                  t4.standard_concept
    from usagi_data.concept as t1
        JOIN vocabulary.concept_synonym AS t2
            ON t1.concept_id = t2.concept_id
        JOIN usagi_data.maps_to_relationship AS t3
            ON t1.concept_id = t3.concept_id_1
        JOIN usagi_data.concept as t4
            ON t3.concept_id_2 = t4.concept_id
    where t1.standard_concept is null
      AND lower(t2.concept_synonym_name) != lower(t4.concept_name);