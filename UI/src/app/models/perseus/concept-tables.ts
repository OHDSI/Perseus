import { Concept, IConcept } from '@models/perseus/concept'
import { ConceptLookup } from '@models/perseus/concept-lookup'

export interface IConceptTables {
    lookup: ConceptLookup;
    conceptsList: IConcept[];
}

export interface IConceptTablesOptions {
    lookup?: ConceptLookup;
    conceptsList?: IConcept[];
}

export class ConceptTables implements IConceptTables {
    lookup: ConceptLookup
    conceptsList: IConcept[];

    constructor(options: IConceptTablesOptions = {}) {
        this.lookup = options.lookup;
        this.conceptsList = options.conceptsList ? options.conceptsList.map((concept: any) => new Concept(concept)) : [];
    }
}
