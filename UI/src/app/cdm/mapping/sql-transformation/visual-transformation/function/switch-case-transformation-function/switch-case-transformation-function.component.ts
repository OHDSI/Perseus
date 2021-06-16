import { Component, Inject } from '@angular/core';
import { TransformationFunctionComponent } from '@mapping/sql-transformation/visual-transformation/function/transformation-function.component';
import {
  Case,
  SwitchCaseModel,
  SwitchCaseTransformationFunction
} from '@mapping/sql-transformation/visual-transformation/function/switch-case-transformation-function/switch-case-transformation-function';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-switch-case-transformation-function',
  templateUrl: './switch-case-transformation-function.component.html',
  styleUrls: [
    './switch-case-transformation-function.component.scss',
    '../../../../../../grid/grid.component.scss'
  ]
})
export class SwitchCaseTransformationFunctionComponent extends TransformationFunctionComponent<SwitchCaseModel> {

  displayedColumns = ['in', 'out']

  hasDefault = false

  constructor(@Inject('function') protected transformationFunction: SwitchCaseTransformationFunction) {
    super(transformationFunction)
  }

  get cases(): Case[] {
    return this.formArray.value
  }

  get formArray(): FormArray {
    return this.form.get('cases') as FormArray
  }

  trackBy(index: number, value: Case): string {
    return `${value.id}`
  }

  addRow() {
    const row = this.transformationFunction.createRowControl({id: this.newId()})

    if (this.hasDefault) {
      const index = this.formArray.length - 1
      this.formArray.insert(index, row)
    } else {
      this.formArray.push(row)
    }
  }

  addDefault() {
    const defaultRow = this.transformationFunction.createDefaultRowControl({id: this.newId()})
    this.formArray.push(defaultRow)
    this.hasDefault = true
  }

  remove(index: number) {
    this.formArray.removeAt(index)
  }

  private newId() {
    return this.formArray.length + 1
  }
}
