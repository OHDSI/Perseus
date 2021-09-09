import math
import re

from cdm_souffleur.utils.constants import VOCABULARY_FILTERS, USAGI_CORE_NAME, ATHENA_CORE_NAME

from cdm_souffleur.model.code_mapping import ScoredConcept, TargetConcept
import pysolr
from cdm_souffleur import app
from cdm_souffleur.model.concept import Concept
from cdm_souffleur.services.similarity_score_service import get_terms_vectors, cosine_sim_vectors

CONCEPT_TERM = "C"
CONCEPT_TYPE_STRING	= "C"


def search_usagi(current_user, filters, query, source_auto_assigned_concept_ids):
    solr = pysolr.Solr(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/solr/{USAGI_CORE_NAME}",
                       always_commit=True)
    scored_concepts = []
    if filters:
        filter_queries = create_usagi_filter_queries(filters, source_auto_assigned_concept_ids)
    words = '+'.join(re.split('[^a-zA-Z0-9]', query))
    results = solr.search(f"term:{words}", fl='concept_id, term, score', fq=filter_queries, rows=100).docs
    results = remove_duplicates(results)
    vectors = get_terms_vectors(results, query, 'term')
    for index, item in enumerate(results):
        if 'concept_id' in item:
            target_concept = Concept.select().where(Concept.concept_id == item['concept_id']).get()
            concept = create_target_concept(target_concept)
            cosine_simiarity_score = float("{:.2f}".format(cosine_sim_vectors(vectors[0], vectors[index+1])))
            scored_concepts.append(ScoredConcept(cosine_simiarity_score, concept, item['term']))
    scored_concepts.sort(key=lambda x: x.match_score, reverse=True)
    return scored_concepts


def remove_duplicates(results):
    return [i for n, i in enumerate(results) if i not in results[n + 1:]]


def create_target_concept(concept):
    return TargetConcept(concept.concept_id,
                         concept.concept_name,
                         concept.concept_class_id,
                         concept.vocabulary_id,
                         concept.concept_code,
                         concept.domain_id,
                         concept.valid_start_date.strftime("%Y-%m-%d"),
                         concept.valid_end_date.strftime("%Y-%m-%d"),
                         concept.invalid_reason,
                         concept.standard_concept,
                         "",
                         concept.parent_count,
                         concept.parent_count)


def create_usagi_filter_queries(filters, source_auto_assigned_concept_ids):
    queries = []
    create_or_filter_query_usagi(queries, filters['filterByConceptClass'], filters['conceptClasses'], 'concept_class_id')
    create_or_filter_query_usagi(queries, filters['filterByVocabulary'], filters['vocabularies'], 'vocabulary_id')
    create_or_filter_query_usagi(queries, filters['filterByDomain'], filters['domains'], 'domain_id')
    if filters['filterStandardConcepts']:
        queries.append('standard_concept:S')
    if source_auto_assigned_concept_ids and len(source_auto_assigned_concept_ids):
        create_or_filter_query_usagi(queries, filters['filterByUserSelectedConceptsAtcCode'], source_auto_assigned_concept_ids, 'concept_id')
    if filters['includeSourceTerms']:
        queries.append(f'term_type:{CONCEPT_TERM}')
    queries.append(f'type:{CONCEPT_TYPE_STRING}')

    return queries


def create_or_filter_query_usagi(queries, filter_applied, values, field_name):
    if filter_applied:
        queries = create_or_string(queries, values, field_name)
    return queries


def create_or_string(queries, values, field_name):
    def add_field_name(item, field_name):
        return f"{field_name}:{item}"
    values_with_field_name = [add_field_name(item, field_name) for item in values]
    query = " OR ".join(values_with_field_name)
    if query:
        queries.append(query)
    return queries


def search_athena(pageSize, page, query, sort, order, filters, update_filters):
    result_concepts = []
    solr = pysolr.Solr(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/solr/{ATHENA_CORE_NAME}",
                       always_commit=True)
    filter_queries = create_athena_filter_queries(filters)
    splitted_query = '+'.join(re.split(' ', query));
    final_query = f"concept_name:{splitted_query} OR concept_code:{splitted_query} OR concept_id:{splitted_query}" if query else '*:*'
    start_record = (int(page) - 1)*int(pageSize)
    facet_fields = VOCABULARY_FILTERS.keys()
    params = {
        'facet': 'on',
        'facet.field': facet_fields
    }
    sort_param = get_sort_param(sort, order)
    results = solr.search(final_query, fq=filter_queries, start=start_record, rows=pageSize, sort=sort_param, **params)
    result_docs = results.docs
    total_count = results.hits
    total_pages = math.ceil(total_count / int(pageSize))
    facets = get_facet_counts(results.facets['facet_fields'], total_count)
    for index, item in enumerate(result_docs):
        concept = {'id': item['concept_id'],
                   'code': item['concept_code'],
                   'name': item['concept_name'][0],
                   'className': item['concept_class_id'],
                   'standardConcept': "Non-standard" if 'standard_concept' not in item else "Standard" if item['standard_concept'] == "S" else "Classification",
                   'invalidReason': "Invalid" if 'invalid_reason' in item else "Valid",
                   'domain': item['domain_id'],
                   'vocabulary': item['vocabulary_id']}
        result_concepts.append(concept)
    search_result = {'content': result_concepts, 'facets': facets, 'totalElements': total_count,
                     'totalPages': total_pages}

    return search_result


def get_sort_param(sort, order):
    if order == 'asc' or order == 'desc':
        if sort != 'concept_name':
            return f"{sort} {order}"
        else:
            return f"concept_name_for_sort {order}"
    else:
        return ''


def create_athena_filter_queries(filters):
    queries = []
    for key in VOCABULARY_FILTERS:
        if filters[key]:
            if key == 'invalid_reason':
                apply_invalid_reason_filter(queries, filters[key].split(","))
            elif key == 'standard_concept':
                apply_standard_concept_filter(queries, filters[key].split(","), key)
            else:
                create_or_string(queries, filters[key].split(","), key)
    return queries


def apply_invalid_reason_filter(queries, filter_values):
    if len(filter_values) == 1:
        if filter_values[0] == 'Valid':
            queries.append('-invalid_reason:*')
        else:
            queries.append('invalid_reason:*')


def apply_standard_concept_filter(queries, filter_values, key):
    if 'Standard' in filter_values:
        if 'Classification' in filter_values:
            if 'Non-standard' in filter_values:
                return queries
            else:
                create_or_string(queries, ['C', 'S'], key)
        else:
            if 'Non-standard' in filter_values:
                queries.append('-standard_concept:C')
            else:
                create_or_string(queries, ['S'], key)
    else:
        if 'Classification' in filter_values:
            if 'Non-standard' in filter_values:
                queries.append('-standard_concept:S')
            else:
                create_or_string(queries, ['C'], key)
        else:
            if 'Non-standard' in filter_values:
                queries.append('-standard_concept:*')
    return queries


def make_dicts_from_facets(facets):
    facet_dict = {}
    for key in facets:
        facet_dict[key] = {}
        for index, value in enumerate(facets[key]):
            if (index % 2) == 0:
                facet_dict[key][value] = facets[key][index + 1]
    return facet_dict


def get_facet_counts(facets, total_count):
    facets = make_dicts_from_facets(facets)
    facets_result = {}
    for key in VOCABULARY_FILTERS:
        facets_result[key] = {}
        if key == 'standard_concept':
            get_standard_concept_facet_count(facets_result[key], facets[key], total_count)
        elif key == 'invalid_reason':
            get_invalid_reason_facet_count(facets_result[key], facets[key], total_count)
        else:
            facets_result[key] = facets[key]
    return facets_result


def get_standard_concept_facet_count(facets_result, facets, total_count):
    for item in ['Standard', 'Classification', 'Non-standard']:
        facets_result[item] = 0
    for key in facets:
        if key == 'S':
            facets_result['Standard'] = facets[key]
        else:
            facets_result['Classification'] = facets[key]
    facets_result['Non-standard'] = total_count - (facets_result['Standard'] + facets_result['Classification'])


def get_invalid_reason_facet_count(facets_result, facets, total_count):
    facets_result['Invalid'] = sum(facets.values())
    facets_result['Valid'] = total_count - facets_result['Invalid']