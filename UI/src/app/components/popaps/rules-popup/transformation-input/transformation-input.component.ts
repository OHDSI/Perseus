import {
  Component,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  Inject,
  Input
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  SqlFunctionDefinition,
  SqlFunction
} from './model/sql-string-functions';
import { Observable, of } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { SqlFunctionsInjector } from '../model/sql-functions-injector';
import { isString } from 'src/app/infrastructure/utility';
import { sqlParametersValidator } from './model/sql-function-validator';

@Component({
  selector: 'app-transformation-input',
  templateUrl: './transformation-input.component.html',
  styleUrls: ['./transformation-input.component.scss']
})
export class TransformationInputComponent implements OnInit, OnChanges {
  @Input() columnname: string;
  @Input() transfrom: SqlFunction;

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
    this.formControl = new FormControl('', [
      Validators.required,
      sqlParametersValidator(/\((.*)\)/)
    ]);
  }

  ngOnInit() {
    this.filteredOptions = of(this.sqlFunctions);
    this.formControl['criteria'] = this.criteria;

    this.formControl.valueChanges.subscribe(value => {
      if (isString(value)) {
        this.formControl['criteria'] = this.criteria;
        const regex = /\((.*)\)/;
        const parametersParsed = value.match(regex);
        const parameters = parametersParsed
          ? parametersParsed[1].split(',')
          : null;
        if (parameters) {
          this.criteria.parameters = parameters;
        }
      }
    });
  }

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'You must enter sql function'
      : this.formControl.hasError('parameters')
      ? 'Paramters are incorrect'
      : '';
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

  selectTransform(event: MatAutocompleteSelectedEvent) {
    const value: SqlFunction = event.option.value;
    this.criteria = value;
    this.formControl.setValue(this.criteria);

    // Incorrect beravior. !Base sql function mutated by this class.
    this.apply.emit(this.criteria);
  }

  onEnterPressed(value: SqlFunction) {
    this.apply.emit(this.criteria);
  }

  clear(): void {
    this.formControl.reset();
    this.criteria = new SqlFunction();
  }
}
