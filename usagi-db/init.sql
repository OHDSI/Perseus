--- create tables for usagi search

create schema usagi;

--- usagi:loadValidConceptIdsAndAtcCodes
create table usagi.valid_concept_ids
(
    concept_id INTEGER PRIMARY KEY
);

--- usagi:loadValidConceptIdsAndAtcCodes
create table usagi.concept_id_to_atc_code
(
    concept_id INTEGER,
    concept_code VARCHAR
);

--- MapsToRelationship; usagi:loadRelationships
create table usagi.maps_to_relationship
(
    concept_id_1 INTEGER,
    concept_id_2 INTEGER
);

--- usagi:loadRelationships
create table usagi.relationship_atc_rxnorm
(
    concept_id_1 INTEGER,
    concept_id_2 INTEGER
);

--- AtcToRxNorm; usagi:loadRelationships (is used when creating source codes - usagi:createSourceCodes)
create table usagi.atc_to_rxnorm
(
    concept_code VARCHAR,
    concept_id_2 INTEGER
);

--- ParentChildRelationShip; usagi:loadAncestors
create table usagi.parent_child_relationship
(
    id SERIAL PRIMARY KEY,
    ancestor_concept_id INTEGER,
    descendant_concept_id INTEGER
);

--- usagi:getParentChildRelationshipsByParentConceptId
create table usagi.parent_count
(
    descendant_concept_id INTEGER PRIMARY KEY,
    parent_count INTEGER
);

--- usagi:getParentChildRelationshipsByChildConceptId
create table usagi.child_count
(
    ancestor_concept_id INTEGER PRIMARY KEY,
    child_count INTEGER
);

--- Concept  relationship; usagi:loadConcepts
create table usagi.concept
(
    concept_id INTEGER PRIMARY KEY,
    concept_name VARCHAR,
    domain_id VARCHAR,
    vocabulary_id VARCHAR,
    concept_class_id VARCHAR,
    standard_concept VARCHAR,
    concept_code VARCHAR,
    valid_start_date DATE,
    valid_end_date DATE,
    invalid_reason VARCHAR,
    parent_count INTEGER,
    child_count INTEGER
);

--- concepts for indexing; usagi:buildIndex
create table usagi.concept_for_index
(
    type VARCHAR,
    term TEXT,
    concept_id VARCHAR,
    domain_id VARCHAR,
    vocabulary_id VARCHAR,
    concept_class_id VARCHAR,
    standard_concept VARCHAR,
    term_type VARCHAR
);

---table for mapped concepts
CREATE TABLE usagi.mapped_concept
(
    id SERIAL PRIMARY KEY,
    name varchar(50) NOT NULL,
    codes_and_mapped_concepts text NOT NULL,
    username VARCHAR ( 30 ) NOT NULL,
    created_on TIMESTAMP
);
