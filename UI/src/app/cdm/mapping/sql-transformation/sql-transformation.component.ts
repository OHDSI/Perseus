import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SqlTransformMode } from '@models/transformation/sql-transform-mode';
import { VisualTransformationComponent } from '@mapping/sql-transformation/visual-transformation/visual-transformation.component';
import { SqlForTransformation } from '@models/transformation/sql-for-transformation';
import { ManualTransformationComponent } from '@mapping/sql-transformation/manual-transformation/manual-transformation.component';
import { Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FieldTypeService } from '@services/perseus/field-type.service';
import { FieldType } from '@utils/field-type';

@Component({
  selector: 'app-sql-transformation',
  templateUrl: './sql-transformation.component.html',
  styleUrls: ['./sql-transformation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SqlTransformationComponent implements OnInit {

  sqlForTransform: SqlForTransformation

  sql$ = new ReplaySubject<SqlForTransformation>(1)

  mode$: Observable<SqlTransformMode>

  mode: SqlTransformMode

  @ViewChild('visualTransformation')
  visualTransformationComponent: VisualTransformationComponent

  @ViewChild('manualTransformation')
  manualTransformationComponent: ManualTransformationComponent

  @Input()
  sourceFields: string

  @Input()
  functionsHeight = 236

  @Input()
  fieldType: string

  simplifiedFieldType: FieldType

  private modeChanged: boolean

  constructor(private fieldTypeService: FieldTypeService,
              private cdr: ChangeDetectorRef) {
  }

  get sqlForTransformation(): SqlForTransformation {
    return this.sqlComponent.sql
  }

  get sqlComponent(): VisualTransformationComponent | ManualTransformationComponent {
    return this.mode === 'visual' ? this.visualTransformationComponent : this.manualTransformationComponent
  }

  get dirty() {
    return this.modeChanged || this.visualTransformationComponent?.dirty || this.manualTransformationComponent?.dirty
  }

  get valid() {
    return this.mode === 'manual' || !this.visualTransformationComponent || this.visualTransformationComponent.valid
  }

  @Input()
  set sql(value: SqlForTransformation) {
    this.sqlForTransform = value
    this.sql$.next(value)
  }

  ngOnInit() {
    this.initFieldType()
    this.mode$ = this.sql$.pipe(
      map(sql => sql.mode ?? 'visual'),
      tap(mode => this.mode = mode)
    )
  }

  onModeChange(mode: SqlTransformMode) {
    this.modeChanged = true
    if (mode === 'manual') {
      this.sql = {...this.visualTransformationComponent.sql, mode}
    } else {
      this.sql = {mode}
    }
  }

  private initFieldType() {
    this.fieldTypeService.getSimplifiedType(this.fieldType)
      .subscribe(
        result => this.simplifiedFieldType = result,
        () => this.simplifiedFieldType = 'string',
        () => this.cdr.detectChanges()
      )
  }
}
