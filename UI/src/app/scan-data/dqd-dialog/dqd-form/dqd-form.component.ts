import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { dqdDatabaseTypes } from '../../scan-data.constants';
import { finalize, takeUntil } from 'rxjs/operators';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { DataQualityCheckStateService } from '@services/data-quality-check/data-quality-check-state.service';
import { AbstractResourceFormComponent } from '../../auxiliary/resource-form/abstract-resource-form.component';
import { DataQualityCheckService } from '@services/data-quality-check/data-quality-check.service'
import { parseHttpError } from '@utils/error'
import { Subscription } from 'rxjs'

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
export class DqdFormComponent extends AbstractResourceFormComponent implements OnInit, OnDestroy {

  formControlNames = ['server', 'port', 'user', 'password', 'database', 'schema', 'httppath'];

  dataTypes = dqdDatabaseTypes;

  @Input()
  loading: boolean

  @Output()
  check = new EventEmitter<DbSettings>();

  @Output()
  cancel = new EventEmitter<void>();

  testConnectionSub: Subscription;

  constructor(formBuilder: FormBuilder,
              matDialog: MatDialog,
              private dqdService: DataQualityCheckService,
              private stateService: DataQualityCheckStateService) {
    super(formBuilder, matDialog);
  }

  get isCheckAndTestButtonDisabled() {
    return this.tryConnect || !this.form.valid || this.loading;
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
    const dbSettings = this.form.value as DbSettings;
    this.form.disable();

    this.testConnectionSub = this.dqdService.testConnection(dbSettings)
      .pipe(
        finalize(() => {
          this.tryConnect = false;
          this.form.enable({emitEvent: false});
        })
      )
      .subscribe(
        result => {
          this.connectionResult = result;
          if (this.connectionResult.canConnect) {
            this.subscribeFormChange();
          } else {
            this.showErrorPopup(this.connectionResult.message);
          }
        },
        error => {
          this.connectionResult = {
            canConnect: false,
            message: parseHttpError(error),
          };
          this.showErrorPopup(this.connectionResult.message);
        }
      );
  }

  onCancelTestConnection(): void {
    this.testConnectionSub.unsubscribe()
  }

  onCheck(): void {
    this.check.emit(this.form.value);
  }

  onCancel() {
    this.cancel.emit();
  }

  createForm(disabled): FormGroup {
    const schemaValidators = this.requireSchema ? [Validators.required] : [];
    const dbValidators = this.requireDb ? [Validators.required] : [];
    const httppathValidators = this.requireHTTPPath ? [Validators.required] : [];
    const userValidators = this.requireUser ? [Validators.required] : [];
    
    return  this.formBuilder.group({
      dbType: [null, [Validators.required]],
      server: [{value: null, disabled}, [Validators.required]],
      port: [{value: null, disabled}, [Validators.required]],
      user: [{value: null, disabled}, userValidators],
      httppath: [{value: null, disabled}, httppathValidators],
      password: [{value: null, disabled}, [Validators.required]],
      database: [{value: null, disabled}, dbValidators],
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
