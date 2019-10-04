from xml.etree.ElementTree import Element, SubElement, tostring, ElementTree
from xml.dom import minidom
from cdm_souffleur.utils.constants import GENERATE_CDM_XML_PATH, \
    GENERATE_CDM_XML_ARCHIVE_PATH, GENERATE_CDM_XML_ARCHIVE_FILENAME, \
    GENERATE_CDM_XML_ARCHIVE_FORMAT, GENERATE_CDM_LOOKUP_SQL_PATH
import pandas as pd
import os
from shutil import make_archive,  rmtree


def _convert_underscore_to_camel(word: str):
    """get tag name from target table names"""
    return ''.join(x.capitalize() for x in word.split('_'))


def _prettify(elem):
    """Return a pretty-printed XML string for the Element."""
    raw_string = tostring(elem, 'utf-8')
    reparsed = minidom.parseString(raw_string)
    return reparsed.toprettyxml(indent="  ")


def prepare_sql(mapping_items, source_table):
    """prepare sql from mapping json"""

    def get_sql_data_items(mapping_items_, source_table_):
        """return unique all required fields to prepare sql"""
        all_fields = []
        mapping_items_for_table = mapping_items_[
            mapping_items_.source_table == source_table_]
        required_fields = ['source_field', 'sql_field', 'sql_alias']
        mapping_data = mapping_items_for_table.get('mapping', pd.Series())
        condition_data = mapping_items_for_table.get('condition', pd.Series())
        lookup = mapping_items_for_table.get('lookup', pd.Series())

        lookup_data = lookup.fillna('').map(
            lambda el_list: list(
                map(lambda el: el.get('sql_field', ''), el_list))).map(
            lambda li: [item for sublist in li for item in
                        sublist]) if isinstance(
            lookup, pd.Series) else lookup

        result_data = pd.concat(
            [mapping_data, condition_data, lookup_data]).fillna('')

        for index_, row_ in result_data.iteritems():
            all_fields += [{k: dic[k] for k in required_fields} for dic in
                           row_]
        all_fields_unique = [dict(tuple_map_item) for tuple_map_item in
                             {tuple(map_item.items()) for map_item in
                              all_fields}]
        return pd.DataFrame(all_fields_unique)

    data_ = get_sql_data_items(mapping_items, source_table)
    fields = data_.loc[:, ['source_field',
                           'sql_field',
                           'sql_alias']]
    sql = 'select '
    for index, row in fields.iterrows():
        if not row['sql_field']:
            sql += row['source_field'] + ',\n'
        else:
            sql += row['sql_field'] + ' as ' + row['sql_alias'] + ',\n'
    sql = sql[:-2] + '\n'
    sql += 'from ' + source_table + \
           '  JOIN _CHUNKS CH ON CH.CHUNKID = {0} AND ENROLID = CH.PERSON_ID ' \
           'ORDER BY PERSON_ID'
    return sql


def get_xml(json_):
    """prepare XML for CDM"""
    result = {}
    previous_target_table_name = ''
    mapping_items = pd.DataFrame(json_['mapping_items'])
    source_tables = pd.unique(mapping_items.get('source_table'))

    for source_table in source_tables:
        query_definition_tag = Element('QueryDefinition')
        query_tag = SubElement(query_definition_tag, 'Query')
        sql = prepare_sql(mapping_items, source_table)
        query_tag.text = sql
        target_tables = mapping_items.loc[
            mapping_items['source_table'] == source_table].fillna('')

        for index, record_data in target_tables.iterrows():
            option = record_data.get('option')
            lookup = record_data.get('lookup')
            mapping = record_data.get('mapping')
            condition = record_data.get('condition')
            target_table_name = record_data.get('target_table')
            tag_name = _convert_underscore_to_camel(target_table_name)
            domain_tag = SubElement(query_definition_tag, tag_name) if \
                previous_target_table_name != target_table_name else domain_tag
            domain_definition_tag = SubElement(domain_tag,
                                               tag_name + 'Definition')

            if condition is not None:
                for row in condition:
                    if row:
                        condition_text = row['condition']
                        SubElement(domain_definition_tag,
                                   'Condition').text = condition_text

            if option is not None:
                for row in option:
                    if row:
                        options = row['options']
                        for key, value in options.items():
                            SubElement(domain_definition_tag, key).text = value

            if mapping is not None:
                for row in mapping:
                    source_field = row['source_field']
                    sql_alias = row['sql_alias']
                    target_field = row['target_field']
                    v = SubElement(domain_definition_tag, target_field)
                    v.text = sql_alias if sql_alias else source_field

            if lookup is not None:
                for row in lookup:
                    if row:
                        concepts_tag = SubElement(domain_definition_tag,
                                                  'Concepts')
                        concept_tag = SubElement(concepts_tag, 'Concept')
                        options = row.get('options')
                        if options is not None:
                            for key, value in options.items():
                                SubElement(concept_tag, key).text = value
                        vocabulary = row.get('lookup')
                        if vocabulary:
                            concept_id_mapper = SubElement(concept_tag,
                                                           'ConceptIdMapper')
                            mapper = SubElement(concept_id_mapper, 'Mapper')
                            lookup = SubElement(mapper, 'Lookup')
                            lookup.text = vocabulary
                        fields = row.get('fields')
                        if fields:
                            fields_tag = SubElement(concept_tag, 'Fields')
                            # TODO: field is dict with default value and other optional parameters and add validation
                            # typeId - значение пойдет в ConceptTypeId
                            # conceptId - значение пойдет в ConceptId
                            # eventDate - дата из поля будет влиять на маппинг(у концептов есть валидные даты в словаре)
                            # defaultTypeId - если не смапилось, будет использовано это значение в ConceptTypeId
                            # defaultConceptId - если не смапилось, будет использовано это значение в ConceptId
                            # defaultSource - занечение пойдет в SourceValue
                            # isNullable - запись создасться, даже если в raw был NULL
                            # for field in fields:
                            for field in fields:
                                SubElement(fields_tag, 'Field',
                                           attrib={key: value for
                                                   key, value in
                                                   field.items()})
            previous_target_table_name = target_table_name
        xml = ElementTree(query_definition_tag)
        try:
            os.mkdir(GENERATE_CDM_XML_PATH)
            print(f"Directory {GENERATE_CDM_XML_PATH} created")
        except FileExistsError:
            print(f"Directory {GENERATE_CDM_XML_PATH} already exist")
        xml.write(GENERATE_CDM_XML_PATH / (source_table + '.xml'))
        # result += '{}: \n {} + \n'.format(source_table, prettify(
        #     query_definition_tag))
        result.update({source_table: _prettify(query_definition_tag)})
    return result


def get_lookups_sql(cond: dict):
    result = {}
    try:
        os.mkdir(GENERATE_CDM_LOOKUP_SQL_PATH)
        print(f"Directory {GENERATE_CDM_LOOKUP_SQL_PATH} created")
    except FileExistsError:
        print(f"Directory {GENERATE_CDM_LOOKUP_SQL_PATH} already exist")
    for lookup_record in cond:
        for k, v in lookup_record.items():
            source_vocabulary_in = ', '.join(v.get('source_vocabulary').get('in'))
            source_vocabulary_not_in = ', '.join(v.get('source_vocabulary').get('not_in'))
            target_vocabulary_in = ', '.join(v.get('target_vocabulary').get('in'))
            target_vocabulary_not_in = ', '.join(v.get('target_vocabulary').get('not_in'))
            target_concept_class_in = ', '.join(v.get('target_concept_class').get('in'))
            target_concept_class_not_in = ', '.join(v.get('target_concept_class').get('not_in'))
            target_domain_in = ', '.join(v.get('target_domain').get('in'))
            target_domain_not_in = ', '.join(v.get('target_domain').get('not_in'))
            sql = f"""
                  Standard as (
                  SELECT distinct SOURCE_CODE
                       , TARGET_CONCEPT_ID
                       , TARGET_DOMAIN_ID
                       , SOURCE_VALID_START_DATE as VALID_START_DATE
                       , SOURCE_VALID_END_DATE as VALID_END_DATE
                       , SOURCE_VOCABULARY_ID
                  FROM Source_to_Standard
                  WHERE
                  SOURCE_VOCABULARY_ID IN {source_vocabulary_in} 
                  AND SOURCE_VOCABULARY_ID NOT IN {source_vocabulary_not_in}
                  AND  TARGET_VOCABULARY_ID IN {target_vocabulary_in} 
                  AND TARGET_VOCABULARY_ID NOT IN {target_vocabulary_not_in}
                  AND TARGET_CONCEPT_CLASS_ID IN {target_concept_class_in} 
                  AND TARGET_CONCEPT_CLASS_ID NOT IN {target_concept_class_not_in}
                  AND TARGET_DOMAIN_ID) IN {target_domain_in} 
                  AND TARGET_DOMAIN_ID NOT IN {target_domain_not_in}
                  AND (TARGET_STANDARD_CONCEPT IS NOT NULL or TARGET_STANDARD_CONCEPT != '')
                  AND (TARGET_INVALID_REASON IS NULL or TARGET_INVALID_REASON = '')), 
                  Source as (
                  SELECT distinct SOURCE_CODE
                       , TARGET_CONCEPT_ID
                       , SOURCE_VALID_START_DATE
                       , SOURCE_VALID_END_DATE
                  FROM Source_to_Source
                  WHERE
                  SOURCE_VOCABULARY_ID IN {source_vocabulary_in} 
                  AND SOURCE_VOCABULARY_ID NOT IN {source_vocabulary_not_in}
                  AND TARGET_VOCABULARY_ID IN {target_vocabulary_in} 
                  AND TARGET_VOCABULARY_ID NOT IN {target_vocabulary_not_in}
                  AND TARGET_CONCEPT_CLASS_ID IN {target_concept_class_in} 
                  AND TARGET_CONCEPT_CLASS_ID NOT IN {target_concept_class_not_in}
                  AND TARGET_DOMAIN_ID) IN {target_domain_in} 
                  AND TARGET_DOMAIN_ID NOT IN {target_domain_not_in}),
                  S_S as (
                  select SOURCE_CODE from Standard
                  union
                  select SOURCE_CODE from Source)
 
                 select distinct S_S.SOURCE_CODE
                      , Standard.TARGET_CONCEPT_ID
                      , Standard.TARGET_DOMAIN_ID
                      , Standard.VALID_START_DATE
                      , Standard.VALID_END_DATE
                      , Standard.SOURCE_VOCABULARY_ID
                      , Source.TARGET_CONCEPT_ID as SOURCE_TARGET_CONCEPT_ID
                      , Source.SOURCE_VALID_START_DATE as SOURCE_VALID_START_DATE
                      , Source.SOURCE_VALID_END_DATE
                      , ingredient_level.ingredient_concept_id
                 from S_S
                 left join Standard on Standard.SOURCE_CODE = S_S.SOURCE_CODE
                 left join Source on Source.SOURCE_CODE = S_S.SOURCE_CODE
                 left join ingredient_level on ingredient_level.concept_id = Standard.TARGET_CONCEPT_ID"""
            sql_file = open(GENERATE_CDM_LOOKUP_SQL_PATH / (k + '.sql'), 'w+')
            sql_file.write(sql)
            print(k)
            print(sql)
            result.update({k: sql})
    return result


def zip_xml():
    try:
        make_archive(
            GENERATE_CDM_XML_ARCHIVE_PATH / GENERATE_CDM_XML_ARCHIVE_FILENAME,
            GENERATE_CDM_XML_ARCHIVE_FORMAT, GENERATE_CDM_XML_PATH)
    except FileNotFoundError:
        raise


def delete_generated_xml():
    try:
        rmtree(GENERATE_CDM_XML_PATH)
    except FileNotFoundError:
        raise


if __name__ == '__main__':
    # pass
    # with open('sources/mock_input/ENROLLMENT_DETAIL.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
    # with open('sources/mock_input/OUTPATIENT_SERVICES.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
    # with open('sources/mock_input/DRUG_CLAIMS.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
    # with open('sources/mock_input/FACILITY_HEADER.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
    # with open('sources/mock_input/INPATIENT_ADMISSIONS.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
    # with open('sources/mock_input/INPATIENT_SERVICES.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
    # with open('sources/mock_input/LAB.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
    # with open('sources/mock_input/LONG_TERM_CARE.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
    # SQL for near written manually in output cause of specific
    # with open('sources/mock_input/HEALTH_RISK_ASSESSMENT.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
    # with open('sources/mock_input/L_LOCATION.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
    # with open('sources/mock_input/L_PROVIDER.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
    # with open('sources/mock_input/mock.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
    from ast import literal_eval
    condition = literal_eval("""[{"lookup" : 
{
  "source_vocabulary": {
    "in": ["s_voc1", "s_voc2"],
    "not_in": ["s_voc3", "s_voc4"]
  }
  ,
  "target_vocabulary": {
    "in": ["t_voc1", "t_voc2"],
    "not_in": ["t_voc3", "t_voc4"]
  },
  "source_concept_class": {
    "in": ["s_concept1", "s_concept2"],
    "not_in": ["s_concept3", "s_concept4"]
  },
  "target_concept_class": {
    "in": ["t_concept1", "t_concept2"],
    "not_in": ["t_concept3", "t_concept4"]
  },
  "target_domain": {
    "in": ["t_domain1", "t_domain2"],
    "not_in": ["t_domain3", "t_domain4"]
  }
}
},
{"lookup2" : 
{
  "source_vocabulary": {
    "in": ["s_voc1", "s_voc2"],
    "not_in": ["s_voc3", "s_voc4"]
  },
  "target_vocabulary": {
    "in": ["t_voc1", "t_voc2"],
    "not_in": ["t_voc3", "t_voc4"]
  },
  "source_concept_class": {
    "in": ["s_concept1", "s_concept2"],
    "not_in": ["s_concept3", "s_concept4"]
  },
  "target_concept_class": {
    "in": ["t_concept1", "t_concept2"],
    "not_in": ["t_concept3", "t_concept4"]
  },
  "target_domain": {
    "in": ["t_domain1", "t_domain2"],
    "not_in": ["t_domain3", "t_domain4"]
  }
}
}]""")
    print(condition)
    get_lookups_sql(condition)

