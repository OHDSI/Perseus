import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConnectionResult } from '../../model/connection-result';
import { DbSettings } from '../../model/db-settings';

@Component({
  selector: 'app-source-form',
  templateUrl: './source-form.component.html',
  styleUrls: ['./source-form.component.scss', '../../scan-data-step.scss', '../../scan-data-normalize.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourceFormComponent implements OnInit, OnDestroy {

  form: FormGroup;

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

  get dbSettings() {
    return this.form.value;
  }

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
    // this.form = this.formBuilder.group({
    //   dbType: ['SQL Server', [Validators.required]],
    //   server: ['822JNJ16S03V', [Validators.required]],
    //   user: ['cdm_builder', [Validators.required]],
    //   password: ['builder1!', [Validators.required]],
    //   database: ['CPRD', [Validators.required]]
    // });

    this.form = this.formBuilder.group({
      dbType: [null, [Validators.required]],
      server: [{value: null, disabled: true}, [Validators.required]],
      user: [{value: null, disabled: true}, [Validators.required]],
      password: [{value: null, disabled: true}, [Validators.required]],
      database: [{value: null, disabled: true}, [Validators.required]]
    });

    this.dbTypeChangeSubscription = this.form.get('dbType').valueChanges
      .subscribe(() => {
        const controlNames = ['server', 'user', 'password', 'database'];
        for (const name of controlNames) {
          console.log(this.form.get(name));
          this.form.get(name).enable();
        }
        this.dbTypeChangeSubscription.unsubscribe();
      });
  }
}
