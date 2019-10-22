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

@Component({
  selector: 'app-vocabulary-dropdown',
  templateUrl: './vocabulary-dropdown.component.html',
  styleUrls: ['./vocabulary-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VocabularyDropdownComponent extends BaseComponent
  implements OnInit, OnChanges {
  @Input() selected: DictionaryItem[];
  @Input() vocabulary: DictionaryItem[];
  @Input() ismultipe = true;
  @Input() showDefaultOption = false;
  @Output() value = new EventEmitter<DictionaryItem[]>();

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

    if (this.selected) {
      this.vocabularySelect.setValue(this.selected);
    }
  }

  ngOnChanges() {
    if (this.vocabulary) {
      this.filteredVocabularyItems.next(this.vocabulary.slice());
    }
  }

  onValuesSelected(open: any) {
    if (!open) {
      this.value.emit(this.vocabularySelect.value);
    }
  }

  setValue(value: string) {
    const idx = this.vocabulary.findIndex(item => value === item.name);
    if (idx > -1) {
      this.selected = [this.vocabulary[idx]];
      this.vocabularySelect.setValue(this.vocabulary[idx]);
    }
  }

  private filter() {
    if (!this.vocabulary) {
      return;
    }

    let search = this.vocabularyFilter.value;
    if (!search) {
      this.filteredVocabularyItems.next(this.vocabulary.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredVocabularyItems.next(
      this.vocabulary.filter(
        vocabulary => vocabulary.name.toLowerCase().indexOf(search) > -1
      )
    );
  }
}
