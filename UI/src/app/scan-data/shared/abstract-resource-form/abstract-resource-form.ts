import { FormBuilder, FormGroup } from '@angular/forms';
import { ConnectionResult } from '../../model/connection-result';
import { Subject } from 'rxjs/internal/Subject';
import { Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base/base.component';
import { DbSettings } from '../../model/db-settings';

export abstract class AbstractResourceForm extends BaseComponent implements OnInit {

  connecting = false;

  form: FormGroup;

  @Input()
  dataType: string;

  dataTypes: string[];

  connectionResult: ConnectionResult;

  @Input()
  dbSettings: DbSettings;

  abstract formControlNames: string[];

  private dataTypeChange$ = new Subject<string>();

  protected constructor(protected formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  dataTypeChange(value: string) {
    this.dataType = value;
    this.dataTypeChange$.next(value);
  }

  private initForm() {
    const disabled = !this.dataType;
    const formValue = this.dbSettings;

    this.form = this.createForm(disabled);

    this.subscribeOnDataTypeChange(this.form, this.formControlNames);
    this.form.patchValue(formValue);
  }

  abstract createForm(disabled: boolean): FormGroup;

  protected subscribeOnDataTypeChange(form: FormGroup, controlNames: string[]) {
    const subscription = this.dataTypeChange$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(value => {
        if (value) {
          for (const name of controlNames) {
            form.get(name).enable();
          }
          subscription.unsubscribe();
        }
      });
  }
}
