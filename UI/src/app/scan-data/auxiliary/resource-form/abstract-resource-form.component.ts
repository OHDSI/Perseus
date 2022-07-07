import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConnectionResult } from '@models/white-rabbit/connection-result';
import { merge, Subject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@shared/base/base.component';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { ConnectionErrorPopupComponent } from '../connection-error-popup/connection-error-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { dbTypesRequireSchema, defaultPorts } from '../../scan-data.constants';

@Component({
  template: ''
})
export abstract class AbstractResourceFormComponent extends BaseComponent implements OnInit {

  tryConnect = false;

  form: FormGroup;

  @Input()
  dataType: string;

  @Input()
  dbSettings: DbSettings;

  dataTypes: string[];

  connectionResult: ConnectionResult;

  requireSchema = false;

  formControlNames = [
    'server', 'port', 'user', 'password', 'database', 'schema'
  ];

  protected dataTypeChange$ = new Subject<string>();

  protected constructor(protected formBuilder: FormBuilder,
                        protected matDialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.checkDataTypeChange();
  }

  abstract onTestConnection(): void;

  abstract createForm(disabled: boolean): FormGroup;

  onDataTypeChange(value: string) {
    this.setDefaultPort(value);
    this.dataType = value;
    this.dataTypeChange$.next(value);
  }

  subscribeFormChange(): void {
    const subscription = merge(this.form.valueChanges, this.dataTypeChange$)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.connectionResult = null;
        subscription.unsubscribe();
      });
  }

  protected checkDataTypeChange() {
    this.dataTypeChange$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        const requireSchema = dbTypesRequireSchema.includes(this.dataType);
        const schemaControl = this.form.get('schema');

        if (requireSchema) {
          schemaControl.setValidators([ Validators.required ]);
        } else {
          schemaControl.setValidators([]);
        }
        schemaControl.updateValueAndValidity();

        // After checked child forms
        setTimeout(() => {
          this.requireSchema = requireSchema;
        });
      });
  }

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

  protected showErrorPopup(message: string): void {
    this.matDialog.open(ConnectionErrorPopupComponent, {
      width: '502',
      height: '358',
      disableClose: true,
      panelClass: 'scan-data-dialog',
      data: message
    });
  }

  protected setDefaultPort(dbType: string) {
    const defaultPort = defaultPorts[dbType];
    if (defaultPort) {
      const portControl = this.form.get('port');
      if (portControl) {
        portControl.setValue(defaultPort);
      }
    }
  }

  private initForm() {
    const disabled = !this.dataType;
    const formValue = this.dbSettings;

    this.requireSchema = dbTypesRequireSchema.includes(this.dataType);
    this.form = this.createForm(disabled);
    this.subscribeOnDataTypeChange(this.form, this.formControlNames);
    this.form.patchValue(formValue);
  }
}
