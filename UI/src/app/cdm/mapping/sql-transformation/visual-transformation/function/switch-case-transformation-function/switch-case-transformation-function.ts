import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldType } from '@utils/field-type';
import { ValidationService } from '@services/validation.service';
import { TypedTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/typed-transformation-function';

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

export class SwitchCaseTransformationFunction extends TypedTransformationFunction<SwitchCaseModel> {

  protected validationService: ValidationService

  constructor(value?: SwitchCaseModel, fieldType?: FieldType) {
    super(null, fieldType)
    this.validationService = new ValidationService()
    const parsedValue = value ? value : {cases: [{id: 1}]}
    parsedValue.cases
      .map(c => c.isDefault ? this.createDefaultRowControl(c) : this.createRowControl(c))
      .forEach(c => this.formArray.push(c))
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
      in: new FormControl(value.in, [Validators.required, this.fieldTypeValidator]),
      out: new FormControl(value.out, [Validators.required, this.fieldTypeValidator]),
      isDefault: new FormControl(false, [Validators.required])
    })
  }

  createDefaultRowControl(value: Case) {
    return new FormGroup({
      id: new FormControl(value.id, [Validators.required]),
      in: new FormControl({value: anyValue, disabled: true}),
      out: new FormControl(value.out, [Validators.required, this.fieldTypeValidator]),
      isDefault: new FormControl(true, [Validators.required])
    })
  }
}
