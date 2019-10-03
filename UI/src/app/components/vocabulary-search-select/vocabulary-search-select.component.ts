import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { DictionaryItem } from './model/vocabulary';
import { BaseComponent } from '../base/base.component';
import { takeUntil } from 'rxjs/operators';
import { IVocabulary } from 'src/app/services/vocabularies.service';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-vocabulary-search-select',
  templateUrl: './vocabulary-search-select.component.html',
  styleUrls: ['./vocabulary-search-select.component.scss']
})
export class VocabularySearchSelectComponent extends BaseComponent implements OnInit {
  @Input() vocabulary: IVocabulary;
  @Output() value = new EventEmitter<DictionaryItem>();

  dicrionary: DictionaryItem[];
  vocabularySelect: FormControl = new FormControl();
  vocabularyFilter: FormControl = new FormControl();

  filteredVocabularyItems: ReplaySubject<DictionaryItem[]> = new ReplaySubject<DictionaryItem[]>(1);

  ngOnInit() {
    this.dicrionary = this.vocabulary.payload.map(v => new DictionaryItem(v));

    this.filteredVocabularyItems.next(this.dicrionary.slice());

    this.vocabularyFilter.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.filter();
      });
  }

  onValueSelected(event: MatSelectChange) {
    this.value.emit(event.value);
  }

  private filter() {
    if (!this.dicrionary) {
      return;
    }

    let search = this.vocabularyFilter.value;
    if (!search) {
      this.filteredVocabularyItems.next(this.dicrionary.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredVocabularyItems.next(
      this.dicrionary.filter(vocabulary => vocabulary.name.toLowerCase().indexOf(search) > -1)
    );
  }

  //this.value.emit(this.vocabularySelect.value);
}
