import { Component, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SQL_STRING_FUNCTIONS } from './model/sql-string-functions';

@Component({
  selector: 'app-transformation-input',
  templateUrl: './transformation-input.component.html',
  styleUrls: ['./transformation-input.component.scss']
})
export class TransformationInputComponent implements OnInit, OnChanges {
  @Output() apply = new EventEmitter<string>();

  formControl: FormControl;
  sqlFunctions = SQL_STRING_FUNCTIONS;

  private criteria = '';

  constructor() {
    this.formControl = new FormControl();
  }

  ngOnInit() {
    this.formControl.valueChanges.subscribe(criteria => {
      this.criteria = criteria;
      this.apply.emit(this.criteria);
    });
  }

  ngOnChanges() {
    this.formControl.setValue(this.criteria);
  }

  applyTransform(textCriteria: string) {
    this.apply.emit(textCriteria);
  }

  clear(): void {
    this.formControl.reset();
    this.criteria = '';
  }
}
