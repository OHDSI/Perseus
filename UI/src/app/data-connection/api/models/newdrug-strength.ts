/* tslint:disable */
/* eslint-disable */

/**
 * (tsType: Omit<drug_strength, >, schemaOptions: { title: 'Newdrug_strength', exclude: [] })
 */
export interface NewdrugStrength {
  amount_unit_concept_id?: number;
  amount_value?: number;
  box_size?: number;
  denominator_unit_concept_id?: number;
  denominator_value?: number;
  drug_concept_id?: number;
  ingredient_concept_id?: number;
  invalid_reason?: string;
  numerator_unit_concept_id?: number;
  numerator_value?: number;
  valid_end_date?: string;
  valid_start_date?: string;
}
