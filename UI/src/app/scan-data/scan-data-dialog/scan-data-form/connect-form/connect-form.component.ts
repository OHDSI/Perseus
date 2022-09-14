import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, Observable, of, Subject, Subscription } from 'rxjs';
import { DbSettings } from '@models/white-rabbit/db-settings';
import { FilesSettings } from '@models/white-rabbit/files-settings';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { ScanSettings } from '@models/white-rabbit/scan-settings';
import {
  delimitedFiles,
  fullySupportedDatabases,
  supportedWithLimitationsDatabases
} from '../../../scan-data.constants';
import { AbstractResourceFormComponent } from '../../../auxiliary/resource-form/abstract-resource-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ScanDataService } from '@services/white-rabbit/scan-data.service';
import { TableToScan } from '@models/white-rabbit/table-to-scan';
import { ConnectionResult, WrConnectionResult } from '@models/white-rabbit/connection-result';
import { createDbConnectionForm } from '@utils/form';
import { DataTypeGroup } from '@models/white-rabbit/data-type-group';
import { hasLimits } from '@utils/scan-data-util';
import { ScanDataStateService } from '@services/white-rabbit/scan-data-state.service';
import { parseHttpError } from '@utils/error'

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
export class ConnectFormComponent extends AbstractResourceFormComponent implements OnInit {

  // dbSettingsForm
  form: FormGroup;

  fileSettingsForm: FormGroup;

  @Input()
  fileSettings: FilesSettings;

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

  fileTypes = delimitedFiles;

  dataTypesGroups: DataTypeGroup[] = [
    {
      name: 'Fully Supported',
      value: fullySupportedDatabases
    },
    {
      name: 'Supported with limitations',
      value: supportedWithLimitationsDatabases
    }
  ];

  private filesChange$ = new Subject<File[]>();

  private testConnectionSub: Subscription;

  private testConnectionStrategies: { [key: string]: (settings: ScanSettings) => Observable<WrConnectionResult> } = {
    dbSettings: (dbSettings: DbSettings) => {
      return this.whiteRabbitService.testConnection({...dbSettings, dbType: this.dataType})
        .pipe(
          map(connectionResult => ({
            ...connectionResult,
            tablesToScan: connectionResult.canConnect ? connectionResult.tableNames.map(tableName => ({
              tableName,
              selected: true
            })) : []
          }))
        )
    },
    fileSettings: () => {
      const tablesToScan = this.filesToScan
        .map(file => ({
          tableName: file.name,
          selected: true
        }))
      if (tablesToScan.length) {
        return of({canConnect: true, tablesToScan})
      } else {
        return of({canConnect: false, message: 'No files', tablesToScan})
      }
    }
  };

  constructor(formBuilder: FormBuilder,
              matDialog: MatDialog,
              private whiteRabbitService: ScanDataService,
              private scanDataStateService: ScanDataStateService) {
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
    return this.tryConnect || (
      this.isDbSettings ? !this.form.valid : !this.fileSettingsForm.valid
    )
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initDelimitedFilesSettingsForm();

    if (this.correctConnectionSettingsLoaded) {
      this.connectionResult = {canConnect: true}
      this.subscribeFormChange();
    }
  }

  onTestConnection(): void {
    let form: FormGroup;
    let scanSettings: ScanSettings;
    if (this.isDbSettings) {
      form = this.form
      scanSettings = {...form.value, dbType: this.dataType};
    } else {
      form = this.fileSettingsForm
      scanSettings = form.value
    }

    this.tryConnect = true;
    form.disable()
    this.testConnectionSub = this.getTestConnectionStrategy()(scanSettings)
      .pipe(
        finalize(() => {
          this.tryConnect = false
          form.enable({emitEvent: false})
        })
      )
      .subscribe(connectionResult => {
        this.connectionResult = connectionResult;
        this.connectionResultChange.emit(connectionResult);
        this.tablesToScanChange.emit(connectionResult.tablesToScan);
        if (connectionResult.canConnect) {
          this.subscribeFormChange();
        } else {
          this.showErrorPopup(connectionResult.message);
        }
      }, error => {
        this.connectionResult = {canConnect: false}
        this.connectionResultChange.emit(this.connectionResult)
        this.tablesToScanChange.emit([])
        this.showErrorPopup(parseHttpError(error))
      });
  }

  onCancelTestConnection(): void {
    this.testConnectionSub.unsubscribe();
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

  hasLimits(type: string): string | null {
    return hasLimits(type)
  }

  onDataTypeChange(value: string) {
    super.onDataTypeChange(value);
    this.scanDataStateService.dataType = value
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
    if (!this.tryConnect) {
      this.isDbSettings ? this.form.reset() : this.resetFileSettingsForm();
    }
  }

  private resetFileSettingsForm() {
    this.fileSettingsForm.reset();
    this.onFileToScanChanged([]);
  }
}
