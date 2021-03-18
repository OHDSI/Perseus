import { VocabularyBlock } from '../concept-config/vocabulary-block/vocabulary-block.component';
import { DictionaryItem } from '../../vocabulary-dropdown/model/vocabulary';
import { IVocabulary } from 'src/app/services/vocabularies.service';

export class ConceptConfig {
  get asArray(): VocabularyBlock[] {
    return Array.from(this.model.values()).sort((a, b) => (a.order - b.order));
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
    vocabulary: IVocabulary,
    order: number
  ) {
    if (!vocabulary) {
      return;
    }
    const config: VocabularyBlock = {
      key,
      name: configurationName,
      in: vocabulary.payload.map(item => new DictionaryItem(item)),
      notin: vocabulary.payload.map(item => new DictionaryItem(item)),
      order
    };

    if (this.model.has(key)) {
      this.model.delete(key);
    }

    this.model.set(key, config);
  }

  updateVocabularyBlock(block: VocabularyBlock) {
    if (this.model.has(block.key)) {
      this.model.delete(block.key);
    }

    this.model.set(block.key, block);
  }

  serialize() {
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
