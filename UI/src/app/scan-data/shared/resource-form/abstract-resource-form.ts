import { FormBuilder, FormGroup } from '@angular/forms';
import { ConnectionResult } from '../../model/connection-result';
import { Subject } from 'rxjs/internal/Subject';
import { Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base/base.component';
import { DbSettings } from '../../model/db-settings';
import { ConnectionErrorPopupComponent } from '../connection-error-popup/connection-error-popup.component';
import { MatDialog } from '@angular/material/dialog';

export abstract class AbstractResourceForm extends BaseComponent implements OnInit {

  tryConnect = false;

  form: FormGroup;

  @Input()
  dataType: string;

  @Input()
  dbSettings: DbSettings;

  dataTypes: string[];

  connectionResult: ConnectionResult;

  abstract formControlNames: string[];

  protected dataTypeChange$ = new Subject<string>();

  protected constructor(protected formBuilder: FormBuilder, protected matDialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  abstract onTestConnection(): void;

  abstract createForm(disabled: boolean): FormGroup;

  onDataTypeChange(value: string) {
    this.dataType = value;
    this.dataTypeChange$.next(value);
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

  private initForm() {
    const disabled = !this.dataType;
    const formValue = this.dbSettings;

    this.form = this.createForm(disabled);

    this.subscribeOnDataTypeChange(this.form, this.formControlNames);
    this.form.patchValue(formValue);
  }
}
