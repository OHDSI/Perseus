export interface IConcept {
    id: number;
    fields: any;
  }

  export interface IConceptOptions {
    id?: number;
    fields?: any
  }

  export class Concept implements IConcept {
    id: number;
    fields: any

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
