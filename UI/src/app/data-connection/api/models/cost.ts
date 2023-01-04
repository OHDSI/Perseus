/* tslint:disable */
/* eslint-disable */
export interface Cost {
  amount_allowed?: number;
  cost_domain_id?: string;
  cost_event_id?: number;
  cost_id?: number;
  cost_type_concept_id?: number;
  currency_concept_id?: number;
  drg_concept_id?: number;
  drg_source_value?: string;
  paid_by_patient?: number;
  paid_by_payer?: number;
  paid_by_primary?: number;
  paid_dispensing_fee?: number;
  paid_ingredient_cost?: number;
  paid_patient_coinsurance?: number;
  paid_patient_copay?: number;
  paid_patient_deductible?: number;
  payer_plan_period_id?: number;
  revenue_code_concept_id?: number;
  revenue_code_source_value?: string;
  total_charge?: number;
  total_cost?: number;
  total_paid?: number;
}
