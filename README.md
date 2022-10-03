Introduction
========
Perseus combines intuitive and easy to use Web-based UI for design and  implement ETL (extract, transform, and load) configuration and service for conversion the native/raw data to the OMOP Common Data Model (CDM).

Additionally, Perseus has embedded tools for search in the standardized vocabularies, generates documentation for the ETL process, create the code mappings and data quality check.

[**Wiki**](https://github.com/SoftwareCountry/Perseus/wiki)

[**Getting started**](#getting-started)

#### Contact Us: perseus.support@softwarecountry.com

Features
========
- Map source data to tables and columns to CDM
- Combine source tables
- Use pre-built sql functions (replace, concat…)
- Use pre-built source to source and source to standard vocabulary lookups (icd9, icd10, ndc…)
- Create custom lookups for the concept_id fields
- Set constant values to the CDM fields
- Use System/Auto generated values for the CDM fields
- Auto mapping for similar fields
- OMOP Vocabulary search
- Data Quality check
- Search mapping between new codes and OMOP standard concepts
- Convert data from native format to CDM
- Logic for creating eras (DRUG_ERAs, CONDITION_ERAs…)
- Logic for grouping visit occurrence/observation_period records
- Auto domain switching 
- Create ETL specification

Screenshots
===========
<img src="https://github.com/SoftwareCountry/CDMSouffleur/blob/master/images/start1.PNG" alt="Start page" title="Start page" />
<img src="https://github.com/SoftwareCountry/CDMSouffleur/blob/master/images/link_tables2.PNG" alt="Link tables" title="Link tables" />
<img src="https://github.com/SoftwareCountry/CDMSouffleur/blob/master/images/link_fields.PNG" alt="Link fields" title="Link fields" />
<img src="https://github.com/SoftwareCountry/CDMSouffleur/blob/master/images/concept1.PNG" alt="Concept configuration" title="Concept configuration" />
<img src="https://github.com/SoftwareCountry/CDMSouffleur/blob/master/images/lookup1.PNG" alt="Lookup configuration" title="Lookup configuration" />
<img src="https://github.com/SoftwareCountry/CDMSouffleur/blob/master/images/usagi.PNG" alt="Code mappings - Import" title="Code mappings - Import" />
<img src="https://github.com/SoftwareCountry/CDMSouffleur/blob/master/images/usagi1.PNG" alt="Code mappings" title="Code mappings" />

Technology
============
- Angular 12
- Python 3.7
- Java 17
- R 4.1.3
- PostgreSQL 13.2
- .NET Core 3.1

Deployment server requirements
===============

 - Unix / Windows OS, Docker,
 - 4GB RAM, 
 - ~10 GB HDD (Depend on [Vocabulary](#vocabulary) size),
 - Open ports: 443, 80.

Getting Started
===============

## Vocabulary

Get the link to the vocabulary from [Athena](http://athena.ohdsi.org).

    cd vocabulary-db

Install vocabulary archive and extract to `vocabulary` directory. Full path `vocabulary-db/vocabulary`.

Database deployment can take a long time if the dictionary size is large enough.

To [Docker Compose](#starting-with-docker-compose).

## SMTP server
**Multi-user**

**(Optional)**

    cd user

* To get user registration links by e-mail you should configure SMTP server settings first. Edit file named `user-envs.txt` in the `user` directory with the following content **(without spaces)**:

SMTP_SERVER=`<your SMTP server host address>`\
SMTP_PORT=`<your SMTP port>`\
SMTP_EMAIL=`<email from which registration links will be sent to users>`\
SMTP_USER=`<SMTP login>`\
SMTP_PWD=`<SMPT password>`\
TOKEN_SECRET_KEY=`<token encoding key>`

to [Docker Compose](#starting-with-docker-compose)

## Test user
**Single-user**

If you want to **skip multi-user mode** use user with these credential:

Email: 

    perseus@softwarecountry.com

Password: 

    perseus

## Starting with Docker Compose

To start all containers at once using docker-compose please
- make sure docker-compose is installed
- set vocabulary link, see [Vocabulary](#vocabulary) section
- configure SMTP server as it described in [SMTP](#smtp-server) section **(Optional)**

    
    docker compose up -d

Open `localhost:80` in your browser, preferably Google Chrome

## Starting each container separately

[CONTAINERS](CONTAINERS.md)

Perseus uses auxiliary services to scan, convert and validate data.

Below are links to these services, which should be included in the app build. 

### White-rabbit service

https://github.com/SoftwareCountry/WhiteRabbit

### Cdm-builder service

https://github.com/SoftwareCountry/ETL-CDMBuilder

### Data-quality-check service

https://github.com/SoftwareCountry/DataQualityDashboard

### Finally

Open `localhost:80` in your browser, preferably Google Chrome.

## Getting Involved

* User guide and Help: [Perseus documentation](https://github.com/SoftwareCountry/Perseus/wiki)
* We use the [GitHub issue tracker](https://github.com/SoftwareCountry/Perseus/issues) 

License
=======
Perseus is licensed under Apache License 2.0
