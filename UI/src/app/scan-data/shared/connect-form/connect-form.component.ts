import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, of } from 'rxjs';
import { DbSettings } from '../../model/db-settings';
import { DelimitedTextFileSettings } from '../../model/delimited-text-file-settings';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { ScanSettings } from '../../model/scan-settings';
import { FileToScan } from '../../model/file-to-scan';
import { delimitedFiles, whiteRabbitDatabaseTypes } from '../../scan-data.constants';
import { AbstractResourceForm } from '../abstract-resource-form/abstract-resource-form';
import { MatDialog } from '@angular/material/dialog';
import { WhiteRabbitService } from '../../../services/white-rabbit.service';
import { TableToScan } from '../../model/table-to-scan';
import { ConnectionResult } from '../../model/connection-result';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-connect-form',
  templateUrl: './connect-form.component.html',
  styleUrls: [
    './connect-form.component.scss',
    '../../styles/scan-data-form.scss',
    '../../styles/scan-data-step.scss',
    '../../styles/scan-data-normalize.scss',
    '../../styles/scan-data-connect-form.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectFormComponent extends AbstractResourceForm implements OnInit {

  // dbSettingsForm
  form: FormGroup;

  fileSettingsForm: FormGroup;

  @Input()
  fileSettings: DelimitedTextFileSettings;

  @Input()
  filesToScan: FileToScan[];

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

  formControlNames = [
    'server', 'user', 'password', 'database'
  ];

  private filesChange$ = new Subject<FileToScan[]>();

  private testConnectionStrategies: { [key: string]: (settings: ScanSettings) => void } = {
    dbSettings: (settings: ScanSettings) => {
      const dbSettings = settings as DbSettings;
      dbSettings.dbType = this.dataType;

      this.connecting = true;

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
            this.connecting = false;
          })
        )
        .subscribe(tablesToScan => {
          this.tablesToScanChange.emit(tablesToScan);
        }, error => {
          this.connectionResult = {canConnect: false, message: error.message};
          this.tablesToScanChange.emit([]);
          this.connectionResultChange.emit(this.connectionResult);
          this.connecting = false;
          this.showErrorPopup(this.connectionResult.message);
        });
    },

    fileSettings: (settings: ScanSettings) => {
      this.connectionResult = {canConnect: true, message: ''};
      this.subscribeFormChange();
      const tables = this.filesToScan
        .map(fileToScan => ({
          tableName: fileToScan.fileName,
          selected: true
        }));
      this.connectionResultChange.emit(this.connectionResult);
      this.tablesToScanChange.emit(tables);
    }
  };

  constructor(formBuilder: FormBuilder,
              matDialog: MatDialog,
              private whiteRabbitService: WhiteRabbitService) {
    super(formBuilder, matDialog);
  }

  get fileInputText() {
    const result = this.filesToScan
      .map(fileToScan => fileToScan.fileName)
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
  }

  onTestConnection() {
    const scanSettings = this.isDbSettings ? this.form.value : this.fileSettingsForm.value;
    const strategy = this.getTestConnectionStrategy();
    strategy(scanSettings);
  }

  onFileToScanChanged(files: FileToScan[]) {
    this.filesToScan = files;
    this.filesChange$.next(files);
  }

  subscribeFormChange(): void {
    const form = this.isDbSettings ? this.form : this.fileSettingsForm;

    const subscription = merge(form.valueChanges, this.dataTypeChange$, this.filesChange$)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.connectionResult = null;
        this.connectionPropsChanged.emit();
        subscription.unsubscribe();
      });
  }

  createForm(disabled: boolean): FormGroup {
    return this.formBuilder.group({
      server: [{value: null, disabled}, [Validators.required]],
      user: [{value: null, disabled}, [Validators.required]],
      password: [{value: null, disabled}, [Validators.required]],
      database: [{value: null, disabled}, [Validators.required]]
    });
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
}
