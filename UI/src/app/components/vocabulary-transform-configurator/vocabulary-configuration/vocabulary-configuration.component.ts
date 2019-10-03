import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IVocabulary } from 'src/app/services/vocabularies.service';
import { DictionaryItem } from '../../vocabulary-search-select/model/vocabulary';

@Component({
  selector: 'app-vocabulary-configuration',
  templateUrl: './vocabulary-configuration.component.html',
  styleUrls: ['./vocabulary-configuration.component.scss']
})
export class VocabularyConfigurationComponent implements OnInit {
  @Input() name: string;
  @Input() vocabulary: IVocabulary;
  @Output() value = new EventEmitter<VocabularyConfiguration>();

  private result: VocabularyConfiguration;

  constructor() {
    this.result = {};
  }

  ngOnInit() {}

  conditionIn(event: DictionaryItem[]) {
    this.result.in = event;
    this.value.emit(this.result);
  }

  conditionNotIn(event: DictionaryItem[]) {
    this.result.notin = event;
    this.value.emit(this.result);
  }
}

export interface VocabularyConfiguration {
  in?: DictionaryItem[];
  notin?: DictionaryItem[];
}
