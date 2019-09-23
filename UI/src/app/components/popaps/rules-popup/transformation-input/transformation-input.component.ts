import {
  Component,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  Inject,
  Input
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  SqlFunctionDefinition,
  SqlFunction
} from './model/sql-string-functions';
import { Observable, of } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { SqlFunctionsInjector } from '../model/sql-functions-injector';

@Component({
  selector: 'app-transformation-input',
  templateUrl: './transformation-input.component.html',
  styleUrls: ['./transformation-input.component.scss']
})
export class TransformationInputComponent implements OnInit, OnChanges {
  @Input() columnname: string;
  @Output() apply = new EventEmitter<SqlFunction>();

  get displayFn(): any {
    return (value: any) => this._displayFn(value, this.columnname);
  }

  formControl: FormControl;
  filteredOptions: Observable<any[]>;
  criteria = new SqlFunction();

  constructor(
    @Inject(SqlFunctionsInjector)
    private sqlFunctions: Array<SqlFunction>
  ) {
    this.formControl = new FormControl();
  }

  ngOnInit() {
    this.filteredOptions = of(this.sqlFunctions);
    // this.filteredOptions = this.formControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => {
    //     return value instanceof SqlFunction ? value : null
    //   }),
    //   map(value => {
    //     return value ? this._filter(value.name) : this.sqlFunctions.slice();
    //   })
    // );
  }


  _displayFn(definition: SqlFunction, columnName): string | undefined {
    return definition ? definition.getTemplate(columnName) : undefined;
  }

  private _filter(name: string): SqlFunctionDefinition[] {
    const filterValue = name.toLowerCase();

    return this.sqlFunctions.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  ngOnChanges() {
    this.formControl.setValue(this.criteria);
  }

  applyTransform(event: MatAutocompleteSelectedEvent) {
    const value: SqlFunction = event.option.value;
    this.criteria = value;
    this.formControl.setValue(this.criteria);
    this.apply.emit(this.criteria);
  }

  onEnterPressed(value: SqlFunction) {
    this.criteria = value;
  }

  clear(): void {
    this.formControl.reset();
    this.criteria = new SqlFunction();
  }
}
