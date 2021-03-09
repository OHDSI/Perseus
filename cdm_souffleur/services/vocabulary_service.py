from cdm_souffleur.model.conceptVocabularyModel import *
import math
import numpy as np
from itertools import groupby
from cdm_souffleur.utils.constants import VOCABULARY_FILTERS


def search_vocabulary_concepts(pageSize, page, query, sort, order, filters, update_filters):
    total_count, concepts_list, concept_filter_queries = get_concepts_list(query, int(pageSize), int(page), filters, sort, order)
    vocabulary_filters = {}
    if update_filters:
        vocabulary_filters = get_filters(concept_filter_queries, total_count)
    total_pages = math.ceil(total_count/int(pageSize))

    search_result = {'content': list(concepts_list), 'facets': vocabulary_filters, 'totalElements': total_count, 'totalPages': total_pages}

    return search_result


def get_concepts_list(query, page_size, page, filters, sort, order):

    filter_queries = {}
    for key in VOCABULARY_FILTERS:
        filter_queries[key] = Concept.select(getattr(Concept, key), fn.COUNT(getattr(Concept, key))).group_by(
        getattr(Concept, key))
    concepts_query = Concept.select()
    count_query = Concept.select(fn.Count(Concept.concept_id).alias('count'))

    if query:
        concepts_query = apply_query(query, concepts_query)
        count_query = apply_query(query, count_query)
        for key in filter_queries:
            filter_queries[key] = apply_query(query, filter_queries[key])

    concepts_query = add_filters(concepts_query, filters)
    concepts_query = concepts_query.paginate((page - 1)*page_size+1, page*page_size)

    if sort:
        concepts_query = apply_sort(concepts_query, sort, order)
    result_concepts = []
    for item in concepts_query:
        concept = {'id': item.concept_id,
                   'code': item.concept_code,
                   'name': item.concept_name,
                   'className': item.concept_class_id,
                   'standardConcept': "Standard" if item.standard_concept == "S" else "Classification" if item.standard_concept == "C" else "Non-standard",
                   'invalidReason': "Invalid" if item.invalid_reason else "Valid",
                   'domain': item.domain_id,
                   'vocabulary': item.vocabulary_id}
        result_concepts.append(concept)
    for item in count_query:
        total_count = item.count

    return total_count, result_concepts, filter_queries

def apply_query(query, sql_request):
    return sql_request.where(Concept.concept_name.contains(query))


def apply_sort(concepts_query, sort, order):
    if order == 'asc':
        concepts_query = concepts_query.order_by(getattr(Concept, sort).asc())
    else:
        concepts_query = concepts_query.order_by(getattr(Concept, sort).desc())
    return concepts_query


def add_filters(concepts_query, filters):
    for key in VOCABULARY_FILTERS:
        if filters[key]:
            filter_values = filters[key].split(",")
            if key == 'invalid_reason':
                concepts_query = apply_invalid_reason_filter(concepts_query, filter_values)
            elif key == 'standard_concept':
                concepts_query = apply_standard_concept_filter(concepts_query, filter_values)
            else:
                concepts_query = concepts_query.where(getattr(Concept, key).in_(filter_values))
    return concepts_query


def apply_invalid_reason_filter(concepts_query, filter_values):
    if len(filter_values) == 1:
        if filter_values[0] == 'Valid':
            concepts_query = concepts_query.where(Concept.invalid_reason.is_null(True))
        else:
            concepts_query = concepts_query.where(Concept.invalid_reason.is_null(False))
    return concepts_query


def apply_standard_concept_filter(concepts_query, filter_values):
    if 'Standard' in filter_values:
        if 'Classification' in filter_values:
            if 'Non-Standard' in filter_values:
                return concepts_query
            else:
                concepts_query = concepts_query.where(Concept.standard_concept.in_(['C', 'S']))
        else:
            if 'Non-Standard' in filter_values:
                concepts_query = concepts_query.where((Concept.standard_concept == 'S') | (Concept.standard_concept.is_null(True)))
            else:
                concepts_query = concepts_query.where(Concept.standard_concept == 'S')
    else:
        if 'Classification' in filter_values:
            if 'Non-Standard' in filter_values:
                concepts_query = concepts_query.where((Concept.standard_concept == 'C') | (Concept.standard_concept.is_null(True)))
            else:
                concepts_query = concepts_query.where(Concept.standard_concept == 'C')
        else:
            if 'Non-Standard' in filter_values:
                concepts_query = concepts_query.where(Concept.standard_concept.is_null(True))
    return concepts_query


def get_filters(concept_filter_queries, total_count):
    filter_queries = {'concept_class_id': Concept_Class.select(Concept_Class.concept_class_id),
                      'domain_id': Domain.select(Domain.domain_id),
                      'vocabulary_id': Vocabulary.select(Vocabulary.vocabulary_id)}
    filters = {}
    for key in VOCABULARY_FILTERS:
        if key in filter_queries:
            filters[key] = get_filter_keys(filter_queries[key], key)
        else:
            filters[key] = {}
        filters[key] = update_filter_values(filters[key], concept_filter_queries[key], key)
    update_valid_and_non_standard_concept_counts(filters, total_count)
    return filters

def update_valid_and_non_standard_concept_counts(filters, total_count):
    filters['invalid_reason']['Valid'] = total_count - filters['invalid_reason']['Invalid']
    filters['standard_concept']['Non-Standard'] = total_count - filters['standard_concept']['Standard'] - filters['standard_concept']['Classification']


def get_filter_keys(query, field):
    result_values = {}
    for item in query:
        filter_key = item.concept_class_id if field == 'concept_class_id' else item.domain_id if field == 'domain_id' else item.vocabulary_id,
        result_values[filter_key[0]] = 0
    return result_values


def update_filter_values(vocab_filter, concept_filter_query, vocab_key):
    for item in concept_filter_query:
        if vocab_key == 'invalid_reason':
            set_invalid_reason_count(vocab_filter, getattr(item, vocab_key), item.count)
        elif vocab_key == 'standard_concept':
            set_standard_concept_count(vocab_filter, getattr(item, vocab_key), item.count)
        else:
            vocab_filter[getattr(item, vocab_key)] = item.count
    return vocab_filter


def set_invalid_reason_count(vocab_filter, field, count):
    if field:
        vocab_filter['Invalid'] = count if 'Invalid' not in vocab_filter else vocab_filter['Invalid'] + count


def set_standard_concept_count(vocab_filter, field, count):
    if field == 'S':
        vocab_filter['Standard'] = count
    if field == 'C':
        vocab_filter['Classification'] = count
