import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, of } from 'rxjs';
import { DbSettings } from '../../../model/db-settings';
import { DelimitedTextFileSettings } from '../../../model/delimited-text-file-settings';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { ScanSettings } from '../../../model/scan-settings';
import { delimitedFiles, whiteRabbitDatabaseTypes } from '../../../scan-data.constants';
import { AbstractResourceForm } from '../../../shared/resource-form/abstract-resource-form';
import { MatDialog } from '@angular/material/dialog';
import { ScanDataService } from '../../../../services/white-rabbit/scan-data.service';
import { TableToScan } from '../../../model/table-to-scan';
import { ConnectionResult } from '../../../model/connection-result';
import { Subject } from 'rxjs/internal/Subject';
import { createDbConnectionForm } from '../../../util/form';

@Component({
  selector: 'app-connect-form',
  templateUrl: './connect-form.component.html',
  styleUrls: [
    './connect-form.component.scss',
    '../../../styles/scan-data-form.scss',
    '../../../styles/scan-data-step.scss',
    '../../../styles/scan-data-normalize.scss',
    '../../../styles/scan-data-connect-form.scss'
  ]
})
export class ConnectFormComponent extends AbstractResourceForm implements OnInit {

  // dbSettingsForm
  form: FormGroup;

  fileSettingsForm: FormGroup;

  @Input()
  fileSettings: DelimitedTextFileSettings;

  @Input()
  filesToScan: File[];

  @Input()
  correctConnectionSettingsLoaded: boolean;

  @Output()
  connectionPropsChanged = new EventEmitter<void>();

  @Output()
  tablesToScanChange = new EventEmitter<TableToScan[]>();

  @Output()
  connectionResultChange = new EventEmitter<ConnectionResult>();

  dataTypes = [
    ...delimitedFiles,
    ...whiteRabbitDatabaseTypes
  ];

  private filesChange$ = new Subject<File[]>();

  private testConnectionStrategies: { [key: string]: (settings: ScanSettings) => void } = {
    dbSettings: (settings: ScanSettings) => {
      const dbSettings = settings as DbSettings;
      dbSettings.dbType = this.dataType;

      this.tryConnect = true;

      this.whiteRabbitService.testConnection(dbSettings)
        .pipe(
          switchMap(connectionResult => {
            this.connectionResult = connectionResult;
            this.connectionResultChange.emit(connectionResult);
            if (connectionResult.canConnect) {
              this.subscribeFormChange();
              return this.whiteRabbitService.tablesInfo(dbSettings);
            } else {
              this.showErrorPopup(connectionResult.message);
              return of([]);
            }
          }),
          tap(() => {
            this.tryConnect = false;
          })
        )
        .subscribe(tablesToScan => {
          this.tablesToScanChange.emit(tablesToScan);
        }, error => {
          this.connectionResult = {canConnect: false, message: error.message};
          this.tablesToScanChange.emit([]);
          this.connectionResultChange.emit(this.connectionResult);
          this.tryConnect = false;
          this.showErrorPopup(this.connectionResult.message);
        });
    },

    fileSettings: (settings: ScanSettings) => {
      this.connectionResult = {canConnect: true, message: ''};
      this.subscribeFormChange();
      const tables = this.filesToScan
        .map(file => ({
          tableName: file.name,
          selected: true
        }));
      this.connectionResultChange.emit(this.connectionResult);
      this.tablesToScanChange.emit(tables);
    }
  };

  constructor(formBuilder: FormBuilder,
              matDialog: MatDialog,
              private whiteRabbitService: ScanDataService) {
    super(formBuilder, matDialog);
  }

  get fileInputText() {
    const result = this.filesToScan
      .map(file => file.name)
      .join(', ');

    const maxLength = 37;
    return result.length > maxLength ? result.substring(0, maxLength) + '...' : result;
  }

  get isDbSettings() {
    if (!this.dataType) {
      return true;
    }

    return delimitedFiles.every(dataType => dataType !== this.dataType);
  }

  get testConnectionDisabled() {
    return this.isDbSettings ? !this.form.valid :
      !this.fileSettingsForm.valid;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initDelimitedFilesSettingsForm();

    if (this.correctConnectionSettingsLoaded) {
      this.subscribeFormChange();
    }
  }

  onTestConnection() {
    const scanSettings = this.isDbSettings ? this.form.value : this.fileSettingsForm.value;
    const strategy = this.getTestConnectionStrategy();
    strategy(scanSettings);
  }

  onFileToScanChanged(files: File[]) {
    this.filesToScan = files;
    this.filesChange$.next(files);
  }

  subscribeFormChange(): void {
    const formStreams$ = this.isDbSettings ? [this.form.valueChanges]
      : [this.fileSettingsForm.valueChanges, this.filesChange$];

    const subscription = merge(...formStreams$, this.dataTypeChange$)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.connectionResult = null;
        this.connectionPropsChanged.emit();
        subscription.unsubscribe();
      });
  }

  createForm(disabled: boolean): FormGroup {
    return createDbConnectionForm(disabled, this.requireSchema, this.formBuilder);
  }

  private initDelimitedFilesSettingsForm(): void {
    const disabled = !this.dataType;

    this.fileSettingsForm = this.formBuilder.group({
      delimiter: [{value: null, disabled}, [Validators.required]]
    });

    if (disabled) {
      this.subscribeOnDataTypeChange(this.fileSettingsForm, [
        'delimiter'
      ]);
    }

    this.fileSettingsForm.patchValue({delimiter: this.fileSettings.delimiter});
  }

  private getTestConnectionStrategy() {
    if (this.isDbSettings) {
      return this.testConnectionStrategies['dbSettings'];
    } else {
      return this.testConnectionStrategies['fileSettings'];
    }
  }

  resetForm() {
    this.isDbSettings ? this.form.reset() : this.resetFileSettingsForm();
  }

  private resetFileSettingsForm() {
    this.fileSettingsForm.reset();
    this.onFileToScanChanged([]);
  }
}
