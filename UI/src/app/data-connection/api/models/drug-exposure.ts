/* tslint:disable */
/* eslint-disable */
export interface DrugExposure {
  days_supply?: number;
  dose_unit_source_value?: string;
  drug_concept_id?: number;
  drug_exposure_end_date?: string;
  drug_exposure_end_datetime?: string;
  drug_exposure_id?: number;
  drug_exposure_start_date?: string;
  drug_exposure_start_datetime?: string;
  drug_source_concept_id?: number;
  drug_source_value?: string;
  drug_type_concept_id?: number;
  lot_number?: string;
  person_id?: number;
  provider_id?: number;
  quantity?: number;
  refills?: number;
  route_concept_id?: number;
  route_source_value?: string;
  sig?: string;
  stop_reason?: string;
  verbatim_end_date?: string;
  visit_detail_id?: number;
  visit_occurrence_id?: number;
}
