import {
  Component,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  Inject,
  Input,
  ViewChild
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  SqlFunctionDefinition,
  SqlFunction
} from './model/sql-string-functions';
import { Observable, of } from 'rxjs';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from '@angular/material';
import { SqlFunctionsInjector } from '../model/sql-functions-injector';
import { isString } from 'src/app/infrastructure/utility';
import { sqlParametersValidator } from './model/sql-function-validator';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-transformation-input',
  templateUrl: './transformation-input.component.html',
  styleUrls: ['./transformation-input.component.scss']
})
export class TransformationInputComponent implements OnInit, OnChanges {
  @ViewChild(MatAutocomplete) autocomplete: MatAutocomplete;

  @Input() columnname: string;
  @Input() transform: SqlFunction;

  @Output() apply = new EventEmitter<SqlFunction>();

  selector: FormControl;
  editor: FormControl;

  filteredOptions: Observable<any[]>;
  criteria = new SqlFunction();

  constructor(
    @Inject(SqlFunctionsInjector)
    private sqlFunctions: Array<SqlFunction>
  ) {
    this.selector = new FormControl();

    this.editor = new FormControl('', [
      Validators.required,
      sqlParametersValidator(/\((.*)\)/)
    ]);
  }

  ngOnInit() {
    this.filteredOptions = this.selector.valueChanges.pipe(
      startWith(''),
      map(value =>
        typeof value === 'string' ? value : value ? value.name : null
      ),
      map(name => (name ? this._filter(name) : this.sqlFunctions.slice()))
    );

    // tslint:disable-next-line:no-string-literal
    this.editor['criteria'] = this.criteria;

    this.editor.valueChanges.subscribe(value => {
      if (isString(value)) {
        // tslint:disable-next-line:no-string-literal
        this.editor['criteria'] = this.criteria;
        const regex = /\((.*)\)/;
        const parametersParsed = value.match(regex);
        let parameters = parametersParsed
          ? parametersParsed[1].split(',')
          : null;
        if (parameters) {
          parameters = this.clearParamters(parameters);
          // Save value position
          const valueIndex = this.criteria.valueIndex;
          const valueSave = this.criteria.parameters[valueIndex];

          this.criteria.displayParameters = parameters;

          // Restore value position
          this.criteria.displayParameters[valueIndex] = valueSave;
        }
      }
    });
  }

  private clearParamters(parameters: string[]): string[] {
    return parameters.map(p => p.replace(/'/g, '').trim());
  }

  private _filter(name: string): SqlFunctionDefinition[] {
    const filterValue = name.toLowerCase();

    return this.sqlFunctions.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayFn(definition: any): string | undefined {
    return definition ? definition.name : undefined;
  }

  ngOnChanges() {
    this.criteria = this.transform;
    this.selector.setValue(this.transform);
    this.editor.setValue(this.criteria.getTemplate(this.columnname));
  }

  selectTransform(event: MatAutocompleteSelectedEvent) {
    const transform: SqlFunction = event.option.value;
    this.criteria = new SqlFunction(transform);

    this.editor.setValue(this.criteria.getTemplate(this.columnname));

    this.apply.emit(this.criteria);
  }

  onEnterPressed(value: SqlFunction) {
    this.apply.emit(this.criteria);
  }

  clearEditor(): void {
    this.editor.reset();
    this.selector.reset();
    this.criteria = new SqlFunction();
  }

  clearSelector(): void {
    this.selector.reset();
    this.editor.reset();
  }

  getErrorMessage() {
    return this.editor.hasError('required')
      ? 'You must enter sql function'
      : this.editor.hasError('parameters')
      ? 'Paramters are incorrect'
      : '';
  }
}
