import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConnectionResult } from '@models/white-rabbit/connection-result';
import { merge, Subject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@shared/base/base.component';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { ConnectionErrorPopupComponent } from '../connection-error-popup/connection-error-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { dbTypesRequireSchema, defaultPorts, dbTypesRequireDb, dbTypesRequireHTTPPath, dbTypesRequireUser } from '../../scan-data.constants';

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
  requireHTTPPath = false;
  requireDb = false;
  requireUser = false;

  formControlNames = [
    'server', 'port', 'user', 'password', 'database', 'schema', 'httppath'
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
        const requireDb = dbTypesRequireDb.includes(this.dataType);
        const requireHTTPPath = dbTypesRequireHTTPPath.includes(this.dataType);
        const requireUser = dbTypesRequireUser.includes(this.dataType);

        const schemaControl = this.form.get('schema');
        const dbControl = this.form.get('database');
        const httpControl = this.form.get('httppath');
        const userControl = this.form.get('user'); 

        if (schemaControl) {
          schemaControl.setValidators(requireSchema ? [ Validators.required ] : []);
          schemaControl.updateValueAndValidity();
        }

        if (dbControl) {
          if(this.dataType == 'Databricks') {
            dbControl.setValue('default');
          }
          else {
            dbControl.setValue('');
          }

          dbControl.setValidators(requireDb ? [ Validators.required ] : []);
          dbControl.updateValueAndValidity();
        }

        if (httpControl) {
          httpControl.setValidators(requireHTTPPath ? [ Validators.required ] : []);
          httpControl.updateValueAndValidity();
        }

        if (userControl) {
          if(this.dataType == 'Databricks') {
            userControl.setValue('token');
          }
          else {
            userControl.setValue('');
          }

          userControl.setValidators(requireUser ? [ Validators.required ] : []);
          userControl.updateValueAndValidity();
        }

        // After checked child forms
        setTimeout(() => {
          this.requireSchema = requireSchema;
          this.requireDb = requireDb;
          this.requireHTTPPath = requireHTTPPath;
          this.requireUser = requireUser;
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
    this.requireDb = dbTypesRequireDb.includes(this.dataType);
    
    this.form = this.createForm(disabled);
    this.subscribeOnDataTypeChange(this.form, this.formControlNames);
    this.form.patchValue(formValue);
  }
}
