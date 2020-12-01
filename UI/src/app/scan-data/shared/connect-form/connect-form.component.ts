import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { ConnectionResult } from '../../model/connection-result';
import { DbSettings } from '../../model/db-settings';
import { DelimitedTextFileSettings } from '../../model/delimited-text-file-settings';
import { BaseComponent } from '../base/base.component';
import { takeUntil } from 'rxjs/operators';
import { ScanSettings } from '../../model/scan-settings';
import { FileToScan } from '../../model/file-to-scan';

@Component({
  selector: 'app-connect-form',
  templateUrl: './connect-form.component.html',
  styleUrls: ['./connect-form.component.scss', '../../styles/scan-data-form.scss', '../../styles/scan-data-step.scss', '../../styles/scan-data-normalize.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectFormComponent extends BaseComponent implements OnInit {

  dbSettingsForm: FormGroup;

  fileSettingsForm: FormGroup;

  @Input()
  dataType: string;

  @Input()
  dbSettings: DbSettings;

  @Input()
  fileSettings: DelimitedTextFileSettings;

  @Input()
  connectionResult: ConnectionResult;

  @Input()
  filesToScan: FileToScan[];

  @Output()
  testConnection = new EventEmitter<ScanSettings>();

  @Output()
  connectionPropsChanged = new EventEmitter<void>();

  dataTypes = [
    'CSV files',
    'MySQL',
    'Oracle',
    'PostgreSQL',
    'Redshift',
    'SQL Server',
    'Azure',
    'MS Access',
    'Teradata',
    'BigQuery'
  ];

  get fileInputText() {
    return this.filesToScan
      .map(fileToScan => fileToScan.fileName)
      .join(', ');
  }

  private dataTypeChange$ = new Subject<string>();

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  get isDbSettings() {
    if (!this.dataType) {
      return true;
    }

    return this.dataType !== 'CSV files';
  }

  get testConnectionDisabled() {
    return this.isDbSettings ? this.dbSettingsForm.invalid :
      this.fileSettingsForm.invalid;
  }

  ngOnInit(): void {
    this.initDbSettingsForm();
    this.initDelimitedFilesSettingsForm();
  }

  onSubmit() {
    this.testConnection.emit(this.isDbSettings ? this.dbSettingsForm.value : this.fileSettingsForm.value);
  }

  subscribeFormChange(): void {
    const form = this.isDbSettings ? this.dbSettingsForm : this.fileSettingsForm;

    const subscription = merge(form.valueChanges, this.dataTypeChange$)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.connectionPropsChanged.emit();
        subscription.unsubscribe();
      });
  }

  onDataTypeChange(dataType: string) {
    this.dataType = dataType;
    this.dataTypeChange$.next(this.dataType);
  }

  private initDbSettingsForm(): void {
    const disabled = !this.dataType;

    this.dbSettingsForm = this.formBuilder.group({
      server: [{value: null, disabled}, [Validators.required]],
      user: [{value: null, disabled}, [Validators.required]],
      password: [{value: null, disabled}, [Validators.required]],
      database: [{value: null, disabled}, [Validators.required]]
    });

    if (disabled) {
      this.subscribeOnDataTypeChange(this.dbSettingsForm, [
        'server', 'user', 'password', 'database'
      ]);
    }

    this.dbSettingsForm.patchValue(this.dbSettings);
  }

  private initDelimitedFilesSettingsForm(): void {
    const disabled = !this.dataType;

    this.fileSettingsForm = this.formBuilder.group({
      delimiter: [{value: null, disabled}, [Validators.required]]
    });

    if (disabled) {
      this.subscribeOnDataTypeChange(this.fileSettingsForm, [
        'files', 'delimiter'
      ]);
    }

    this.fileSettingsForm.patchValue({delimiter: this.fileSettings.delimiter});
  }

  private subscribeOnDataTypeChange(form: FormGroup, controlNames: string[]) {
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
