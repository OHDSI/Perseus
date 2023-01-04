/* tslint:disable */
/* eslint-disable */

/**
 * (tsType: Omit<procedure_occurrence, >, schemaOptions: { title: 'Newprocedure_occurrence', exclude: [] })
 */
export interface NewprocedureOccurrence {
  modifier_concept_id?: number;
  modifier_source_value?: string;
  person_id?: number;
  procedure_concept_id?: number;
  procedure_date?: string;
  procedure_datetime?: string;
  procedure_end_date?: string;
  procedure_end_datetime?: string;
  procedure_occurrence_id?: number;
  procedure_source_concept_id?: number;
  procedure_source_value?: string;
  procedure_type_concept_id?: number;
  provider_id?: number;
  quantity?: number;
  visit_detail_id?: number;
  visit_occurrence_id?: number;
}
