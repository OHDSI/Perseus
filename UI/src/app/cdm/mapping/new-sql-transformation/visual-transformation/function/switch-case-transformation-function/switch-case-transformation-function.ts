import { TransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/transformation-function';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

export const anyValue = 'Any value'

export interface Case {
  id: number,
  in?: string,
  out?: string
  isDefault?: boolean
}

export interface SwitchCaseModel {
  cases: Case[]
}

export class SwitchCaseTransformationFunction extends TransformationFunction<SwitchCaseModel> {

  constructor(value?: SwitchCaseModel) {
    super()
    if (value) {
      value.cases
        .map(c => c.isDefault ? this.createDefaultRowControl(c) : this.createRowControl(c))
        .forEach(c => this.formArray.push(c))
    }
  }

  get formArray() {
    return this.form.get('cases') as FormArray
  }

  get valid() {
    return this.formArray.length !== 0 && this.form.valid
  }

  private get cases(): Case[] {
    return this.formArray.value as Case[]
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      cases: new FormArray([])
    })
  }

  sql(): (arg: string) => string {
    const cases = [...this.cases]
    let defaultBlock = ''
    if (!cases[cases.length - 1].in) {
      const defaultCase = cases.pop()
      defaultBlock = `\n\tELSE ${defaultCase.out}`
    }

    const reducer = (acc: string, curr: Case) => acc + `\n\tWHEN ${curr.in} THEN ${curr.out}`

    return (arg: string) => `CASE(${arg})${cases.reduce(reducer, '')}${defaultBlock}\nEND`;
  }

  createRowControl(value: Case) {
    return new FormGroup({
      id: new FormControl(value.id, [Validators.required]),
      in: new FormControl(value?.in, [Validators.required]),
      out: new FormControl(value?.out, [Validators.required]),
      isDefault: new FormControl(false, [Validators.required])
    })
  }

  createDefaultRowControl(value: Case) {
    return new FormGroup({
      id: new FormControl(value.id, [Validators.required]),
      in: new FormControl(anyValue),
      out: new FormControl(value?.out, [Validators.required]),
      isDefault: new FormControl(true, [Validators.required])
    })
  }
}
