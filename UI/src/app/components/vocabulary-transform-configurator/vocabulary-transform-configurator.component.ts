import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IVocabulary } from 'src/app/services/vocabularies.service';
import { VocabularyConfiguration } from './vocabulary-configuration/vocabulary-configuration.component';
import { Command } from 'src/app/infrastructure/command';
import { DictionaryItem } from '../vocabulary-search-select/model/vocabulary';

@Component({
  selector: 'app-vocabulary-transform-configurator',
  templateUrl: './vocabulary-transform-configurator.component.html',
  styleUrls: ['./vocabulary-transform-configurator.component.scss']
})
export class VocabularyTransformConfiguratorComponent
  implements OnInit, OnChanges {
  @Input() vocabularies: IVocabulary[];

  @Input() lookups: IVocabulary = {
    name: 'Available lokups',
    payload: ['First', 'second']
  };

  lookupname = '';
  configurations: VocabularyConfiguration[] = [];

  private lookupConfig: LookupConfig = new LookupConfig('default');

  save = new Command({
    execute: () => {},
    canExecute: () => true
  });

  delete = new Command({
    execute: () => {},
    canExecute: () => true
  });

  close = new Command({
    execute: () => {},
    canExecute: () => true
  });

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.vocabularies) {
      this.lookupConfig = new LookupConfig(this.lookupname);
      this.lookupConfig.addVocabularyConfig(
        'source_vocabulary',
        'Source Vocabulary',
        this.findVocabulary('lookup')
      );
      this.lookupConfig.addVocabularyConfig(
        'target_vocabulary',
        'Target Vocabulary',
        this.findVocabulary('lookup')
      );
      this.lookupConfig.addVocabularyConfig(
        'source_concept_class',
        'Source Concept Class',
        this.findVocabulary('concept')
      );
      this.lookupConfig.addVocabularyConfig(
        'target_concept_class',
        'Target Concept Class',
        this.findVocabulary('concept')
      );
      this.lookupConfig.addVocabularyConfig(
        'target_domain',
        'Target Domain',
        this.findVocabulary('domain')
      );

      this.configurations = this.lookupConfig.asArray;
    }
  }

  findVocabulary(name: string): IVocabulary {
    const idx = this.vocabularies.findIndex(v => v.name === name);
    if (idx > -1) {
      return this.vocabularies[idx];
    } else {
      return null;
    }
  }

  sourceVocabulary(event: VocabularyConfiguration) {
    const key = 'source_vocabulary';
    // this.updateModel(key, event);
  }

  onLookupSelected(vocabulary: IVocabulary) {
    if (typeof vocabulary === 'undefined') {
      this.lookupname = '';

      // TODO Reset all configurations
    }
    this.lookupname = vocabulary.name;
  }
}

export class LookupConfig {
  get asArray(): VocabularyConfiguration[] {
    return Array.from(this.model.values());
  }

  name: string;

  private model = new Map<string, VocabularyConfiguration>();

  constructor(name: string) {
    this.name = name;
  }

  get(key: string): VocabularyConfiguration {
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
    const config: VocabularyConfiguration = {
      key,
      name: configurationName,
      in: vocabulary.payload.map(item => new DictionaryItem(item)),
      notin: vocabulary.payload.map(item => new DictionaryItem(item))
    };
    this.updateConfiguration(key, config);
  }

  updateConfiguration(key: string, value: VocabularyConfiguration) {
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
