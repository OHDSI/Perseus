import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { DictionaryItem } from './model/vocabulary';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { BaseComponent } from '../../base/base.component';

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

  @ViewChild(MatSelect, { static: true }) matselect: MatSelect;

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

    if (this.selected) {
      if (this.ismultipe) {
        this.vocabularySelect.setValue(this.selected);
        this.matselect.writeValue(this.selected);
      } else {
        this.vocabularySelect.setValue(this.selected[0]);
        this.matselect.writeValue(this.selected[0]);
      }
    }
  }

  onValuesSelected(open: any) {
    if (!open) {
      this.value.emit(this.vocabularySelect.value);
    }
  }

  compareFunction(o1: DictionaryItem, o2: DictionaryItem): boolean {
    return o1 && o2 ? o1.name === o2.name : o1 === o2;
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
