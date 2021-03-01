from cdm_souffleur.model.conceptVocabularyModel import *
import math
import numpy as np
from itertools import groupby
from cdm_souffleur.utils.constants import VOCABULARY_FILTERS


def search_vocabulary_concepts(pageSize, page, query, sort, order, filters, update_filters):
    offset = (int(page) - 1) * int(pageSize)
    concepts_list = get_concepts_list(query, filters, sort, order)
    selected_concepts_indices = np.arange(offset, offset + int(pageSize))
    selected_concepts = np.take(concepts_list, selected_concepts_indices)
    vocabulary_filters = {}
    if update_filters:
        vocabulary_filters = get_filters(concepts_list)
    total_records = len(concepts_list)
    total_pages = math.ceil(total_records/int(pageSize))

    search_result = {'content': list(selected_concepts), 'facets': vocabulary_filters, 'totalElements': total_records, 'totalPages': total_pages}

    return search_result


def get_concepts_list(query, filters, sort, order):
    concepts_query = Concept.select().where(Concept.concept_name.contains(query))
    concepts_query = add_filters(concepts_query, filters)
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

    return result_concepts


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


def get_filters(concepts):
    filter_queries = {'concept_class_id': Concept_Class.select(Concept_Class.concept_class_id),
                      'domain_id': Domain.select(Domain.domain_id),
                      'vocabulary_id': Vocabulary.select(Vocabulary.vocabulary_id)}
    filters = {}
    for key in VOCABULARY_FILTERS:
        if key in filter_queries:
            filters[key] = get_filter_values(filter_queries[key], key)
        else:
            filters[key] = {}
        filters[key] = update_filter_values(filters[key], concepts, VOCABULARY_FILTERS[key])
    return filters


def get_filter_values(query, field):
    result_values = {}
    for item in query:
        filter_key = item.concept_class_id if field == 'concept_class_id' else item.domain_id if field == 'domain_id' else item.vocabulary_id,
        result_values[filter_key[0]] = 0
    return result_values


def update_filter_values(vocab_filter, concepts, vocab_property):
    group_key = lambda a: a[vocab_property]
    groups = groupby(sorted(concepts, key=group_key), key=group_key)
    for key, group in groups:
        vocab_filter[key] = len(list(group))
    return vocab_filter
