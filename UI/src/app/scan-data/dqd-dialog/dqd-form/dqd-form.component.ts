import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CdmBuilderService } from '../../../services/cdm-builder.service';
import { DbTypes } from '../../scan-data.constants';
import { ConnectionResult } from '../../model/connection-result';
import { CdmSettings } from '../../model/cdm-settings';
import { finalize } from 'rxjs/operators';
import { adaptDbSettingsForDestination } from '../../util/cdm-adapter';
import { ConnectionErrorPopupComponent } from '../../shared/connection-error-popup/connection-error-popup.component';
import { DbSettings } from '../../model/db-settings';
import { DqdConnectionSettingsStateService } from '../../../services/dqd-connection-settings-state.service';

@Component({
  selector: 'app-dqd-form',
  templateUrl: './dqd-form.component.html',
  styleUrls: [
    './dqd-form.component.scss',
    '../../styles/scan-data-buttons.scss',
    '../../styles/scan-data-normalize.scss',
    '../../styles/scan-data-connect-form.scss',
    '../../styles/scan-data-form.scss',
  ]
})
export class DqdFormComponent implements OnInit, OnDestroy {

  form: FormGroup;

  formControlNames = [];

  dataTypes = [
    DbTypes.SQL_SERVER
  ];

  connectionResult: ConnectionResult;

  tryConnect = false;

  @Output()
  check = new EventEmitter<DbSettings>();

  @Output()
  cancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder,
              private matDialog: MatDialog,
              private cdmBuilderService: CdmBuilderService,
              private stateService: DqdConnectionSettingsStateService) {
  }

  get isCheckAndTestButtonDisabled() {
    return !this.form.valid;
  }

  ngOnInit() {
    this.initForm();

    this.loadState();
  }

  ngOnDestroy(): void {
    this.saveState();
  }

  onTestConnection(): void {
    this.tryConnect = true;

    const dbSettings = adaptDbSettingsForDestination(this.form.value) as CdmSettings;

    this.cdmBuilderService.testDestinationConnection(dbSettings)
      .pipe(
        finalize(() => this.tryConnect = false)
      )
      .subscribe(
        result => this.connectionResult = result,
        error => {
          this.connectionResult = {
            canConnect: false,
            message: error.error,
          };
          this.showErrorPopup(this.connectionResult.message);
        }
      );
  }

  onCheck(): void {
    this.check.emit(this.form.value);
  }

  onCancel() {
    this.cancel.emit();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      dbType: [null, [Validators.required]],
      server: [null, [Validators.required]],
      user: [null, [Validators.required]],
      password: [null, [Validators.required]],
      database: [null, [Validators.required]],
      schema: [null, [Validators.required]],
      port: [null]
    });
  }

  private showErrorPopup(message: string): void {
    this.matDialog.open(ConnectionErrorPopupComponent, {
      width: '502',
      height: '358',
      disableClose: true,
      panelClass: 'scan-data-dialog',
      data: message
    });
  }

  private loadState() {
    // this.form.patchValue({
    //   dbType: DbTypes.SQL_SERVER,
    //   server: '822JNJ16S03V',
    //   user: 'cdm_builder',
    //   password: 'builder1!',
    //   database: 'CDM_CPRD',
    //   schema: 'dbo',
    //   port: '1433'
    // });

    this.form.patchValue(this.stateService.state);
  }

  private saveState() {
    this.stateService.state = this.form.value;
  }
}
