import { ConceptTables } from '@models/perseus/concept-tables'

export interface IConcepts {
  [key: string]: ConceptTables
}

export class Concepts implements IConcepts {
  // @ts-ignore
  @Type(() => ConceptTables)
  [key: string]: ConceptTables
}
