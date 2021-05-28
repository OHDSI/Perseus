import re
from cdm_souffleur.model.code_mapping import ScoredConcept, TargetConcept
import pysolr
from cdm_souffleur import app
from cdm_souffleur.model.concept import Concept
from cdm_souffleur.services.similarity_score_service import get_terms_vestors, cosine_sim_vectors

CONCEPT_TERM = "C"


def search(current_user, filters, query, source_auto_assigned_concept_ids):
    solr = pysolr.Solr(f"http://{app.config['SOLR_HOST']}:{app.config['SOLR_PORT']}/solr/{current_user}",
                       always_commit=True)
    scored_concepts = []
    if filters:
        filter_queries = create_filter_queries(filters, source_auto_assigned_concept_ids)
    words = '+'.join(re.split('[^a-zA-Z]', query))
    results = solr.search(f"term:{words}", fl='concept_id, term, score', fq=filter_queries, rows=100).docs
    vectors = get_terms_vestors(results, query)
    for index, item in enumerate(results):
        if 'concept_id' in item:
            target_concept = Concept.select().where(Concept.concept_id == item['concept_id']).get()
            concept = create_target_concept(target_concept)
            cosine_simiarity_score = float("{:.2f}".format(cosine_sim_vectors(vectors[0], vectors[index+1])))
            scored_concepts.append(ScoredConcept(cosine_simiarity_score, concept, item['term']))
    scored_concepts.sort(key=lambda x: x.match_score, reverse=True)
    return scored_concepts


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


def create_filter_queries(filters, source_auto_assigned_concept_ids):
    queries = []
    create_or_filter_query(queries, filters['filterByConceptClass'], filters['conceptClasses'], 'concept_class_id')
    create_or_filter_query(queries, filters['filterByVocabulary'], filters['vocabularies'], 'vocabulary_id')
    create_or_filter_query(queries, filters['filterByDomain'], filters['domains'], 'domain_id')
    if filters['filterStandardConcepts']:
        queries.append('standard_concept:S')
    if source_auto_assigned_concept_ids and len(source_auto_assigned_concept_ids):
        create_or_filter_query(queries, filters['filterByUserSelectedConceptsAtcCode'], source_auto_assigned_concept_ids, 'concept_id')
    if filters['includeSourceTerms']:
        queries.append(f'term_type:{CONCEPT_TERM}')
    return queries


def create_or_filter_query(queries, filter_applied, values, field_name):
    def add_field_name(item, field_name):
        return f"{field_name}:{item}"
    if filter_applied:
        values_with_field_name = [add_field_name(item, field_name) for item in values]
        query = " OR ".join(values_with_field_name)
        if query:
            queries.append(query)
    return queries

