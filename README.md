Introduction
========
Perseus combines intuitive and easy to use Web-based UI for ETL configuration and service for
conversion native data to the CDM.

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

Screenshot
===========
<img src="https://github.com/SoftwareCountry/CDMSouffleur/blob/master/images/start.PNG" alt="Start page" title="Start page" />
<img src="https://github.com/SoftwareCountry/CDMSouffleur/blob/master/images/link_tables.PNG" alt="Link tables" title="Link tables" />
<img src="https://github.com/SoftwareCountry/CDMSouffleur/blob/master/images/link_fields.PNG" alt="Link fields" title="Link fields" />
<img src="https://github.com/SoftwareCountry/CDMSouffleur/blob/master/images/concept.PNG" alt="Concept configuration" title="Concept configuration" />
<img src="https://github.com/SoftwareCountry/CDMSouffleur/blob/master/images/lookup.PNG" alt="Lookup configuration" title="Lookup configuration" />

Technology
============
- Angular 9
- Python 3.6
- Java 15
- R 4.0.4
- PostgreSQL 13.2
- .NET Core 3.1

Getting Started
===============
TODO

License
=======
Perseus is licensed under Apache License 2.0
