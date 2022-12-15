/* tslint:disable */
/* eslint-disable */

/**
 * (tsType: visit_occurrenceWithRelations, schemaOptions: { includeRelations: true })
 */
export interface VisitOccurrenceWithRelations {
  admitted_from_concept_id?: number;
  admitted_from_source_value?: string;
  care_site_id?: number;
  discharged_to_concept_id?: number;
  discharged_to_source_value?: string;
  person_id?: number;
  preceding_visit_occurrence_id?: number;
  provider_id?: number;
  visit_concept_id?: number;
  visit_end_date?: string;
  visit_end_datetime?: string;
  visit_occurrence_id?: number;
  visit_source_concept_id?: number;
  visit_source_value?: string;
  visit_start_date?: string;
  visit_start_datetime?: string;
  visit_type_concept_id?: number;
}
