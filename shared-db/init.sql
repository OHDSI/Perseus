--- Files Manager
CREATE SCHEMA "files_manager";
CREATE USER files_manager WITH ENCRYPTED PASSWORD 'password';

GRANT USAGE ON SCHEMA files_manager TO files_manager;
GRANT ALL PRIVILEGES ON SCHEMA files_manager TO files_manager;


--- White Rabbit
CREATE SCHEMA "white_rabbit";
CREATE USER white_rabbit WITH ENCRYPTED PASSWORD 'password';

GRANT USAGE ON SCHEMA white_rabbit TO white_rabbit;
GRANT ALL PRIVILEGES ON SCHEMA white_rabbit TO white_rabbit;


--- Data Quality Dashboard
CREATE SCHEMA "dqd";
CREATE USER dqd WITH ENCRYPTED PASSWORD 'password';

GRANT USAGE ON SCHEMA dqd TO dqd;
GRANT ALL PRIVILEGES ON SCHEMA dqd TO dqd;


--- User
CREATE SCHEMA "user";
CREATE USER "user" WITH ENCRYPTED PASSWORD 'password';

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
CREATE USER builder WITH ENCRYPTED PASSWORD 'password';

GRANT USAGE ON SCHEMA builder TO builder;
GRANT ALL PRIVILEGES ON SCHEMA builder TO builder;


--- Perseus
CREATE SCHEMA "perseus";
CREATE USER perseus WITH ENCRYPTED PASSWORD 'password';

GRANT USAGE ON SCHEMA perseus TO perseus;
GRANT ALL PRIVILEGES ON SCHEMA perseus TO perseus;


--- Usagi
CREATE SCHEMA "usagi";
CREATE SCHEMA "usagi2";
CREATE USER usagi WITH PASSWORD 'password';

GRANT USAGE ON SCHEMA usagi TO usagi;
GRANT USAGE ON SCHEMA usagi2 TO usagi;
GRANT ALL PRIVILEGES ON SCHEMA usagi TO usagi;
GRANT ALL PRIVILEGES ON SCHEMA usagi2 TO usagi;


--- Source Database
CREATE DATABASE source;
CREATE USER source WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE source TO source;