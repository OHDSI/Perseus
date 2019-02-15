from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom
import json
import pandas as pd
import numpy as np


def get_mapping(path):
    """
    read mapping
    """
    with open(path) as file:
        data = json.load(file)
        return pd.DataFrame(data['mapping'])


def get_lookup(path):
    """
    read lookup
    """
    with open(path) as file:
        data = json.load(file)
        return pd.DataFrame(data['lookup'])


def get_source_tables(data):
    """
    return distinct source tables
    :param data: loaded mapping json
    """
    return pd.unique(data['source_table'])


def convert_underscore_to_camel(word: str):
    """
    get tag name from target table names
    """
    return ''.join(x.capitalize() for x in word.split('_'))


def prettify(elem):
    """
    Return a pretty-printed XML string for the Element.
    """
    raw_string = tostring(elem, 'utf-8')
    reparsed = minidom.parseString(raw_string)
    return reparsed.toprettyxml(indent="  ")


def prepare_sql(data, source_table):
    """
    prepare sql from mapping json
    """
    fields = data.loc[:, ['source_field',
                          'sql_field',
                          'sql_alias']]
    sql = 'select '
    for index, row in fields.iterrows():
        if not row['sql_field']:
            sql += row['source_field'] + ',\n'
        else:
            sql += row['sql_field'] + ' as ' + row['sql_alias'] + ',\n'
    sql = sql[:-2] + '\n'
    sql += 'from ' + source_table + '\r\n' + \
           'join _chunks ch on ch.ChunkId = {0} and ENROLID = ch.PERSON_ID' + \
           '\r\norder by ENROLID'
    return sql


def get_sql_data(mapping_items):
    """
    return unique all required fields to prepare sql
    """
    all_fields = []
    required_fields = ['source_field', 'sql_field', 'sql_alias']
    mapping_data = mapping_items.get('mapping', [])
    condition_data = mapping_items.get('condition', [])

    result_data = (mapping_data + condition_data).fillna('')
    print(result_data)

    for index, row in result_data.iteritems():
        all_fields += [{k: dic[k] for k in required_fields} for dic in row]
    all_fields_unique = [dict(tuple_map_item) for tuple_map_item in
                         {tuple(map_item.items()) for map_item in all_fields}]
    return pd.DataFrame(all_fields_unique)


def get_xml(json):
    """
    prepare XML for CDM
    """
    result = ''
    previous_target_table_name = ''
    # mapping_data = get_mapping(path)
    # lookup_data = get_lookup(path)
    # source_tables = get_source_tables(mapping_data)
    mapping_items = pd.DataFrame(json['mapping_items'])
    source_tables = pd.unique(mapping_items['source_table'])
    mapping_data = get_sql_data(mapping_items)

    for source_table in source_tables:
        query_definition_tag = Element('QueryDefinition')
        query_tag = SubElement(query_definition_tag, 'Query')
        sql = prepare_sql(mapping_data, source_table)
        query_tag.text = sql
        target_tables = mapping_items.loc[
            mapping_items['source_table'] == source_table].fillna('')

        for index, record_data in target_tables.iterrows():
            option = record_data.get('option')
            lookup = record_data.get('lookup')
            mapping = record_data.get('mapping')
            condition = record_data.get('condition')
            target_table_name = record_data.get('target_table')
            tag_name = convert_underscore_to_camel(target_table_name)
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
        # xml = ElementTree(query_definition_tag)
        # xml.write(source_table)
        result += '{} table xml \r\n {} + \r\n'.format(source_table, prettify(
            query_definition_tag))
    return result


if __name__ == '__main__':
    with open('sources/ENROLLMENT_DETAIL.json') as file:
        data = json.load(file)
        print(get_xml(data))
    # with open('sources/OUTPATIENT_SERVICES.json') as file:
    #     data = json.load(file)
    #     print(get_xml(data))
