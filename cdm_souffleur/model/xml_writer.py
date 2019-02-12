from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom
import json
import pandas as pd


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
    fields = data.loc[data['source_table'] == source_table, ['source_field',
                                                             'sql_field',
                                                             'sql_alias']]
    sql = 'select '
    for index, row in fields.iterrows():
        if row['sql_field'] == '':
            sql += row['source_field'] + ',\n'
        else:
            sql += row['sql_field'] + ' as ' + row['sql_alias'] + ',\n'
    sql = sql[:-2] + '\n'
    sql += 'from ' + source_table + '\r\n' + \
           'join _chunks ch on ch.ChunkId = {0} and ENROLID = ch.PERSON_ID' + \
           '\r\norder by ENROLID'
    return sql


def get_xml(json):
    """
    prepare XML for CDM
    """
    result = ''
    # mapping_data = get_mapping(path)
    # lookup_data = get_lookup(path)
    # source_tables = get_source_tables(mapping_data)
    mapping_data = pd.DataFrame(json['mapping'])
    lookup_data = pd.DataFrame(json['lookup'])
    source_tables = pd.unique(mapping_data['source_table'])

    for source_table in source_tables:
        query_definition_tag = Element('QueryDefinition',
                                       attrib={'text': 'test'})
        query_tag = SubElement(query_definition_tag, 'Query')
        sql = prepare_sql(mapping_data, source_table)
        query_tag.text = sql
        target_tables = pd.unique(mapping_data.loc[mapping_data['source_table']
                                                   == source_table,
                                                   ['target_table']]
                                  ['target_table'].tolist())

        for target_table in target_tables:
            lookups = lookup_data.loc[(lookup_data['source_table']
                                       == source_table) &
                                      (lookup_data['target_table']
                                       == target_table), ['fields',
                                                          'lookup']]
            fields = mapping_data.loc[
                (mapping_data['source_table'] == source_table) &
                (mapping_data['target_table'] == target_table),
                ['source_field', 'target_field', 'sql_alias']]
            tag_name = convert_underscore_to_camel(target_table)
            domain_tag = SubElement(query_definition_tag, tag_name)
            domain_definition_tag = SubElement(domain_tag,
                                               tag_name + 'Definition')

            for index, row in fields.iterrows():
                source_field = row['source_field']
                sql_alias = row['sql_alias']
                target_field = row['target_field']
                v = SubElement(domain_definition_tag, target_field)
                v.text = sql_alias if sql_alias else source_field

            for index, row in lookups.iterrows():
                concepts_tag = SubElement(domain_definition_tag, 'Concepts')
                concept_tag = SubElement(concepts_tag, 'Concept')
                vocabulary = row['lookup']
                # print(vocabulary)
                # print(type(row))
                # print(vocabulary is None)
                if vocabulary:
                    concept_id_mapper = SubElement(concept_tag, 'ConceptIdMapper')
                    mapper = SubElement(concept_id_mapper, 'Mapper')
                    lookup = SubElement(mapper, 'Lookup')
                    lookup.text = vocabulary
                fields = row['fields']
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
                    for field in fields:
                        field_tag = SubElement(fields_tag, 'Field',
                                               attrib={key: value for
                                                       key, value in
                                                       field.items()})
        # xml = ElementTree(query_definition_tag)
        # xml.write(source_table)
        result += '{} table xml \r\n {} + \r\n'.format(source_table, prettify(
            query_definition_tag))
    return result


if __name__ == '__main__':
    with open('sources/ENROLLMENT_DETAIL.json') as file:
        data = json.load(file)
        print(get_xml(data))
