import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IVocabulary } from 'src/app/services/vocabularies.service';
import { Command } from 'src/app/infrastructure/command';
import { ConceptConfig } from './model/config-concept';
import { VocabularyConfig } from './model/vocabulary-config';
import { cloneDeep } from 'src/app/infrastructure/utility';
import { DictionaryItem } from '../vocabulary-search-select/model/vocabulary';

@Component({
  selector: 'app-vocabulary-config',
  templateUrl: './vocabulary-config.component.html',
  styleUrls: ['./vocabulary-config.component.scss']
})
export class VocabularyConfigComponent implements OnInit, OnChanges {
  @Input() vocabularies: IVocabulary[];

  @Input() lookups: any[] = [
    {
      name: 'default',
      payload: new VocabularyConfig('default', [])
    }
  ];

  get availableLookups(): DictionaryItem[] {
    return this.availablelookups;
  }

  get conceptConfig(): ConceptConfig {
    return this.vocabularyConfig.conceptConfig;
  }

  get sourceConceptConfig(): ConceptConfig {
    return this.vocabularyConfig.sourceConceptConfig;
  }

  constructor() {}

  lookupname = '';
  private vocabularyConfig: VocabularyConfig;
  private configs: VocabularyConfig[] = [];
  private availablelookups: DictionaryItem[];

  save = new Command({
    execute: () => {
      this.configs.push(this.vocabularyConfig);
      this.lookups.push({
        name: this.lookupname,
        payload: this.vocabularyConfig
      });

      this.updateAvailableLokkups();
    },
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

  ngOnInit() {}

  ngOnChanges() {
    if (this.vocabularies) {
      this.vocabularyConfig = new VocabularyConfig(
        this.lookupname,
        this.vocabularies
      );

      this.updateAvailableLokkups();
    }
  }

  updateAvailableLokkups() {
    this.availablelookups = this.lookups
        ? [...this.lookups.map(l => new DictionaryItem(l.name))]
        : [];
  }

  onLookupSelected(vocabulary: IVocabulary) {
    if (typeof vocabulary === 'undefined') {
      this.lookupname = '';

      // TODO Reset all configurations
    }
    this.lookupname = vocabulary.name;
    const index = this.lookups.findIndex(l => l.name === vocabulary.name);
    if (index > -1) {
      this.vocabularyConfig = cloneDeep(this.lookups[index].payload);
    }
  }
}
