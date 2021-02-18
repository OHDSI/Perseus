import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CdmBuilderService } from '../../../services/cdm-builder.service';
import { dqdDatabaseTypes } from '../../scan-data.constants';
import { CdmSettings } from '../../model/cdm-settings';
import { finalize, takeUntil } from 'rxjs/operators';
import { adaptDbSettingsForDestination } from '../../util/cdm-adapter';
import { DbSettings } from '../../model/db-settings';
import { DqdConnectionSettingsStateService } from '../../../services/dqd-connection-settings-state.service';
import { AbstractResourceForm } from '../../shared/resource-form/abstract-resource-form';

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
export class DqdFormComponent extends AbstractResourceForm implements OnInit, OnDestroy {

  formControlNames = ['server', 'port', 'user', 'password', 'database', 'schema'];

  dataTypes = dqdDatabaseTypes;

  @Output()
  check = new EventEmitter<DbSettings>();

  @Output()
  cancel = new EventEmitter<void>();

  constructor(formBuilder: FormBuilder,
              matDialog: MatDialog,
              private cdmBuilderService: CdmBuilderService,
              private stateService: DqdConnectionSettingsStateService) {
    super(formBuilder, matDialog);
  }

  get isCheckAndTestButtonDisabled() {
    return !this.form.valid;
  }

  ngOnInit() {
    this.loadState();

    super.ngOnInit();

    this.form.get('dbType').valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.dataType = value;
        this.onDataTypeChange(value);
      });
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
        result => {
          this.connectionResult = result;
          this.subscribeFormChange();
        },
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

  createForm(disabled): FormGroup {
    const schemaValidators = this.requireSchema ? [Validators.required] : [];

    return  this.formBuilder.group({
      dbType: [null, [Validators.required]],
      port: [{value: null, disabled}],
      server: [{value: null, disabled}, [Validators.required]],
      user: [{value: null, disabled}, [Validators.required]],
      password: [{value: null, disabled}, [Validators.required]],
      database: [{value: null, disabled}, [Validators.required]],
      schema: [{value: null, disabled}, schemaValidators]
    });
  }

  private loadState() {
    this.dbSettings = this.stateService.state;
    this.dataType = this.dbSettings.dbType;
  }

  private saveState() {
    this.stateService.state = this.form.value;
  }
}
