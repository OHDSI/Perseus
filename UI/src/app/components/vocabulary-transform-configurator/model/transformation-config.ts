import { VocabularyConfig } from './vocabulary-config';

export interface TransformationConfig {
  name: string;
  selectedSourceFields: string[];
  conditions: TransformationCondition[];
}

export interface TransformationCondition {
  name: string;
  sourceField?: string;
  criteria?: any;
  operator?: string;
  vocabularyConfig: VocabularyConfig;
}
