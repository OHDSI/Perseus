import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { DictionaryItem } from '../../vocabulary-search-select/model/vocabulary';

@Component({
  selector: 'app-vocabulary-block',
  templateUrl: './vocabulary-block.component.html',
  styleUrls: ['./vocabulary-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VocabularyBlockComponent implements OnInit, OnChanges {
  @Input() vocabularyconfig: VocabularyBlock;
  @Output() value = new EventEmitter<VocabularyBlock>();

  private result: VocabularyBlock;

  constructor() {
    this.result = {};
  }

  ngOnInit() {

  }

  ngOnChanges() {

  }

  conditionIn(event: DictionaryItem[]) {
    this.result.in = event;
    this.value.emit(this.result);
  }

  conditionNotIn(event: DictionaryItem[]) {
    this.result.notin = event;
    this.value.emit(this.result);
  }
}

export interface VocabularyBlock {
  key?: string;
  name?: string;
  in?: DictionaryItem[];
  notin?: DictionaryItem[];
}
