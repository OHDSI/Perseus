import re
import pysolr
from model.usagi_data.code_mapping import ScoredConcept, TargetConcept
from model.usagi_data.concept import Concept
from util.array_util import remove_duplicates
from service.similarity_score_service import get_terms_vectors, cosine_sim_vectors
from util.constants import SOLR_CONN_STRING
from util.target_concept_util import create_target_concept

CONCEPT_TERM = "C"
CONCEPT_TYPE_STRING	= "C"


def count():
    solr = pysolr.Solr(SOLR_CONN_STRING)
    results = solr.search('*:*', rows=0)
    return results.hits


def search_usagi(filters, query, source_auto_assigned_concept_ids):
    solr = pysolr.Solr(SOLR_CONN_STRING, always_commit=True)
    scored_concepts = []
    filter_queries = create_usagi_filter_queries(filters, source_auto_assigned_concept_ids) if filters else None
    words = '+'.join(re.split('[^a-zA-Z0-9]', query))
    results = solr.search(f"term:{words}", fl='concept_id, term, score', fq=filter_queries, rows=100).docs
    results = remove_duplicates(results)
    vectors = get_terms_vectors(results, query, 'term')
    for index, item in enumerate(results):
        if 'concept_id' in item:
            concept: Concept = Concept.select().where(Concept.concept_id == item['concept_id']).get()
            target_concept: TargetConcept = create_target_concept(concept)
            cosine_simiarity_score = float("{:.2f}".format(cosine_sim_vectors(vectors[0], vectors[index+1])))
            scored_concepts.append(ScoredConcept(cosine_simiarity_score, target_concept, item['term']))
    scored_concepts.sort(key=lambda x: x.match_score, reverse=True)
    return scored_concepts


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