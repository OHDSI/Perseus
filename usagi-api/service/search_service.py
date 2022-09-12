import pysolr
from typing import List
from model.usagi_data.code_mapping import ScoredConcept, TargetConcept
from model.usagi_data.concept import Concept
from service.similarity_score_service import get_terms_vectors, cosine_sim_vectors
from util.array_util import remove_duplicates
from util.constants import SOLR_CONN_STRING
from util.searh_util import search_term_to_query
from util.target_concept_util import create_target_concept

CONCEPT_TERM = "C"
CONCEPT_TYPE_STRING	= "C"
SEARCH_RESULT_SIZE = 100


def count():
    solr = pysolr.Solr(SOLR_CONN_STRING)
    results = solr.search('*:*', rows=0)
    return results.hits


def search_usagi(filters, search_term: str, source_auto_assigned_concept_ids):
    if search_term is None:
        search_term = ''
    solr = pysolr.Solr(SOLR_CONN_STRING, always_commit=True)
    scored_concepts = []
    filter_queries = create_usagi_filter_queries(filters, source_auto_assigned_concept_ids) if filters else None
    search_query = search_term_to_query(search_term)
    results = solr.search(search_query, fl='concept_id, term, score', fq=filter_queries, rows=SEARCH_RESULT_SIZE).docs
    results = remove_duplicates(results)
    vectors = get_terms_vectors(results, search_term, 'term')
    for index, item in enumerate(results):
        if 'concept_id' in item:
            concept: Concept = Concept.select().where(Concept.concept_id == item['concept_id']).get()
            target_concept: TargetConcept = create_target_concept(concept)
            cosine_simiarity_score = float("{:.2f}".format(cosine_sim_vectors(vectors[0], vectors[index + 1])))
            scored_concepts.append(ScoredConcept(cosine_simiarity_score, target_concept, item['term']))
    scored_concepts.sort(key=lambda x: x.match_score, reverse=True)
    return scored_concepts


def create_usagi_filter_queries(filters, source_auto_assigned_concept_ids):
    queries = []
    add_filter_query_if_applied(queries, filters['filterByConceptClass'], filters['conceptClasses'], 'concept_class_id')
    add_filter_query_if_applied(queries, filters['filterByVocabulary'], filters['vocabularies'], 'vocabulary_id')
    add_filter_query_if_applied(queries, filters['filterByDomain'], filters['domains'], 'domain_id')
    if filters['filterStandardConcepts']:
        queries.append('standard_concept:S')
    if source_auto_assigned_concept_ids and len(source_auto_assigned_concept_ids):
        add_filter_query_if_applied(queries, filters['filterByUserSelectedConceptsAtcCode'],
                                    source_auto_assigned_concept_ids, 'concept_id')
    if filters['includeSourceTerms']:
        queries.append(f'term_type:{CONCEPT_TERM}')
    queries.append(f'type:{CONCEPT_TYPE_STRING}')

    return queries


def add_filter_query_if_applied(queries: List[str],
                                filter_applied: bool,
                                values: List[str],
                                field_name: str):
    if filter_applied:
        filters_queries = [create_filter_query(item, field_name) for item in values]
        filter_query = " OR ".join(filters_queries)
        if filter_query:
            queries.append(filter_query)


def create_filter_query(value: str, field_name: str) -> str:
    return f'{field_name}:"{value}"'
