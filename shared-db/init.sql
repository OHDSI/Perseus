--- Files Manager
CREATE SCHEMA "files_manager";
CREATE USER files_manager WITH PASSWORD 'password';

GRANT USAGE ON SCHEMA files_manager TO files_manager;
GRANT ALL PRIVILEGES ON SCHEMA files_manager TO files_manager;


--- White Rabbit
CREATE SCHEMA "white_rabbit";
CREATE USER white_rabbit WITH PASSWORD 'password';

GRANT USAGE ON SCHEMA white_rabbit TO white_rabbit;
GRANT ALL PRIVILEGES ON SCHEMA white_rabbit TO white_rabbit;


--- Data Quality Dashboard
CREATE SCHEMA "dqd";
CREATE USER dqd WITH PASSWORD 'password';

GRANT USAGE ON SCHEMA dqd TO dqd;
GRANT ALL PRIVILEGES ON SCHEMA dqd TO dqd;


--- User
CREATE SCHEMA "user";
CREATE USER "user" WITH PASSWORD 'password';

CREATE TABLE "user"."user"
(
    user_id    SERIAL PRIMARY KEY,
    username   VARCHAR(30) UNIQUE NOT NULL,
    first_name VARCHAR(30)        NOT NULL,
    last_name  VARCHAR(30)        NOT NULL,
    email      VARCHAR(50) UNIQUE NOT NULL,
    password   VARCHAR(255)       NOT NULL,
    active     BOOLEAN            NOT NULL
);

CREATE TABLE "user"."blacklist_token"
(
    id             SERIAL PRIMARY KEY,
    token          VARCHAR(500) UNIQUE NOT NULL,
    blacklisted_on TIMESTAMP           NOT NULL
);

CREATE TABLE "user"."unauthorized_reset_pwd_request"
(
    report_id   SERIAL PRIMARY KEY,
    username    VARCHAR(30) NOT NULL,
    report_date TIMESTAMP
);

CREATE TABLE "user"."refresh_token"
(
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(50) UNIQUE NOT NULL,
    refresh_token   VARCHAR(255)       NOT NULL,
    expiration_date TIMESTAMP
);

INSERT INTO "user"."user" ("username", "first_name", "last_name", "email", "password", "active")
VALUES ('perseus', 'name', 'surname', 'perseus@softwarecountry.com',
        '$2b$12$KSyFSYjOloZjDOrYVFg3Z.AdxmYv7gKxJn3AG9UIJ5lDBfmpd5MV2', '1');

INSERT INTO "user"."user" ("username", "first_name", "last_name", "email", "password", "active")
VALUES ('perseus-support', 'name', 'surname', 'perseussupport@softwarecountry.com',
        '$2b$12$0TwBUiuWPiB4/h82GE3BeOwwc/18lZNzXbrgydZqEs9V1r4oCkbKO', '1');

GRANT USAGE ON SCHEMA "user" TO "user";
GRANT ALL PRIVILEGES ON SCHEMA "user" TO "user";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "user" TO "user";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "user" TO "user";


--- CDM Builder
CREATE SCHEMA "builder";
CREATE USER builder WITH PASSWORD 'password';

GRANT USAGE ON SCHEMA builder TO builder;
GRANT ALL PRIVILEGES ON SCHEMA builder TO builder;


--- Perseus
CREATE SCHEMA "perseus";
CREATE USER perseus WITH PASSWORD 'password';

CREATE TABLE "perseus"."etl_mappings"
(
    id                 SERIAL PRIMARY KEY,
    username           VARCHAR(30)  NOT NULL,
    user_schema_name   VARCHAR(255) NOT NULL,
    source_schema_name VARCHAR(255) NOT NULL,
    cdm_version        VARCHAR(10),
    scan_report_name   VARCHAR(255) NOT NULL,
    scan_report_id     BIGINT       NOT NULL
);

-- CREATE TABLE "perseus"."user_defined_lookups"
-- (
--     id             BIGINT PRIMARY KEY,
--     file_id        BIGINT NOT NULL,
--     etl_mapping_id BIGINT NOT NULL REFERENCES "perseus"."etl_mappings"
-- );

GRANT USAGE ON SCHEMA perseus TO perseus;
GRANT ALL PRIVILEGES ON SCHEMA perseus TO perseus;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "perseus" TO "perseus";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "perseus" TO "perseus";