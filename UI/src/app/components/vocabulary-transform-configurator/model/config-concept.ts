import { VocabularyBlock } from '../vocabulary-block/vocabulary-block.component';
import { DictionaryItem } from '../../vocabulary-search-select/model/vocabulary';
import { IVocabulary } from 'src/app/services/vocabularies.service';

export class ConceptConfig {
  get asArray(): VocabularyBlock[] {
    return Array.from(this.model.values());
  }

  name: string;

  private model = new Map<string, VocabularyBlock>();

  constructor(name: string) {
    this.name = name;
  }

  get(key: string): VocabularyBlock {
    if (this.model.has(key)) {
      return this.model.get(key);
    }

    return null;
  }

  addVocabularyConfig(
    key: string,
    configurationName: string,
    vocabulary: IVocabulary
  ) {
    if (!vocabulary) {
      return;
    }
    const config: VocabularyBlock = {
      key,
      name: configurationName,
      in: vocabulary.payload.map(item => new DictionaryItem(item)),
      notin: vocabulary.payload.map(item => new DictionaryItem(item))
    };
    this.updateConfiguration(key, config);
  }

  updateConfiguration(key: string, value: VocabularyBlock) {
    if (this.model.has(key)) {
      this.model.delete(key);
    }

    this.model.set(key, value);
  }

  serialyze() {
    // const modelFlat = Object.values(this.model);
    const config = {};
    const lookupConfig = this.model.forEach((value, key) => {
      config[key] = [
        value.in ? { in: value.in.map(item => item.name) } : { in: [] },
        value.notin ? { in: value.notin.map(item => item.name) } : { notin: [] }
      ];
    });
    console.log(config);
  }
}

//   private dictionaries = [
//     'source_vocabulary',
//     'target_vocabulary',
//     'source_concept_class',
//     'target_concept_class',
//     'target_domain'
//   ];
