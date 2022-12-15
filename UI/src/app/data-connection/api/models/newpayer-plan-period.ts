/* tslint:disable */
/* eslint-disable */

/**
 * (tsType: Omit<payer_plan_period, >, schemaOptions: { title: 'Newpayer_plan_period', exclude: [] })
 */
export interface NewpayerPlanPeriod {
  family_source_value?: string;
  payer_concept_id?: number;
  payer_plan_period_end_date?: string;
  payer_plan_period_id?: number;
  payer_plan_period_start_date?: string;
  payer_source_concept_id?: number;
  payer_source_value?: string;
  person_id?: number;
  plan_concept_id?: number;
  plan_source_concept_id?: number;
  plan_source_value?: string;
  sponsor_concept_id?: number;
  sponsor_source_concept_id?: number;
  sponsor_source_value?: string;
  stop_reason_concept_id?: number;
  stop_reason_source_concept_id?: number;
  stop_reason_source_value?: string;
}
