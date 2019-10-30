import { ConceptConfig } from './config-concept';
import { TypeConcept } from './concept-type';
import { IVocabulary } from 'src/app/services/vocabularies.service';
import { cloneDeep } from 'src/app/infrastructure/utility';

export class VocabularyConfig {
  get conceptConfig(): ConceptConfig {
    return this.conceptconfig;
  }

  get sourceConceptConfig(): ConceptConfig {
    return this.sourceconceptConfig;
  }

  get typeConcept(): TypeConcept[] {
    return this.typeconcept;
  }

  set typeConcept(typeConcept: TypeConcept[]) {
    this.typeconcept = typeConcept;
  }

  private conceptconfig: ConceptConfig;
  private sourceconceptConfig: ConceptConfig;
  private typeconcept: TypeConcept[];

  constructor(private vocabularies: IVocabulary[]) {
    this.init();
  }

  private init() {
    this.conceptconfig = new ConceptConfig('concept');

    this.conceptconfig.addVocabularyConfig(
      'source_vocabulary',
      'Source Vocabulary',
      this.findVocabulary('lookup'),
      1
    );
    this.conceptconfig.addVocabularyConfig(
      'target_vocabulary',
      'Target Vocabulary',
      this.findVocabulary('lookup'),
      2
    );
    this.conceptconfig.addVocabularyConfig(
      'source_concept_class',
      'Source Concept Class',
      this.findVocabulary('concept'),
      3
    );
    this.conceptconfig.addVocabularyConfig(
      'target_concept_class',
      'Target Concept Class',
      this.findVocabulary('concept'),
      4
    );
    this.conceptconfig.addVocabularyConfig(
      'target_domain',
      'Target Domain',
      this.findVocabulary('domain'),
      5
    );

    this.sourceconceptConfig = cloneDeep(this.conceptconfig);
    this.sourceconceptConfig.name = 'sourceconcept';
    this.typeconcept = [];
  }

  private findVocabulary(name: string): IVocabulary {
    const idx = this.vocabularies.findIndex(v => v.name === name);
    if (idx > -1) {
      return this.vocabularies[idx];
    } else {
      return null;
    }
  }
}
