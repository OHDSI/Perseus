import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConnectionResult } from '../../model/connection-result';
import { DbSettings } from '../../model/db-settings';

@Component({
  selector: 'app-db-connect-form',
  templateUrl: './db-connect-from.component.html',
  styleUrls: ['./db-connect-from.component.scss', '../../styles/scan-data-form.scss', '../../styles/scan-data-step.scss', '../../styles/scan-data-normalize.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DbConnectFromComponent implements OnInit, OnDestroy {

  form: FormGroup;

  @Input()
  dbSettings: DbSettings;

  @Input()
  connectionResult: ConnectionResult;

  @Output()
  testConnection = new EventEmitter<DbSettings>();

  @Output()
  connectionPropsChanged = new EventEmitter<void>();

  databaseTypes = [
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

  private dbSettingChangeSubscription: Subscription;

  private dbTypeChangeSubscription: Subscription;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.dbSettingChangeSubscription && !this.dbSettingChangeSubscription.closed) {
      this.dbSettingChangeSubscription.unsubscribe();
    }

    if (this.dbTypeChangeSubscription && !this.dbTypeChangeSubscription.closed) {
      this.dbTypeChangeSubscription.unsubscribe();
    }
  }

  onSubmit() {
    this.testConnection.emit(this.form.value);
  }

  subscribeFormChange(): void {
    this.dbSettingChangeSubscription = this.form.valueChanges
      .subscribe(() => {
        this.connectionPropsChanged.emit();
        this.dbSettingChangeSubscription.unsubscribe();
      });
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      dbType: [null, [Validators.required]],
      server: [{value: null, disabled: true}, [Validators.required]],
      user: [{value: null, disabled: true}, [Validators.required]],
      password: [{value: null, disabled: true}, [Validators.required]],
      database: [{value: null, disabled: true}, [Validators.required]]
    });

    this.dbTypeChangeSubscription = this.form.get('dbType').valueChanges
      .subscribe(value => {
        if (value) {
          const controlNames = ['server', 'user', 'password', 'database'];
          for (const name of controlNames) {
            this.form.get(name).enable();
          }
          this.dbTypeChangeSubscription.unsubscribe();
        }
      });

    this.form.patchValue(this.dbSettings);
  }
}
