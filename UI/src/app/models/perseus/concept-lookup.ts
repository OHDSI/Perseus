import { Lookup } from '@models/perseus/lookup'

interface SimplifiedLookup {
  id?: number
  name: string
  lookupType: string
}

export interface IConceptLookup {
  [key: string]: Lookup
}

export class ConceptLookup implements IConceptLookup {
  // @ts-ignore
  @Type(() => SimplifiedLookup)
  [key: string]: Lookup
}
