import {
  Component,
  OnInit,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { SQL_STRING_FUNCTIONS } from './model/sql-string-functions';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ValuesPopupComponent } from '../../values-popup/values-popup.component';

@Component({
  selector: 'app-transformation-input',
  templateUrl: './transformation-input.component.html',
  styleUrls: ['./transformation-input.component.scss']
})
export class TransformationInputComponent implements OnInit, OnChanges {
  @Output() apply = new EventEmitter<string>();

  formControl: FormControl;
  sqlFunctions = SQL_STRING_FUNCTIONS;
  filteredOptions: Observable<string[]>;
  criteria = '';

  constructor() {
    this.formControl = new FormControl();
  }

  ngOnInit() {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => value || ''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.sqlFunctions.slice()))
    );
  }

  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();

    return this.sqlFunctions.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  ngOnChanges() {
    this.formControl.setValue(this.criteria);
  }

  applyTransform(event: MatAutocompleteSelectedEvent) {
    this.criteria = event.option.value;
    this.apply.emit(event.option.value);
  }

  onEnterPressed(value: string) {
    this.criteria = value;
  }

  clear(): void {
    this.formControl.reset();
    this.criteria = '';
  }
}
