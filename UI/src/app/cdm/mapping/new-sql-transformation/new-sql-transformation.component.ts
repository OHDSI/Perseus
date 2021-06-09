import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { SqlFunction } from '@models/transformation/sql-function';
import { transformationFunctionByType } from '@mapping/new-sql-transformation/new-sql-transformation';
import { filter, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@shared/base/base.component';

@Component({
  selector: 'app-new-sql-transformation',
  templateUrl: './new-sql-transformation.component.html',
  styleUrls: ['./new-sql-transformation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewSqlTransformationComponent extends BaseComponent {

  mode: 'visual' | 'manual' = 'visual'

  // Visual Mode
  functionTypes = [
    'REPLACE'
  ]

  functions: SqlFunction[] = []

  @ViewChild('editor')
  preview: ElementRef

  addFunction() {
    this.functions.push({
      type: null,
    })
  }

  remove(index: number) {
    this.functions[index].subscription?.unsubscribe()
    this.functions = this.functions.filter((_, i) => i !== index)
  }

  onFuncChange(type: string, index: number) {
    const func = this.functions[index]
    func.subscription?.unsubscribe()
    func.type = type
    func.value = transformationFunctionByType(type)
    func.subscription = func.value.change$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(() => this.functions.every(({value}) => value.valid))
      )
      .subscribe(() => this.updatePreview())
  }

  updatePreview() {
    let sql = ''
    this.functions
      .filter(func => func.type)
      .slice()
      .reverse()
      .forEach(func => sql = func.value.sql()(sql))

    console.log(sql)
  }
}
