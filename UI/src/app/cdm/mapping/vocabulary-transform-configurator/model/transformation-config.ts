import { VocabularyConfig } from './vocabulary-config';
import { IVocabulary } from 'src/app/services/vocabularies.service';

export class TransformationConfigFactory {

  constructor(private vocabularies: IVocabulary[]) {
  }

  createNew(name: string, selectedSourceFilelds: string[]): TransformationConfig {
    const conditionConfig: TransformationCondition = {
      name: 'default',
      vocabularyConfig: new VocabularyConfig(this.vocabularies)
    };

    return {
      name,
      selectedSourceFields: selectedSourceFilelds,
      conditions: [conditionConfig]
    };
  }
}


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
