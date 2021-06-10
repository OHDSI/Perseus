import { TransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/transformation-function';
import { FormArray, FormGroup } from '@angular/forms';

export interface Case {
  in: string,
  out: string
}

export interface SwitchCaseModel {
  cases: Case[]
}

export class SwitchCaseTransformationFunction extends TransformationFunction<SwitchCaseModel> {

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
    const reducer = (acc: string, curr: Case) => acc + `\n\tWHEN ${curr.in} THEN ${curr.out}`

    return (arg: string) => `CASE(${arg})${this.cases.reduce(reducer, '')}\nEND`;
  }
}
