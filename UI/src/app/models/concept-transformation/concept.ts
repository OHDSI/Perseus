export interface IConceptField{
    field: string;
    targetFieldName: string;
    targetCloneName: string;
    sql: string;
    sqlApplied: boolean;
    constant: string;
    selected: boolean;
    constantSelected: boolean;
    condition: string;
    alreadySelected: boolean;
}

export interface IConceptFields{
  concept_id: IConceptField;
  source_value: IConceptField;
  source_concept_id: IConceptField;
  type_concept_id: IConceptField;
}

export interface IConcept {
  id: number;
  fields: IConceptFields; // todo set type
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

export interface ITableConcepts {
  lookup: any;
  conceptsList: IConcept[];
}

export interface ITableConceptsOptions {
  lookup?: any;
  conceptsList?: IConcept[];
}

export class TableConcepts implements ITableConcepts {
  lookup: any
  conceptsList: IConcept[];

  constructor(options: ITableConceptsOptions = {}) {
    this.lookup = options.lookup;
    this.conceptsList = options.conceptsList ? options.conceptsList.map((concept: any) => new Concept(concept)) : [];
  }
}
