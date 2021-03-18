import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { DictionaryItem } from '../../../vocabulary-dropdown/model/vocabulary';

@Component({
  selector: 'app-vocabulary-block',
  templateUrl: './vocabulary-block.component.html',
  styleUrls: ['./vocabulary-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VocabularyBlockComponent implements OnInit, OnChanges {
  @Input() vocabularyconfig: VocabularyBlock;
  @Output() value = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {}

  conditionIn(event: DictionaryItem[]) {
    this.vocabularyconfig.selectedin = event;
    this.value.emit(this.vocabularyconfig);
  }

  conditionNotIn(event: DictionaryItem[]) {
    this.vocabularyconfig.selectednotin = event;
    this.value.emit(this.vocabularyconfig);
  }
}

export interface VocabularyBlock {
  key: string;
  name?: string;
  in: DictionaryItem[];
  notin: DictionaryItem[];
  selectedin?: DictionaryItem[];
  selectednotin?: DictionaryItem[];
  order: number;
}
