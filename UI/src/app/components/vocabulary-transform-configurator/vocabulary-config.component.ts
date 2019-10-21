import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IVocabulary } from 'src/app/services/vocabularies.service';
import { Command } from 'src/app/infrastructure/command';
import { ConceptConfig } from './model/config-concept';
import { VocabularyConfig } from './model/vocabulary-config';
import { cloneDeep } from 'src/app/infrastructure/utility';
import { DictionaryItem } from '../vocabulary-search-select/model/vocabulary';
import { MatSnackBar } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-vocabulary-config',
  templateUrl: './vocabulary-config.component.html',
  styleUrls: ['./vocabulary-config.component.scss']
})
export class VocabularyConfigComponent implements OnInit, OnChanges {
  @Input() vocabularies: IVocabulary[];
  @Input() sourcefields: string[] = [];
  @Input() lookups: any[];

  get availableLookups(): DictionaryItem[] {
    return this.availablelookups;
  }

  lookupnameControl = new FormControl();

  vocabularyConfig: VocabularyConfig;
  private configs: VocabularyConfig[] = [];
  private availablelookups: DictionaryItem[];

  constructor(private snakbar: MatSnackBar) {
    this.lookups = [];
  }

  save = new Command({
    execute: () => {
      const configCopy = cloneDeep(this.vocabularyConfig);

      this.configs.push(configCopy);
      this.lookups.push({
        name: this.lookupnameControl.value,
        payload: configCopy
      });

      this.updateAvailableLookups();

      this.snakbar.open(
        `Lookup "${this.lookupnameControl.value}" has been added`,
        ' DISMISS ',
        { duration: 3000 }
      );

      this.lookupnameControl.reset();
    },
    canExecute: () => {
      return this.lookupnameControl.valid;
    }
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
      this.vocabularyConfig = new VocabularyConfig(this.vocabularies);

      this.updateAvailableLookups();
    }
  }

  updateAvailableLookups() {
    const hash = new Set<string>();
    this.lookups.forEach(e => {
      hash.add(e.name);
    });

    this.availablelookups = Array.from(hash.values()).map(
      e => new DictionaryItem(e)
    );
  }

  onLookupSelected(vocabulary: IVocabulary) {
    // TODO Error Save and Load configuration
    if (!this.lookupnameControl.valid && !vocabulary) {
      return;
    } else if (vocabulary) {
      this.lookupnameControl.setValue(vocabulary.name);
      const index = this.lookups.findIndex(l => l.name === vocabulary.name);
      if (index > -1) {
        this.vocabularyConfig = cloneDeep(this.lookups[index].payload);
      }
    }
  }

  onSourceFieldSelected(event: any) {}

  outConfigHandler(event: ConceptConfig) {
    console.log(event);
  }
}
