/* tslint:disable */
/* eslint-disable */

/**
 * (tsType: Partial<visit_detail>, schemaOptions: { partial: true })
 */
export interface VisitDetailPartial {
  admitted_from_concept_id?: number;
  admitted_from_source_value?: string;
  care_site_id?: number;
  discharged_to_concept_id?: number;
  discharged_to_source_value?: string;
  parent_visit_detail_id?: number;
  person_id?: number;
  preceding_visit_detail_id?: number;
  provider_id?: number;
  visit_detail_concept_id?: number;
  visit_detail_end_date?: string;
  visit_detail_end_datetime?: string;
  visit_detail_id?: number;
  visit_detail_source_concept_id?: number;
  visit_detail_source_value?: string;
  visit_detail_start_date?: string;
  visit_detail_start_datetime?: string;
  visit_detail_type_concept_id?: number;
  visit_occurrence_id?: number;
}
