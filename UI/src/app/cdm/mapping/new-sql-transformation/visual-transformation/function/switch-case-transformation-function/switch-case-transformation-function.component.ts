import { Component, Inject } from '@angular/core';
import { TransformationFunctionComponent } from '@mapping/new-sql-transformation/visual-transformation/function/transformation-function.component';
import {
  anyValue,
  Case,
  SwitchCaseModel,
  SwitchCaseTransformationFunction
} from '@mapping/new-sql-transformation/visual-transformation/function/switch-case-transformation-function/switch-case-transformation-function';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(@Inject('function') transformationFunction: SwitchCaseTransformationFunction) {
    super(transformationFunction)
  }

  get cases(): Case[] {
    return this.formArray.value
  }

  get formArray(): FormArray {
    return this.form.get('cases') as FormArray
  }

  trackBy(index: number, value: Case) {
    return `${index}${value.in}${value.out}`
  }

  addRow() {
    const row = new FormGroup({
      in: new FormControl(null, [Validators.required]),
      out: new FormControl(null, [Validators.required])
    })

    if (this.hasDefault) {
      const index = this.formArray.length - 1
      this.formArray.insert(index, row)
    } else {
      this.formArray.push(row)
    }
  }

  addDefault() {
    const defaultRow = new FormGroup({
      in: new FormControl({value: anyValue, disabled: true}),
      out: new FormControl(null, [Validators.required])
    })
    this.formArray.push(defaultRow)
    this.hasDefault = true
  }

  onInput(event: Event) {
    setTimeout(() => (event.target as HTMLElement).focus())
  }
}
