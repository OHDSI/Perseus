import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { DictionaryItem } from './model/vocabulary';
import { BaseComponent } from '../base/base.component';
import { takeUntil } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-vocabulary-dropdown',
  templateUrl: './vocabulary-dropdown.component.html',
  styleUrls: ['./vocabulary-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VocabularyDropdownComponent extends BaseComponent
  implements OnInit, OnChanges {
  @Input() vocabulary: DictionaryItem[];
  @Input() ismultipe = true;
  @Output() value = new EventEmitter<DictionaryItem>();

  dictionary: DictionaryItem[];
  vocabularySelect: FormControl = new FormControl();
  vocabularyFilter: FormControl = new FormControl();

  filteredVocabularyItems: ReplaySubject<DictionaryItem[]> = new ReplaySubject<
    DictionaryItem[]
  >(1);

  ngOnInit() {
    if (this.vocabulary) {
      this.filteredVocabularyItems.next(this.vocabulary.slice());
    }

    this.vocabularyFilter.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.filter();
      });
  }

  ngOnChanges() {
    if (this.vocabulary) {
      this.filteredVocabularyItems.next(this.vocabulary.slice());
    }
  }

  onValueSelected(event: MatSelectChange) {
    this.value.emit(event.value);
  }

  private filter() {
    if (!this.dictionary) {
      return;
    }

    let search = this.vocabularyFilter.value;
    if (!search) {
      this.filteredVocabularyItems.next(this.dictionary.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredVocabularyItems.next(
      this.dictionary.filter(
        vocabulary => vocabulary.name.toLowerCase().indexOf(search) > -1
      )
    );
  }
}
