import { TransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/transformation-function';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

export const anyValue = 'Any value'

export interface Case {
  id: number,
  in?: string | number,
  out?: string | number,
  isDefault?: boolean
}

export interface SwitchCaseModel {
  cases: Case[]
}

export type FieldType = 'digit' | 'string' | 'date'

export class SwitchCaseTransformationFunction extends TransformationFunction<SwitchCaseModel> {

  private type: FieldType = 'string'

  set fieldType(type: FieldType) {
    this.type = type
  }

  constructor(value?: SwitchCaseModel, fieldType: FieldType = 'string') {
    super()
    const parsed = value ? value : {cases: [{id: 1}]}
    parsed.cases
      .map(c => c.isDefault ? this.createDefaultRowControl(c) : this.createRowControl(c))
      .forEach(c => this.formArray.push(c))
    this.fieldType = fieldType
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
    const shaper = this.getValueShaper()
    let defaultBlock = ''
    if (cases[cases.length - 1].isDefault) {
      const defaultCase = cases.pop()
      defaultBlock = `\n\tELSE ${shaper(defaultCase.out)}`
    }
    const reducer = (acc: string, curr: Case) => acc + `\n\tWHEN ${shaper(curr.in)} THEN ${shaper(curr.out)}`

    return (arg: string) => `CASE(${arg})${cases.reduce(reducer, '')}${defaultBlock}\nEND`;
  }

  createRowControl(value: Case) {
    return new FormGroup({
      id: new FormControl(value.id, [Validators.required]),
      in: new FormControl(value.in, [Validators.required]),
      out: new FormControl(value.out, [Validators.required]),
      isDefault: new FormControl(false, [Validators.required])
    })
  }

  createDefaultRowControl(value: Case) {
    return new FormGroup({
      id: new FormControl(value.id, [Validators.required]),
      in: new FormControl({value: anyValue, disabled: true}),
      out: new FormControl(value.out, [Validators.required]),
      isDefault: new FormControl(true, [Validators.required])
    })
  }

  private getValueShaper(): (value: string | number) => string {
    switch (this.type) {
      case 'string':
        return (value: string) => `'${value}'`
      case 'digit':
        return (value: number) => `${value}`
      case 'date':
        return (value: string) => value
      default:
        throw new Error('Unsupported switch case data type')
    }
  }
}
