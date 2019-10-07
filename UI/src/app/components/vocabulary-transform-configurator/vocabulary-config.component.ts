import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IVocabulary } from 'src/app/services/vocabularies.service';
import { VocabularyBlock } from './vocabulary-block/vocabulary-block.component';
import { Command } from 'src/app/infrastructure/command';
import { ConceptConfig } from './model/config-concept';
import { cloneDeep } from 'src/app/infrastructure/utility';
import { VocabularyConfig } from './model/vocabulary-config';

@Component({
  selector: 'app-vocabulary-config',
  templateUrl: './vocabulary-config.component.html',
  styleUrls: ['./vocabulary-config.component.scss']
})
export class VocabularyConfigComponent implements OnInit, OnChanges {
  @Input() vocabularies: IVocabulary[];

  @Input() lookups: IVocabulary = {
    name: 'Available lokups',
    payload: ['First', 'second']
  };

  get conceptConfig(): ConceptConfig {
    return this.vacabularyConfig.conceptConfig;
  }

  get sourceConceptConfig(): ConceptConfig {
    return this.vacabularyConfig.sourceConceptConfig;
  }

  constructor() {}

  lookupname = '';
  private vacabularyConfig: VocabularyConfig;

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

  ngOnInit() {}

  ngOnChanges() {
    if (this.vocabularies) {
      this.vacabularyConfig = new VocabularyConfig(
        this.lookupname,
        this.vocabularies
      );
    }
  }

  onLookupSelected(vocabulary: IVocabulary) {
    if (typeof vocabulary === 'undefined') {
      this.lookupname = '';

      // TODO Reset all configurations
    }
    this.lookupname = vocabulary.name;
  }
}
