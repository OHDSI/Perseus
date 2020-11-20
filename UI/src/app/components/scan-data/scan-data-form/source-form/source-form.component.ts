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

  private subscription: Subscription;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    this.testConnection.emit(this.form.value);
  }

  subscribeFormChange(): void {
    this.subscription = this.form.valueChanges
      .subscribe(() => {
        this.connectionPropsChanged.emit();
        this.subscription.unsubscribe();
      });
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      dbType: ['SQL Server', [Validators.required]],
      server: ['822JNJ16S03V', [Validators.required]],
      user: ['cdm_builder', [Validators.required]],
      password: ['builder1!', [Validators.required]],
      database: ['CPRD', [Validators.required]]
    });
  }
}
