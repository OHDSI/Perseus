import re
from xml.etree.ElementTree import Element, SubElement, tostring, ElementTree
from xml.dom import minidom
from cdm_souffleur.utils.constants import \
    GENERATE_CDM_XML_PATH, \
    GENERATE_CDM_XML_ARCHIVE_PATH, \
    GENERATE_CDM_XML_ARCHIVE_FILENAME, \
    GENERATE_CDM_XML_ARCHIVE_FORMAT, \
    GENERATE_CDM_LOOKUP_SQL_PATH, \
    PREDEFINED_LOOKUPS_PATH, \
    INCOME_LOOKUPS_PATH, \
    GENERATE_BATCH_SQL_PATH, \
    ROOT_DIR
import pandas as pd
from shutil import rmtree
import zipfile
import os
from pathlib import Path
from cdm_souffleur.model.similar_names_map import similar_names_map
from itertools import groupby


def _convert_underscore_to_camel(word: str):
    """get tag name from target table names"""
    return ''.join(x.capitalize() for x in word.split('_'))


def _replace_with_similar_name(name: str):
    new_name = similar_names_map.get(name)
    return new_name if new_name else name


def _prettify(elem):
    """Return a pretty-printed XML string for the Element."""
    raw_string = tostring(elem, 'utf-8')
    reparsed = minidom.parseString(raw_string)
    return reparsed.toprettyxml(indent="  ")


def add_concept_id_data(field, alias, sql, counter):
    match_str = f' as {alias},'
    value = f'{field}{match_str}'
    if match_str in sql:
        if counter == 1:
            sql = sql.replace(match_str, match_str.replace(alias, f'{alias}_{counter}'))
        counter += 1
        sql += f"{field} as {alias}_{counter},"
    else:
        if counter == 1:
            sql += value
        else:
            counter += 1
            sql += value.replace(',', f'_{counter},')
    return sql, counter


def check_lookup_tables(tables):
    for table in tables:
        if table.lower() in ('location', 'care_site', 'provider'):
            return True
    return False


def prepare_sql(mapping_items, source_table, views, tagret_tables):
    """prepare sql from mapping json"""

    def get_sql_data_items(mapping_items_, source_table_):
        """return unique all required fields to prepare sql"""
        all_fields = []
        mapping_items_for_table = mapping_items_[mapping_items_.source_table == source_table_]
        required_fields = ['source_field', 'sql_field', 'sql_alias', 'targetCloneName']
        mapping_data = mapping_items_for_table.get('mapping', pd.Series())
        condition_data = mapping_items_for_table.get('condition', pd.Series())
        lookup = mapping_items_for_table.get('lookup', pd.Series())

        if isinstance(lookup, pd.Series):
            lookup = lookup.fillna('')
            lookup_data = lookup.map(
                lambda el_list: list(map(lambda el: el.get('sql_field', ''), el_list))
            ).map(
                lambda li: [item for sublist in li for item in sublist]
            )
        else:
            lookup_data = lookup

        result_data = pd.concat([mapping_data, condition_data, lookup_data]).fillna('')

        for index_, row_ in result_data.iteritems():
            all_fields += [{k: dic[k] for k in required_fields} for dic in row_]

        all_fields_unique = [
            dict(tuple_map_item) for tuple_map_item in {tuple(map_item.items()) for map_item in all_fields}
        ]
        return pd.DataFrame(all_fields_unique)

    data_ = get_sql_data_items(mapping_items, source_table)
    fields = data_.loc[:, ['source_field', 'sql_field', 'sql_alias', 'targetCloneName']].sort_values(by=['targetCloneName','source_field','sql_alias'])
    sql = 'SELECT '
    concept_id_counter = 1
    source_value_counter = 1
    type_concept_id_counter = 1
    source_concept_id_counter = 1
    mapped_to_person_id_field = ''
    target_clone_name = ""
    for index, row in fields.iterrows():
        source_field = row['sql_field']
        target_field = row['sql_alias']
        if target_clone_name != row['targetCloneName']:
            target_clone_name = row['targetCloneName']
            concept_id_counter = 1
            source_value_counter = 1
            type_concept_id_counter = 1
            source_concept_id_counter = 1
        if not row['targetCloneName']:
            clone = ""
        else:
            clone = f"{row['targetCloneName']}_"
        if target_field == 'person_id':
            mapped_to_person_id_field = source_field
        if not source_field:
            sql += f"{row['source_field']},\n"
        else:
            if is_concept_id(target_field):
                sql, concept_id_counter = add_concept_id_data(source_field, f"{clone}{target_field}", sql, concept_id_counter)
            elif is_source_value(target_field):
                sql, source_value_counter = add_concept_id_data(source_field, f"{clone}{target_field}", sql, source_value_counter)
            elif is_type_concept_id(target_field):
                sql, type_concept_id_counter = add_concept_id_data(
                    source_field,
                    f"{clone}{target_field}",
                    sql,
                    type_concept_id_counter
                )
            elif is_source_concept_id(target_field):
                sql, source_concept_id_counter = add_concept_id_data(
                    source_field,
                    f"{clone}{target_field}",
                    sql,
                    source_concept_id_counter
                )
            else:
                sql += f"{source_field} as {clone}{target_field},"
            sql += '\n'
    sql = f'{sql[:-2]}\n'
    view = None
    if views:
        view = views.get(source_table, None)

    if view:
        view = view.replace('from ', 'from {sc}.').replace('join ', 'join {sc}.')
        sql  = f'WITH {source_table} AS (\n{view})\n{sql}FROM {source_table}'
    else:
        sql += 'FROM {sc}.' + source_table
    if not check_lookup_tables(tagret_tables):
        sql += ' JOIN {sc}._CHUNKS CH ON CH.CHUNKID = {0} AND ENROLID = CH.PERSON_ID ORDER BY PERSON_ID'
        if mapped_to_person_id_field:
            sql = sql.replace('ENROLID = CH.PERSON_ID', f'{mapped_to_person_id_field} = CH.PERSON_ID')
    return sql


def has_pair(field_name, mapping):
    for item in mapping:
        if item['target_field'] == field_name:
            return True
    return False


def get_lookup_data(filepath):
    with open(filepath, mode='r') as f:
        return f.read()


def add_lookup_data(folder, basepath, lookup, template):
    lookup_body_filepath = os.path.join(PREDEFINED_LOOKUPS_PATH, f'template_{folder}.txt')
    lookup_body_data = get_lookup_data(lookup_body_filepath).split('\n\n')[1]

    lookup_filepath = os.path.join(basepath, folder, f'{lookup}.txt')
    lookup_data = get_lookup_data(lookup_filepath)

    replace_key = '{_}'.replace('_', folder)
    return template.replace(replace_key, f'{lookup_body_data}{lookup_data}')


def create_lookup(lookup, target_field, mapping):
    if os.path.isdir(GENERATE_CDM_LOOKUP_SQL_PATH):
        rmtree(GENERATE_CDM_LOOKUP_SQL_PATH)

    try:
        os.makedirs(GENERATE_CDM_LOOKUP_SQL_PATH)
        print(f'Directory {GENERATE_CDM_LOOKUP_SQL_PATH} created')
    except FileExistsError:
        print(f'Directory {GENERATE_CDM_LOOKUP_SQL_PATH} already exist')

    if target_field.endswith('source_concept_id'):
        return
    else:
        pair_target_field = target_field.replace('concept_id', 'source_concept_id')

    if lookup.endswith('userDefined'):
        basepath = INCOME_LOOKUPS_PATH
    else:
        basepath = PREDEFINED_LOOKUPS_PATH

    if has_pair(pair_target_field, mapping):
        template_filepath = os.path.join(PREDEFINED_LOOKUPS_PATH, 'template_result.txt')
        template_data = get_lookup_data(template_filepath)

        results_data = add_lookup_data('source_to_standard', basepath, lookup, template_data)
        results_data = add_lookup_data('source_to_source', basepath, lookup, results_data)
    else:
        template_filepath = os.path.join(PREDEFINED_LOOKUPS_PATH, f'template_result_only_source_to_standard.txt')
        template_data = get_lookup_data(template_filepath)

        results_data = add_lookup_data('source_to_standard', basepath, lookup, template_data)

    result_filepath = os.path.join(GENERATE_CDM_LOOKUP_SQL_PATH, f'{lookup.split(".")[0]}.sql')
    with open(result_filepath, mode='w') as f:
        f.write(results_data)


def is_concept_id(field: str):
    field = field.lower()
    return field.endswith('concept_id') and not (is_source_concept_id(field) or is_type_concept_id(field))


def is_source_value(field: str):
    field = field.lower()
    return field.endswith('source_value')


def is_type_concept_id(field: str):
    field = field.lower()
    return field.endswith('type_concept_id')


def is_source_concept_id(field: str):
    field = field.lower()
    return field.endswith('source_concept_id')


def prepare_concepts_tag(concept_tags, concepts_tag, domain_definition_tag, concept_tag_key, target_field):
    if concepts_tag is None:
        concepts_tag = SubElement(domain_definition_tag, 'Concepts')

    if concept_tags.get(concept_tag_key, None) is None:
        concept_tag = SubElement(
            concepts_tag,
            'Concept',
            attrib={'name': _convert_underscore_to_camel(target_field)}
        )
        concept_tags[concept_tag_key] = concept_tag

    return concepts_tag


def is_mapping_contains_type_concept_id(field, mapping):
    return is_mapping_contains(field, 'type_concept_id', mapping)


def is_mapping_contains_source_value(field, mapping):
    return is_mapping_contains(field, 'source_value', mapping)


def number_of_type_concept_id(field, mapping):
    return number_of_fields_contained(field, 'type_concept_id', mapping)


def number_of_source_value(field, mapping):
    return number_of_fields_contained(field, 'source_value', mapping)


def is_mapping_contains(field, key, mapping):
    for row in mapping:
        target_field = row['target_field']
        if target_field.startswith('value_as'):
            continue
        if target_field == field.replace('concept_id', key):
            return target_field
    return None


def number_of_fields_contained(field, key, mapping):
    fields_counter = 0
    for row in mapping:
        target_field = row['target_field']
        if target_field.startswith('value_as'):
            continue
        if target_field == field.replace('concept_id', key):
            fields_counter += 1
    return fields_counter


def is_mapping_contains_concept_id(field, replace_key, key, mapping):
    for row in mapping:
        target_field = row['target_field']
        if target_field.startswith('value_as'):
            continue
        if target_field == field.replace(replace_key, key):
            return target_field
    return None


def get_mapping_source_values(mapping):
    source_values = []
    for row in mapping:
        target_field = row['target_field']
        if target_field.startswith('value_as'):
            continue

        if target_field.endswith('source_value'):
            if target_field in source_values:
                continue
            source_values.append(target_field)
    return source_values


def find_all_concept_id_fields(mapping):
    concept_ids_fields = []

    for row in mapping:
        target_field = row['target_field']
        if target_field.startswith('value_as'):
            continue
        if is_concept_id(target_field):
            if target_field in concept_ids_fields:
                continue
            concept_ids_fields.append(target_field)
    return concept_ids_fields


def generate_bath_sql_file(mapping, source_table, views):
    view = ''
    sql = 'SELECT DISTINCT {person_id} AS person_id, {person_source} AS person_source FROM '
    if views:
        view = views.get(source_table, None)

    if view:
        view = view.replace('from ', 'from {sc}.').replace('join ', 'join {sc}.')
        sql = f'WITH {source_table} AS (\n{view})\n{sql}'
        sql += '{table} ORDER BY 1'
    else:
        sql += '{sc}.{table} ORDER BY 1'
    sql = sql.replace('{table}', source_table)
    for row in mapping:
        source_field = row['source_field']
        target_field = row['target_field']
        if target_field == 'person_id':
            sql = sql.replace('{person_id}', source_field)
        if target_field == 'person_source_value':
            sql = sql.replace('{person_source}', source_field)
    with open(GENERATE_BATCH_SQL_PATH, mode='w') as f:
        f.write(sql)


def clear():
    delete_generated_xml()
    delete_generated_sql()

    file_path = os.path.join(ROOT_DIR, GENERATE_BATCH_SQL_PATH)
    try:
        os.unlink(file_path)
    except Exception as err:
        print(f'Failed to delete {file_path}. Reason: {err}')


def get_xml(json_):
    """prepare XML for CDM"""
    clear()
    result = {}
    previous_target_table = ''
    domain_tag = ''
    mapping_items = pd.DataFrame(json_['mapping_items'])
    source_tables = pd.unique(mapping_items.get('source_table'))
    views = json_.get('views', None)

    for source_table in source_tables:
        query_definition_tag = Element('QueryDefinition')
        query_tag = SubElement(query_definition_tag, 'Query')
        target_tables = mapping_items.loc[mapping_items['source_table'] == source_table].fillna('')
        sql = prepare_sql(mapping_items, source_table, views, pd.unique(target_tables.get('target_table')))
        query_tag.text = sql

        skip_write_file = False

        for index, record_data in target_tables.iterrows():
            mapping = record_data.get('mapping')
            target_table = record_data.get('target_table')

            tag_name = _convert_underscore_to_camel(target_table)

            if mapping is None:
                continue

            if previous_target_table != target_table:
                domain_tag = SubElement(query_definition_tag, tag_name)

            clone_key = lambda a: a.get('targetCloneName')
            clone_groups = groupby(sorted(mapping, key=clone_key), key=clone_key)

            for key, group in clone_groups:
                if key != "":
                    clone_key = f"{key}_"
                else:
                    clone_key = ""
                groupList = list(group)
                domain_definition_tag = SubElement(domain_tag, f'{tag_name}Definition')
                condition_text = groupList[0].get('condition')
                if condition_text:
                    condition_tag = SubElement(domain_definition_tag, 'Condition')
                    condition_tag.text = condition_text
                fields_tags = {}
                counter = 1

                concepts_tag = None
                concept_tags = {}
                definitions = []

                mapping_source_values = get_mapping_source_values(groupList)
                lookups = []
                for row in groupList:
                    lookup_name = row.get('lookup', None)
                    sql_transformation = row.get('sqlTransformation', None)
                    target_field = row.get('target_field', None)
                    concept_tag_key = target_field.replace('_concept_id', '') if is_concept_id(target_field) else target_field

                    if lookup_name:
                        attrib_key = 'key'
                        if lookup_name not in lookups:
                            create_lookup(lookup_name, target_field, groupList)

                            concepts_tag = prepare_concepts_tag(
                                concept_tags,
                                concepts_tag,
                                domain_definition_tag,
                                concept_tag_key,
                                target_field
                            )

                            concept_id_mapper = SubElement(concept_tags[concept_tag_key], 'ConceptIdMapper')

                            mapper = SubElement(concept_id_mapper, 'Mapper')
                            lookup = SubElement(mapper, 'Lookup')
                            lookup.text = lookup_name.split(".")[0]

                            lookups.append(lookup_name)
                    else:
                        attrib_key = 'conceptId'

                    source_field = row['source_field']
                    sql_alias = row['sql_alias']
                    target_field = row['target_field']

                    if is_concept_id(target_field):
                        concepts_tag = prepare_concepts_tag(
                            concept_tags,
                            concepts_tag,
                            domain_definition_tag,
                            concept_tag_key,
                            target_field
                        )

                        fields_tag = None
                        if fields_tags.get(concept_tag_key, None) is not None:
                            if counter == 1:
                                for item in fields_tags[concept_tag_key]:
                                    if item.attrib.get(attrib_key, None) is None:
                                        continue
                                    item.attrib[attrib_key] = f'{clone_key}{target_field}_{counter}'

                                    if not mapping_source_values:
                                        continue

                                    if number_of_source_value(target_field, groupList) > 1:

                                        if is_mapping_contains_source_value(target_field, groupList):
                                            item.attrib['sourceKey'] = f"{item.attrib[attrib_key].replace('concept_id', 'source_value')}"

                                    if number_of_type_concept_id(target_field, groupList) > 1:

                                        if is_mapping_contains_type_concept_id(target_field, groupList):
                                            item.attrib['typeId'] = f"{item.attrib[attrib_key].replace('concept_id', 'type_concept_id')}"

                            counter += 1

                            attrib = {
                                attrib_key: f'{clone_key}{target_field}_{counter}',
                            }

                            if is_mapping_contains_source_value(target_field, groupList):
                                if number_of_source_value(target_field, groupList) > 1:
                                    attrib['sourceKey'] = attrib[attrib_key].replace('concept_id', 'source_value')
                                else:
                                    attrib['sourceKey'] = re.sub(r'_\d+$', "", attrib[attrib_key].replace('concept_id', 'source_value'))

                            if is_mapping_contains_type_concept_id(target_field, groupList):
                                if number_of_type_concept_id(target_field, groupList) > 1:
                                    attrib['typeId'] = attrib[attrib_key].replace('concept_id', 'type_concept_id')
                                else:
                                    attrib['typeId'] = re.sub(r'_\d+$', "", attrib[attrib_key].replace('concept_id', 'type_concept_id'))

                            SubElement(fields_tags[concept_tag_key], 'Field', attrib)

                        else:
                            concepts_tag = prepare_concepts_tag(
                                concept_tags,
                                concepts_tag,
                                domain_definition_tag,
                                concept_tag_key,
                                target_field
                            )

                            fields_tag = SubElement(concept_tags[concept_tag_key], 'Fields')

                            attrib = {
                                attrib_key: f'{clone_key}{target_field}',
                            }

                            if is_mapping_contains(target_field, 'source_value', groupList):
                                attrib['sourceKey'] = attrib[attrib_key].replace('concept_id', 'source_value')

                            if is_mapping_contains(target_field, 'type_concept_id', groupList):
                                attrib['typeId'] = attrib[attrib_key].replace('concept_id', 'type_concept_id')

                            SubElement(fields_tag, 'Field', attrib)

                        if fields_tags.get(concept_tag_key, None) is None:
                            fields_tags[concept_tag_key] = fields_tag
                    else:
                        if (
                            is_type_concept_id(target_field) or
                            is_source_value(target_field) or
                            is_source_concept_id(target_field)
                        ):
                            continue

                        if target_field not in definitions:
                            v = SubElement(
                                domain_definition_tag,
                                _convert_underscore_to_camel(_replace_with_similar_name(target_field))
                            )
                            v.text = sql_alias if sql_alias else source_field

                            definitions.append(target_field)
                    if sql_transformation:
                        match_item = f"{source_field} as {target_field}"
                        if sql_transformation not in query_tag.text:
                            query_tag.text = query_tag.text.replace(
                                match_item,
                                sql_transformation,
                            )
                        else:
                            query_tag.text = query_tag.text.replace(f'{match_item},\n', '')
                            query_tag.text = query_tag.text.replace(f'{match_item}\n', '')
                previous_target_table = target_table
                if target_table == 'person':
                    generate_bath_sql_file(groupList, source_table, views)

                if target_table.lower() in ('location', 'care_site', 'provider'):
                    skip_write_file = True
                    write_xml(query_definition_tag, f'L_{target_table}', result)

        if skip_write_file:
            continue

        write_xml(query_definition_tag, source_table, result)
    return result


def write_xml(tag, filename, result):
    xml = ElementTree(tag)
    try:
        os.mkdir(GENERATE_CDM_XML_PATH)
        print(f'Directory {GENERATE_CDM_XML_PATH} created')
    except FileExistsError:
        print(f'Directory {GENERATE_CDM_XML_PATH} already exist')

    xml.write(GENERATE_CDM_XML_PATH / (filename + '.xml'))
    result.update({filename: _prettify(tag)})


def get_lookups_sql(cond: dict):
    """prepare sql's for lookups"""
    result = {}
    try:
        os.mkdir(GENERATE_CDM_LOOKUP_SQL_PATH)
        print(f'Directory {GENERATE_CDM_LOOKUP_SQL_PATH} created')
    except FileExistsError:
        print(f'Directory {GENERATE_CDM_LOOKUP_SQL_PATH} already exist')
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
            sql = f'''
                Standard AS (
                    SELECT DISTINCT
                        SOURCE_CODE,
                        TARGET_CONCEPT_ID,
                        TARGET_DOMAIN_ID,
                        SOURCE_VALID_START_DATE AS VALID_START_DATE,
                        SOURCE_VALID_END_DATE AS VALID_END_DATE,
                        SOURCE_VOCABULARY_ID
                    FROM Source_to_Standard
                    WHERE
                        SOURCE_VOCABULARY_ID IN {source_vocabulary_in} AND
                        SOURCE_VOCABULARY_ID NOT IN {source_vocabulary_not_in} AND
                        TARGET_VOCABULARY_ID IN {target_vocabulary_in} AND
                        TARGET_VOCABULARY_ID NOT IN {target_vocabulary_not_in} AND
                        TARGET_CONCEPT_CLASS_ID IN {target_concept_class_in} AND
                        TARGET_CONCEPT_CLASS_ID NOT IN {target_concept_class_not_in} AND
                        TARGET_DOMAIN_ID) IN {target_domain_in} AND
                        TARGET_DOMAIN_ID NOT IN {target_domain_not_in} AND
                        (TARGET_STANDARD_CONCEPT IS NOT NULL OR TARGET_STANDARD_CONCEPT != '') AND
                        (TARGET_INVALID_REASON IS NULL or TARGET_INVALID_REASON = '')
                ), 
                Source AS (
                    SELECT DISTINCT
                        SOURCE_CODE,
                        TARGET_CONCEPT_ID,
                        SOURCE_VALID_START_DATE,
                        SOURCE_VALID_END_DATE
                    FROM Source_to_Source
                    WHERE
                        SOURCE_VOCABULARY_ID IN {source_vocabulary_in} AND
                        SOURCE_VOCABULARY_ID NOT IN {source_vocabulary_not_in} AND
                        TARGET_VOCABULARY_ID IN {target_vocabulary_in} AND
                        TARGET_VOCABULARY_ID NOT IN {target_vocabulary_not_in} AND
                        TARGET_CONCEPT_CLASS_ID IN {target_concept_class_in} AND
                        TARGET_CONCEPT_CLASS_ID NOT IN {target_concept_class_not_in} AND
                        TARGET_DOMAIN_ID) IN {target_domain_in} AND
                        TARGET_DOMAIN_ID NOT IN {target_domain_not_in}
                ),
                S_S AS (
                    SELECT SOURCE_CODE FROM Standard
                    UNION
                    SELECT SOURCE_CODE FROM Source
                )
 
                SELECT DISTINCT
                    S_S.SOURCE_CODE,
                    Standard.TARGET_CONCEPT_ID,
                    Standard.TARGET_DOMAIN_ID,
                    Standard.VALID_START_DATE,
                    Standard.VALID_END_DATE,
                    Standard.SOURCE_VOCABULARY_ID,
                    Source.TARGET_CONCEPT_ID AS SOURCE_TARGET_CONCEPT_ID,
                    Source.SOURCE_VALID_START_DATE AS SOURCE_VALID_START_DATE,
                    Source.SOURCE_VALID_END_DATE,
                    ingredient_level.ingredient_concept_id
                FROM S_S
                LEFT JOIN Standard ON Standard.SOURCE_CODE = S_S.SOURCE_CODE
                LEFT JOIN Source ON Source.SOURCE_CODE = S_S.SOURCE_CODE
                LEFT JOIN ingredient_level ON ingredient_level.concept_id = Standard.TARGET_CONCEPT_ID
            '''
            sql_file = open(GENERATE_CDM_LOOKUP_SQL_PATH / (k + '.sql'), 'w+')
            sql_file.write(sql)
            result.update({k: sql})
    return result


def add_files_to_zip(zip_file, path):
    for root, dirs, files in os.walk(path):
        for file in files:
            zip_file.write(os.path.join(root, file), arcname=os.path.join(Path(root).name, file))


def zip_xml():
    """add mapping XMLs and lookup sql's to archive"""
    try:
        zip_file = zipfile.ZipFile(
            GENERATE_CDM_XML_ARCHIVE_PATH / '.'.join(
                (GENERATE_CDM_XML_ARCHIVE_FILENAME, GENERATE_CDM_XML_ARCHIVE_FORMAT)), 'w', zipfile.ZIP_DEFLATED)

        add_files_to_zip(zip_file, GENERATE_CDM_XML_PATH)
        add_files_to_zip(zip_file, GENERATE_CDM_LOOKUP_SQL_PATH)

        if os.path.isfile(GENERATE_BATCH_SQL_PATH):
            zip_file.write(GENERATE_BATCH_SQL_PATH, arcname='Batch.sql')
        zip_file.close()
    except FileNotFoundError:
        raise

def delete_generated(path):
    try:
        rmtree(path)
    except Exception:
        print(f'Directory {path} does not exist')

def delete_generated_xml():
    """clean mapping folder"""
    delete_generated(GENERATE_CDM_XML_PATH)

def delete_generated_sql():
    """clean lookup sql folder"""
    delete_generated(GENERATE_CDM_LOOKUP_SQL_PATH)

def get_lookups_list(lookup_type):
    lookups_list = []

    def updateList(base_path):
        path = os.path.join(base_path, lookup_type)
        if os.path.isdir(path):
            files = os.listdir(path)
            lookups_list.extend(
                map(lambda x: f"{x.replace('.txt', '')}", files)
            )

    updateList(PREDEFINED_LOOKUPS_PATH)
    updateList(INCOME_LOOKUPS_PATH)

    return lookups_list

def get_lookup(name, lookup_type):
    lookup = ''
    if len(name.split('.')) > 1:
        path = os.path.join(INCOME_LOOKUPS_PATH, lookup_type, f"{name}.txt")
    else:
        if 'template' in name:
            path = os.path.join(PREDEFINED_LOOKUPS_PATH, f"{name}.txt")
        else:
            path = os.path.join(PREDEFINED_LOOKUPS_PATH, lookup_type, f"{name}.txt")
    if os.path.isfile(path):
        with open(path, mode='r') as f:
            lookup = f.readlines()
    return ''.join(lookup)

def add_lookup(lookup):
    name = lookup['name']
    lookup_type = lookup['lookupType']
    filepath = os.path.join(INCOME_LOOKUPS_PATH, lookup_type)
    filename = os.path.join(filepath, f'{name}.txt')
    if not os.path.isdir(filepath):
        os.makedirs(filepath)

    with open(filename, mode='w') as f:
        f.write(lookup['value'])

def del_lookup(name, lookup_type):
    path = os.path.join(INCOME_LOOKUPS_PATH, lookup_type, f"{name}.txt")
    if os.path.isfile(path):
        os.remove(path)


if __name__ == '__main__':
    pass
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
#     from ast import literal_eval
#     condition = literal_eval('''[{'lookup' :
# {
#   'source_vocabulary': {
#     'in': ['s_voc1', 's_voc2'],
#     'not_in': ['s_voc3', 's_voc4']
#   }
#   ,
#   'target_vocabulary': {
#     'in': ['t_voc1', 't_voc2'],
#     'not_in': ['t_voc3', 't_voc4']
#   },
#   'source_concept_class': {
#     'in': ['s_concept1', 's_concept2'],
#     'not_in': ['s_concept3', 's_concept4']
#   },
#   'target_concept_class': {
#     'in': ['t_concept1', 't_concept2'],
#     'not_in': ['t_concept3', 't_concept4']
#   },
#   'target_domain': {
#     'in': ['t_domain1', 't_domain2'],
#     'not_in': ['t_domain3', 't_domain4']
#   }
# }
# },
# {'lookup2' :
# {
#   'source_vocabulary': {
#     'in': ['s_voc1', 's_voc2'],
#     'not_in': ['s_voc3', 's_voc4']
#   },
#   'target_vocabulary': {
#     'in': ['t_voc1', 't_voc2'],
#     'not_in': ['t_voc3', 't_voc4']
#   },
#   'source_concept_class': {
#     'in': ['s_concept1', 's_concept2'],
#     'not_in': ['s_concept3', 's_concept4']
#   },
#   'target_concept_class': {
#     'in': ['t_concept1', 't_concept2'],
#     'not_in': ['t_concept3', 't_concept4']
#   },
#   'target_domain': {
#     'in': ['t_domain1', 't_domain2'],
#     'not_in': ['t_domain3', 't_domain4']
#   }
# }
# }]''')
#     print(condition)
#     get_lookups_sql(condition)

