import { IConceptFields } from '@models/perseus/concept-field'

export interface IConcept {
  id: number;
  fields: IConceptFields;
}

export interface IConceptOptions {
  id?: number;
  fields?: IConceptFields;
}

export class Concept implements IConcept {
  id: number;
  fields: IConceptFields;

  constructor(options: IConceptOptions = {}) {
    this.id = options.id;
    this.fields = options.fields;
  }
}

